import { Request, Response, NextFunction } from 'express';
import { ServiceError } from "@hotel/helpers"
import { sequelize, BookingModel, BookingDetailModel, PaymentModel, RoomModel, RoomTypeModel, PaymentTypeModel, CheckInCheckOutModel, CancelModel } from "@hotel/models"
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
            additional_charges,
            member_id
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
        // Defaulting for demo if middleware not yet fully integrated

        // 3. Create Booking
        const booking = await BookingModel.create({
            booking_id: nextBookingId,
            create_datetime: new Date(),
            booking_status: req.file ? 'P' : 'U', // P if slip uploaded, U for Unpaid
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

        // 5. Create Stay Details (Check In/Out)
        const lastStay = await CheckInCheckOutModel.findOne({ order: [['stay_id', 'DESC']] });
        let nextStayId = '0000001';
        if (lastStay) {
            const lastIdNum = parseInt(lastStay.stay_id);
            if (!isNaN(lastIdNum)) {
                nextStayId = (lastIdNum + 1).toString().padStart(7, '0');
            }
        }

        await CheckInCheckOutModel.create({
            stay_id: nextStayId,
            checkin_date: new Date(check_in_date),
            checkout_date: new Date(check_out_date),
            booking_id: nextBookingId
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
            payment_status: req.file ? 'P' : 'U', // P if slip uploaded, U for Unpaid
            slip_url: slip_url,
            // Temporarily set 1 minute from now for testing (original: 24 hours)
            payment_due_time: new Date(Date.now() + 1 * 60 * 1000),
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
export const getMyBookings = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: member_id } = res.locals.user;

        const bookings = await BookingModel.findAll({
            where: { member_id },
            include: [
                {
                    model: BookingDetailModel,
                    as: 'booking_details',
                    include: [
                        {
                            model: RoomModel,
                            as: 'room',
                            include: [
                                {
                                    model: RoomTypeModel,
                                    as: 'room_type'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: PaymentModel,
                    as: 'payments',
                    attributes: [
                        'payment_status', 
                        'payment_id', 
                        'payment_due_time',
                        [sequelize.literal('EXTRACT(EPOCH FROM (payment_due_time - CURRENT_TIMESTAMP))'), 'remaining_seconds_db']
                    ]
                },
                {
                    model: CheckInCheckOutModel,
                    as: 'stay_details'
                },
                {
                    model: PaymentTypeModel,
                    as: 'payment_type'
                }
            ],
            order: [['create_datetime', 'DESC']]
        });

        const bookingsWithRemaining = bookings.map(b => {
            const plain = b.get({ plain: true }) as any;
            if (plain.payments && plain.payments[0]) {
                // Use the calculated value from DB if available, otherwise fallback
                plain.payments[0].remaining_seconds = Math.max(0, Math.floor(plain.payments[0].remaining_seconds_db || 0));
            }
            return plain;
        });

        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get My Bookings successfully',
            data: bookingsWithRemaining
        };
        next();
    } catch (error) {
        console.error('Get My Bookings Error:', error);
        next(error);
    }
}

export const getBookingById = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const booking = await BookingModel.findByPk(id, {
            include: [
                {
                    model: BookingDetailModel,
                    as: 'booking_details',
                    include: [
                        {
                            model: RoomModel,
                            as: 'room',
                            include: [{ model: RoomTypeModel, as: 'room_type' }]
                        }
                    ]
                },
                {
                    model: PaymentModel,
                    as: 'payments',
                    attributes: [
                        'payment_status', 
                        'payment_id', 
                        'payment_due_time',
                        'slip_url',
                        'payment_date',
                        'booking_id',
                        'employee_id',
                        [sequelize.literal('EXTRACT(EPOCH FROM (payment_due_time - CURRENT_TIMESTAMP))'), 'remaining_seconds_db']
                    ]
                },
                {
                    model: CheckInCheckOutModel,
                    as: 'stay_details'
                },
                {
                    model: PaymentTypeModel,
                    as: 'payment_type'
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ res_code: '0404', res_desc: 'Booking not found' });
        }

        const plainBooking = booking.get({ plain: true }) as any;
        if (plainBooking.payments && plainBooking.payments[0]) {
            plainBooking.payments[0].remaining_seconds = Math.max(0, Math.floor(plainBooking.payments[0].remaining_seconds_db || 0));
        }

        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get Booking successfully',
            data: plainBooking
        };
        next();
    } catch (error) {
        console.error('Get Booking Error:', error);
        next(error);
    }
}

export const submitPaymentSlip = () => async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { booking_id } = req.body;

        if (!booking_id || !req.file) {
            await transaction.rollback();
            return res.status(400).json({ res_code: '0400', res_desc: 'Missing booking ID or payment slip' });
        }

        const payment = await PaymentModel.findOne({
            where: { booking_id, payment_status: 'U' },
            transaction
        });

        if (!payment) {
            await transaction.rollback();
            return res.status(404).json({ res_code: '0404', res_desc: 'Unpaid payment record not found' });
        }

        // Handle Slip Upload
        const uniqueSuffix = uuidv4();
        const ext = path.extname(req.file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
        const slip_url = `/uploads/${filename}`;

        // Update Payment
        payment.slip_url = slip_url;
        payment.payment_status = 'P'; // Move to Pending verification
        payment.payment_date = new Date();
        await payment.save({ transaction });

        // Update Booking
        const booking = await BookingModel.findByPk(booking_id, { transaction });
        if (booking) {
            booking.booking_status = 'P';
            await booking.save({ transaction });
        }

        await transaction.commit();
        res.locals.response = { res_code: '0000', res_desc: 'Payment slip submitted successfully' };
        next();
    } catch (error) {
        await transaction.rollback();
        console.error('Submit Payment Error:', error);
        next(error);
    }
}

export const cancelBooking = () => async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { booking_id } = req.body;
        const { id: member_id } = res.locals.user;

        if (!booking_id) {
            await transaction.rollback();
            return res.status(400).json({ res_code: '0400', res_desc: 'Missing booking ID' });
        }

        // 1. Find Booking
        const booking = await BookingModel.findOne({
            where: { booking_id, member_id },
            transaction
        });

        if (!booking) {
            await transaction.rollback();
            return res.status(404).json({ res_code: '0404', res_desc: 'Booking not found' });
        }

        // 2. Only allow canceling 'U' (Unpaid) bookings
        if (booking.booking_status !== 'U') {
            await transaction.rollback();
            return res.status(400).json({
                res_code: '0400',
                res_desc: 'Only unpaid bookings can be cancelled manually'
            });
        }

        // 3. Generate Cancel ID
        const lastCancel = await CancelModel.findOne({ order: [['cancel_id', 'DESC']], transaction });
        let nextCancelId = '0000001';
        if (lastCancel) {
            const lastIdNum = parseInt(lastCancel.cancel_id);
            if (!isNaN(lastIdNum)) {
                nextCancelId = (lastIdNum + 1).toString().padStart(7, '0');
            }
        }

        // 4. Update Booking Status
        booking.booking_status = 'C';
        await booking.save({ transaction });

        // 5. Update Payment Status (if any)
        const payment = await PaymentModel.findOne({ where: { booking_id }, transaction });
        if (payment) {
            payment.payment_status = 'C';
            await payment.save({ transaction });
        }

        // 6. Create Cancel Record
        await CancelModel.create({
            cancel_id: nextCancelId,
            cancel_date: new Date(),
            cancel_type: 'M', // Member
            booking_id: booking_id
        }, { transaction });

        await transaction.commit();
        res.locals.response = { res_code: '0000', res_desc: 'Booking cancelled successfully' };
        next();
    } catch (error) {
        await transaction.rollback();
        console.error('Cancel Booking Error:', error);
        next(error);
    }
}
