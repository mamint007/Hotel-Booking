import { Request, Response, NextFunction } from 'express';
import { ServiceError } from "@hotel/helpers"
import { sequelize, BookingModel, BookingDetailModel, PaymentModel, RoomModel } from "@hotel/models"
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const createBooking = () => async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            room_id,
            check_in_date,
            check_out_date,
            number_of_nights,
            total_price,
            number_of_guests,
            payment_type,
            additional_charges
        } = req.body;

        // Validation
        if (!room_id || !check_in_date || !check_out_date || !total_price) {
            await transaction.rollback();
            return res.status(400).json({
                res_code: '0400',
                res_desc: 'Missing required booking information'
            });
        }

        // 1. Generate IDs
        // Booking ID
        const lastBooking = await BookingModel.findOne({ order: [['booking_id', 'DESC']] });
        let nextBookingId = '0000001';
        if (lastBooking) {
            const lastIdNum = parseInt(lastBooking.booking_id);
            if (!isNaN(lastIdNum)) {
                nextBookingId = (lastIdNum + 1).toString().padStart(7, '0');
            }
        }

        // Booking Detail ID
        const lastDetail = await BookingDetailModel.findOne({ order: [['booking_detail_id', 'DESC']] });
        let nextDetailId = '0000001';
        if (lastDetail) {
            const lastIdNum = parseInt(lastDetail.booking_detail_id);
            if (!isNaN(lastIdNum)) {
                nextDetailId = (lastIdNum + 1).toString().padStart(7, '0');
            }
        }

        // Payment ID
        const lastPayment = await PaymentModel.findOne({ order: [['payment_id', 'DESC']] });
        let nextPaymentId = '0000001';
        if (lastPayment) {
            const lastIdNum = parseInt(lastPayment.payment_id);
            if (!isNaN(lastIdNum)) {
                nextPaymentId = (lastIdNum + 1).toString().padStart(7, '0');
            }
        }

        // 2. Handle Member ID (Assume from auth middleware, or use a default for now)
        // In a real app, res.locals.user.id would be set by verifyToken middleware
        const member_id = res.locals.user?.id || 'M000001'; // Defaulting for demo if middleware not yet fully integrated

        // 3. Create Booking
        const booking = await BookingModel.create({
            booking_id: nextBookingId,
            create_datetime: new Date(),
            booking_status: 'P', // P for Pending (waiting for slip verification)
            is_review: 'N',
            member_id: member_id,
            payment_type_id: payment_type === 'PTH' ? 'P02' : 'P01',
            promo_id: null
        }, { transaction });

        // 4. Create Booking Detail
        await BookingDetailModel.create({
            booking_detail_id: nextDetailId,
            price_at_booking: parseFloat(total_price),
            number_of_nights: parseInt(number_of_nights),
            booking_id: nextBookingId,
            room_id: room_id
        }, { transaction });

        // 5. Handle Slip Upload
        let slip_url = null;
        if (req.file) {
            const uniqueSuffix = uuidv4();
            const ext = path.extname(req.file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
            slip_url = `/uploads/${filename}`;
        }

        // 6. Create Payment
        await PaymentModel.create({
            payment_id: nextPaymentId,
            payment_date: new Date(),
            payment_status: 'P', // P for Pending verification
            slip_url: slip_url,
            payment_due_time: moment().add(15, 'minutes').toDate(),
            booking_id: nextBookingId,
            employee_id: null
        }, { transaction });

        await transaction.commit();

        res.locals.response = {
            res_code: '0000',
            res_desc: 'Booking created successfully',
            data: {
                booking_id: nextBookingId
            }
        };
        next();

    } catch (error) {
        await transaction.rollback();
        console.error('Booking Error:', error);
        next(error);
    }
}
