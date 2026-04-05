import { Request, Response, NextFunction } from 'express';
import { ServiceError } from "@hotel/helpers"
import AdminMasterError from '../constants/errors/admin.error.json'
import { sequelize, EmployeeModel, RoleModel, RoomModel, RoomTypeModel, BookingModel, MemberModel, PaymentTypeModel, BookingDetailModel, CheckInCheckOutModel, PaymentModel, PromotionModel, AmenityModel, RoomTypeDetailModel, CancelModel, AdditionalChargeModel, BookingAdditionalChargeModel } from "@hotel/models"
import jwt from 'jsonwebtoken'
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const login = () => async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_REQUIRED))
    }

    try {
        // Find employee by email
        const employee = await EmployeeModel.findOne({
            where: { emp_email: email },
            include: [{
                model: RoleModel,
                as: 'role',
            }]
        })

        if (!employee) {
            return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_FAIL))
        }

        // Verify password (direct comparison for now as per Member implementation)
        // In production, should use bcrypt or similar
        const isMatch = employee.emp_password === password
        if (!isMatch) {
            return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_FAIL))
        }

        // Check if role exists and is active (Optional but good practice)
        if (employee.role_id) {
            const role = await RoleModel.findByPk(employee.role_id)
            if (!role || role.is_active !== 'A') {
                // Maybe specific error for inactive role, reusing login fail for security
                return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_FAIL))
            }
        }

        const accessToken = jwt.sign(
            {
                id: employee.employee_id,
                email: employee.emp_email,
                role: employee.role?.role_name, // Or use dynamic role name from RoleModel
                role_id: employee.role_id
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        )

        res.locals.token = accessToken
        res.locals.employee = employee
        return next()

    } catch (error) {
        next(error)
    }
}

export const getAllEmployees = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await EmployeeModel.findAll({
            attributes: { exclude: ['emp_password'] },
            include: [{
                model: RoleModel,
                as: 'role',
                attributes: ['role_name']
            }],
            order: [['employee_id', 'ASC']]
        });

        res.locals.employees = employees;
        next();
    } catch (error) {
        next(error);
    }
}

export const getAllRooms = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await RoomModel.findAll({
            include: [
                {
                    model: RoomTypeModel,
                    as: 'room_type',
                    attributes: ['room_type_name']
                },
                {
                    model: AmenityModel,
                    as: 'amenities',
                    attributes: ['amenity_id', 'amenity_name', 'amenity_icon'],
                    through: { attributes: [] }
                }
            ],
            order: [['room_number', 'ASC']]
        });

        res.locals.rooms = rooms;
        next();
    } catch (error) {
        next(error);
    }
}

export const getAllRoomTypes = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomTypes = await RoomTypeModel.findAll({
            order: [['room_type_id', 'ASC']]
        });

        res.locals.roomTypes = roomTypes;
        next();
    } catch (error) {
        next(error);
    }
}

export const getAllAmenities = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const amenities = await AmenityModel.findAll();
        res.locals.amenities = amenities;
        next();
    } catch (error) {
        next(error);
    }
}

export const getAllBookings = () => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const bookings = await BookingModel.findAll({
            include: [
                {
                    model: MemberModel,
                    as: 'member',
                    attributes: ['m_email']
                },
                {
                    model: PaymentTypeModel,
                    as: 'payment_type',
                    attributes: ['payment_type_name']
                },
                {
                    model: CheckInCheckOutModel,
                    as: 'stay_details',
                    attributes: ['stay_id', 'checkin_date', 'checkout_date']
                },
                {
                    model: BookingDetailModel,
                    as: 'booking_details',
                    include: [{
                        model: RoomModel,
                        as: 'room',
                        attributes: ['room_number']
                    }]
                }
            ],
            order: [['booking_id', 'DESC']]
        });

        // Convert to plain objects and format dates to Thailand timezone
        const plainBookings = bookings.map(b => {
            const plain = b.get({ plain: true }) as any;
            if (plain.create_datetime) {
                plain.create_datetime = new Date(plain.create_datetime).toLocaleString('sv-SE', {
                    timeZone: 'Asia/Bangkok',
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                }).replace(' ', 'T');
            }
            return plain;
        });

        res.locals.bookings = plainBookings;
        next();
    } catch (error) {
        next(error);
    }
}


export const getAllPayments = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await PaymentModel.findAll({
            include: [
                {
                    model: BookingModel,
                    as: 'booking',
                    attributes: ['booking_status']
                }
            ],
            order: [['payment_id', 'DESC']]
        });

        // Convert to plain objects and format dates to Thailand timezone
        const plainPayments = payments.map(p => {
            const plain = p.get({ plain: true }) as any;
            if (plain.payment_date) {
                plain.payment_date = new Date(plain.payment_date).toLocaleString('sv-SE', {
                    timeZone: 'Asia/Bangkok',
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                }).replace(' ', 'T');
            }
            if (plain.payment_due_time) {
                plain.payment_due_time = new Date(plain.payment_due_time).toLocaleString('sv-SE', {
                    timeZone: 'Asia/Bangkok',
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                }).replace(' ', 'T');
            }
            return plain;
        });

        res.locals.payments = plainPayments;
        next();
    } catch (error) {
        next(error);
    }
}


export const getAllPromotions = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promotions = await PromotionModel.findAll({
            include: [{
                model: EmployeeModel,
                as: 'employee',
                attributes: ['emp_firstname', 'emp_lastname']
            }],
            order: [['promo_id', 'ASC']]
        });

        res.locals.promotions = promotions;
        next();
    } catch (error) {
        next(error);
    }
}


export const createEmployee = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { emp_firstname, emp_lastname, emp_sex, emp_tel, emp_email, emp_password, role_id } = req.body;

        if (!emp_firstname || !emp_lastname || !emp_sex || !emp_tel || !emp_email || !emp_password || !role_id) {
            return next(new ServiceError(AdminMasterError.ERR_EMPLOYEE_CREATE_REQUIRED));
        }

        // Generate Employee ID
        const lastEmployee = await EmployeeModel.findOne({
            order: [['employee_id', 'DESC']]
        });

        let nextId = 'E001';
        if (lastEmployee) {
            const lastIdNum = parseInt(lastEmployee.employee_id.substring(1));
            if (!isNaN(lastIdNum)) {
                nextId = `E${(lastIdNum + 1).toString().padStart(3, '0')}`;
            }
        }

        const newEmployee = await EmployeeModel.create({
            employee_id: nextId,
            emp_firstname,
            emp_lastname,
            emp_sex,
            emp_tel,
            emp_email,
            emp_password,
            role_id
        });

        res.locals.employee = newEmployee;
        next();


    } catch (error) {
        next(error);
    }
}

export const updateEmployeeStatus = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (!id || is_active === undefined) {
            return next(new ServiceError(AdminMasterError.ERR_EMPLOYEE_UPDATE_REQUIRED || 'Employee ID and is_active are required'));
        }

        const employee = await EmployeeModel.findByPk(id);
        if (!employee) {
            return next(new ServiceError(AdminMasterError.ERR_EMPLOYEE_NOT_FOUND || 'Employee not found'));
        }

        employee.is_active = is_active ? 'A' : 'I';
        await employee.save();

        res.locals.employee = employee;
        next();

    } catch (error) {
        next(error);
    }
}



export const deleteUser = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(new ServiceError(AdminMasterError.ERR_USER_ID_REQUIRED));
        }

        const user = await MemberModel.findByPk(id);
        if (!user) {
            return next(new ServiceError(AdminMasterError.ERR_USER_NOT_FOUND));
        }

        user.is_deleted = true;
        await user.save();

        res.locals.response = { message: 'User deleted successfully' };
        next();

    } catch (err) {
        return next(err);
    }
}


export const createRoom = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { room_number, floor, price_per_night, bed_type, bed_quantity, max_guest, room_status, room_type_id, amenity_ids } = req.body;
        if (!room_number || !floor || !price_per_night || !bed_type || !bed_quantity || !max_guest || !room_status || !room_type_id) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_CREATE_REQUIRED));
        }

        // Generate Room ID (RM01, RM02, etc.)
        const lastRoom = await RoomModel.findOne({
            order: [['room_id', 'DESC']]
        });

        let nextId = 'RM01';
        if (lastRoom) {
            const lastIdNum = parseInt(lastRoom.room_id.substring(2)); // Extract number from RMxx
            if (!isNaN(lastIdNum)) {
                nextId = `RM${(lastIdNum + 1).toString().padStart(2, '0')}`;
            }
        }

        // Check if room_number already exists
        const existingRoomByNumber = await RoomModel.findOne({ where: { room_number } });
        if (existingRoomByNumber) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_NUMBER_EXISTS));
        }

        // Generate filename
        let room_image = null;
        let filename = null;
        if (req.file) {
            const uniqueSuffix = uuidv4();
            const ext = path.extname(req.file.originalname);
            filename = `${uniqueSuffix}${ext}`;
            room_image = `/uploads/${filename}`;
        }

        const newRoom = await RoomModel.create({
            room_id: nextId,
            room_number,
            floor,
            room_image, // Save the path to DB
            price_per_night,
            bed_type,
            bed_quantity,
            max_guest,
            room_status,
            room_type_id
        });

        // After successful DB creation, save the file
        if (req.file && filename) {
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
        }

        // Handle Amenities
        if (amenity_ids) {
            // amenity_ids might be a string (comma separated) or array
            let ids: string[] = [];
            if (Array.isArray(amenity_ids)) {
                ids = amenity_ids;
            } else if (typeof amenity_ids === 'string') {
                ids = amenity_ids.split(',');
            }

            if (ids.length > 0) {
                const details = ids.map(id => ({
                    room_id: newRoom.room_id,
                    amenity_id: id.trim()
                }));
                await RoomTypeDetailModel.bulkCreate(details);
            }
        }

        res.locals.room = newRoom;
        next();

    } catch (err) {
        return next(err);
    }
}


export const updateRoom = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { room_number, floor, price_per_night, bed_type, bed_quantity, max_guest, room_status, room_type_id, amenity_ids } = req.body;

        // Handle file upload manually if present
        let room_image = undefined;
        let filename = null;
        if (req.file) {
            const uniqueSuffix = uuidv4();
            const ext = path.extname(req.file.originalname);
            filename = `${uniqueSuffix}${ext}`;
            room_image = `/uploads/${filename}`;
        }

        if (!id) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_ID_REQUIRED));
        }

        const room = await RoomModel.findByPk(id);
        if (!room) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_NOT_FOUND));
        }

        // Check if new room_number already exists (and is not that of the current room)
        if (room_number && room_number !== room.room_number) {
            const existingRoomByNumber = await RoomModel.findOne({ where: { room_number } });
            if (existingRoomByNumber) {
                return next(new ServiceError(AdminMasterError.ERR_ROOM_NUMBER_EXISTS));
            }
        }

        // Only update fields that are present in the request body
        // and ensure numeric fields are numbers
        const updates: any = {};
        if (room_number !== undefined) updates.room_number = room_number;
        if (floor !== undefined) updates.floor = Number(floor);
        if (price_per_night !== undefined) updates.price_per_night = Number(price_per_night);
        if (bed_type !== undefined) updates.bed_type = bed_type;
        if (bed_quantity !== undefined) updates.bed_quantity = Number(bed_quantity);
        if (max_guest !== undefined) updates.max_guest = Number(max_guest);
        if (room_status !== undefined) updates.room_status = room_status;
        if (room_type_id !== undefined) updates.room_type_id = room_type_id;
        if (room_image !== undefined) updates.room_image = room_image;

        await room.update(updates);

        // After successful DB update, save the file
        if (req.file && filename) {
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
        }

        // Handle Amenities Update
        if (amenity_ids !== undefined) {
            // Delete existing
            await RoomTypeDetailModel.destroy({ where: { room_id: id } });

            let ids: string[] = [];
            if (Array.isArray(amenity_ids)) {
                ids = amenity_ids;
            } else if (typeof amenity_ids === 'string') {
                ids = amenity_ids.split(',').filter(i => i.trim() !== '');
            }

            if (ids.length > 0) {
                const details = ids.map(iid => ({
                    room_id: id,
                    amenity_id: iid.trim()
                }));
                await RoomTypeDetailModel.bulkCreate(details);
            }
        }

        res.locals.room = room;
        next();

    } catch (err) {
        return next(err);
    }
}



export const updateRoomStatus = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { room_status } = req.body;

        if (!id || !room_status) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_UPDATE_REQUIRED));
        }

        const room = await RoomModel.findByPk(id);
        if (!room) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_NOT_FOUND));
        }

        room.room_status = room_status;
        await room.save();

        res.locals.room = room;
        next();

    } catch (err) {
        return next(err);
    }
}

export const deleteRoom = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_ID_REQUIRED));
        }

        const room = await RoomModel.findByPk(id);
        if (!room) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_NOT_FOUND));
        }

        await room.destroy();

        res.locals.response = { message: 'Room deleted successfully' };
        next();

    } catch (err) {
        return next(err);
    }
}

export const createRoomType = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { room_type_name } = req.body;

        if (!room_type_name) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_TYPE_NAME_REQUIRED));
        }

        // Generate Room Type ID (e.g., T01, T02)
        const lastRoomType = await RoomTypeModel.findOne({
            order: [['room_type_id', 'DESC']]
        });

        let nextId = 'T01';
        if (lastRoomType) {
            const lastIdNum = parseInt(lastRoomType.room_type_id.substring(1));
            if (!isNaN(lastIdNum)) {
                nextId = `T${(lastIdNum + 1).toString().padStart(2, '0')}`;
            }
        }

        const newRoomType = await RoomTypeModel.create({
            room_type_id: nextId,
            room_type_name
        });

        res.locals.roomType = newRoomType;
        next();

    } catch (error) {
        next(error);
    }
}

export const updateRoomType = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { room_type_name } = req.body;

        if (!id || !room_type_name) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_TYPE_UPDATE_REQUIRED));
        }

        const roomType = await RoomTypeModel.findByPk(id);
        if (!roomType) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_TYPE_NOT_FOUND));
        }

        await roomType.update({
            room_type_name
        });

        res.locals.roomType = roomType;
        next();

    } catch (error) {
        next(error);
    }
}

export const deleteRoomType = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_TYPE_ID_REQUIRED));
        }

        const roomType = await RoomTypeModel.findByPk(id);
        if (!roomType) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_TYPE_NOT_FOUND));
        }

        // Check if room type is in use
        const roomCount = await RoomModel.count({ where: { room_type_id: id } });
        if (roomCount > 0) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_TYPE_IN_USE));
        }

        await roomType.destroy();

        res.locals.response = { message: 'Room Type deleted successfully' };
        next();

    } catch (error) {
        next(error);
    }
}

export const getMe = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = res.locals.user
        const employee = await EmployeeModel.findOne({
            where: { emp_email: email },
            include: [{
                model: RoleModel,
                as: 'role',
            }]
        })

        if (!employee) {
            return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_FAIL))
        }

        res.locals.employee = employee
        next()

    } catch (error) {
        next(error)
    }
}

export const createPromotion = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { promo_name, discount_value, usage_per_user, promo_start_date, promo_end_date, promo_detail } = req.body;

        if (!res.locals.user || !res.locals.user.id) {
            // Fallback if not set but verifyAdminToken should set it.
            // But verifyAdminToken sets res.locals.user = decoded; decoded token has id.
        }
        const employee_id = res.locals.user?.id;

        if (!promo_name || !discount_value || !usage_per_user || !promo_start_date || !promo_end_date || !promo_detail) {
            return next(new ServiceError(AdminMasterError.ERR_PROMOTION_CREATE_REQUIRED));
        }

        // Check if promotion name already exists
        const existingPromo = await PromotionModel.findOne({ where: { promo_name } });
        if (existingPromo) {
            return next(new ServiceError(AdminMasterError.ERR_PROMOTION_NAME_EXISTS));
        }

        // Generate ID
        const lastPromo = await PromotionModel.findOne({
            order: [['promo_id', 'DESC']]
        });

        let nextId = 'P000001';
        if (lastPromo && lastPromo.promo_id) {
            const lastIdNum = parseInt(lastPromo.promo_id.substring(1));
            if (!isNaN(lastIdNum)) {
                nextId = `P${(lastIdNum + 1).toString().padStart(6, '0')}`;
            }
        }

        const newPromo = await PromotionModel.create({
            promo_id: nextId,
            promo_name,
            discount_value,
            usage_per_user,
            promo_start_date,
            promo_end_date,
            promo_detail,
            is_active: 'A',
            employee_id
        });

        res.locals.promotion = newPromo;
        next();

    } catch (error) {
        next(error);
    }
}

export const updatePromotion = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { promo_name, discount_value, usage_per_user, promo_start_date, promo_end_date, promo_detail, is_active } = req.body;

        if (!id) {
            return next(new ServiceError(AdminMasterError.ERR_PROMOTION_ID_REQUIRED));
        }

        const promo = await PromotionModel.findByPk(id);
        if (!promo) {
            return next(new ServiceError(AdminMasterError.ERR_PROMOTION_NOT_FOUND));
        }

        // Check if new promo_name already exists (and is not that of the current promotion)
        if (promo_name && promo_name !== promo.promo_name) {
            const existingPromo = await PromotionModel.findOne({ where: { promo_name } });
            if (existingPromo) {
                return next(new ServiceError(AdminMasterError.ERR_PROMOTION_NAME_EXISTS));
            }
        }

        const updates: any = {};
        if (promo_name !== undefined) updates.promo_name = promo_name;
        if (discount_value !== undefined) updates.discount_value = discount_value;
        if (usage_per_user !== undefined) updates.usage_per_user = usage_per_user;
        if (promo_start_date !== undefined) updates.promo_start_date = promo_start_date;
        if (promo_end_date !== undefined) updates.promo_end_date = promo_end_date;
        if (promo_detail !== undefined) updates.promo_detail = promo_detail;
        if (is_active !== undefined) updates.is_active = is_active;

        await promo.update(updates);

        res.locals.promotion = promo;
        next();
    } catch (error) {
        next(error);
    }
}

export const deletePromotion = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) return next(new ServiceError(AdminMasterError.ERR_PROMOTION_ID_REQUIRED));

        const promo = await PromotionModel.findByPk(id);
        if (!promo) return next(new ServiceError(AdminMasterError.ERR_PROMOTION_NOT_FOUND));

        await promo.destroy();

        res.locals.response = { message: 'Promotion deleted successfully' };
        next();

    } catch (error) {
        next(error);
    }
}

export const updateBookingStatus = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { booking_status } = req.body;

        if (!id || !booking_status) {
            return next(new ServiceError(AdminMasterError.ERR_BOOKING_UPDATE_REQUIRED || 'Booking ID and booking_status are required'));
        }

        const booking = await BookingModel.findByPk(id);
        if (!booking) {
            return next(new ServiceError(AdminMasterError.ERR_BOOKING_NOT_FOUND || 'Booking not found'));
        }

        booking.booking_status = booking_status;
        await booking.save();

        res.locals.booking = booking;
        next();

    } catch (error) {
        next(error);
    }
}
export const updatePaymentStatus = () => async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        if (!id || !payment_status) {
            await transaction.rollback();
            return next(new ServiceError(AdminMasterError.ERR_PAYMENT_UPDATE_REQUIRED || 'Payment ID and payment_status are required'));
        }

        const payment = await PaymentModel.findByPk(id, { transaction });
        if (!payment) {
            await transaction.rollback();
            return next(new ServiceError(AdminMasterError.ERR_PAYMENT_NOT_FOUND || 'Payment not found'));
        }

        payment.payment_status = payment_status;
        await payment.save({ transaction });

        // Synchronize booking status if paid/approved
        if (payment_status === 'A') {
            const booking = await BookingModel.findByPk(payment.booking_id, { transaction });
            if (booking) {
                booking.booking_status = 'A'; // Set booking to Approved
                await booking.save({ transaction });
            }
        }

        // Handle cancellation by Admin/Staff
        if (payment_status === 'C') {
            const booking = await BookingModel.findByPk(payment.booking_id, { transaction });
            if (booking && booking.booking_status !== 'C') {
                booking.booking_status = 'C'; // Set booking to Cancelled
                await booking.save({ transaction });

                // Generate Cancel ID
                const lastCancel = await CancelModel.findOne({ order: [['cancel_id', 'DESC']], transaction });
                let nextCancelId = '0000001';
                if (lastCancel) {
                    const lastIdNum = parseInt(lastCancel.cancel_id);
                    if (!isNaN(lastIdNum)) {
                        nextCancelId = (lastIdNum + 1).toString().padStart(7, '0');
                    }
                }

                // Record in Cancel table
                await CancelModel.create({
                    cancel_id: nextCancelId,
                    cancel_date: new Date(),
                    cancel_type: 'E', // Employee/Staff
                    booking_id: payment.booking_id
                }, { transaction });
            }
        }

        await transaction.commit();
        res.locals.payment = payment;
        next();

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const getBookingReport = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return next(new ServiceError(AdminMasterError.ERR_BOOKING_UPDATE_REQUIRED || 'startDate and endDate are required'));
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        // Set end date to end of day
        end.setHours(23, 59, 59, 999);

        const report = await sequelize.query(`
            SELECT
                rt.room_type_name,
                COUNT(DISTINCT bd.booking_detail_id) AS booking_count,
                ROUND(AVG(bd.price_at_booking), 2) AS avg_price_per_night,
                SUM(bd.price_at_booking * bd.number_of_nights) AS total_revenue
            FROM booking_detail bd
            JOIN booking b ON bd.booking_id = b.booking_id
            JOIN checkin_checkout cc ON b.booking_id = cc.booking_id
            JOIN room r ON bd.room_id = r.room_id
            JOIN room_type rt ON r.room_type_id = rt.room_type_id
            WHERE b.booking_status != 'C'
              AND cc.checkin_date >= :startDate
              AND cc.checkin_date <= :endDate
            GROUP BY rt.room_type_name
            ORDER BY rt.room_type_name ASC
        `, {
            replacements: { startDate: start, endDate: end },
            type: 'SELECT' as any
        });

        res.locals.report = report;
        next();
    } catch (error) {
        next(error);
    }
}

export const getRoomOccupancyReport = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return next(new ServiceError(AdminMasterError.ERR_BOOKING_UPDATE_REQUIRED || 'startDate and endDate are required'));
        }

        // Get all room types with their total room count
        const roomTypes = await sequelize.query(`
            SELECT rt.room_type_name, COUNT(r.room_id) AS total_rooms
            FROM room_type rt
            LEFT JOIN room r ON rt.room_type_id = r.room_type_id AND r.room_status = 'A'
            GROUP BY rt.room_type_id, rt.room_type_name
            ORDER BY rt.room_type_name ASC
        `, { type: 'SELECT' as any }) as any[];

        // Get daily booked rooms per room type within the date range
        const bookedData = await sequelize.query(`
            SELECT
                d.day::date AS report_date,
                rt.room_type_name,
                COUNT(DISTINCT bd.room_id) AS booked_rooms
            FROM generate_series(:startDate::date, :endDate::date, '1 day'::interval) AS d(day)
            CROSS JOIN room_type rt
            LEFT JOIN room r ON r.room_type_id = rt.room_type_id AND r.room_status = 'A'
            LEFT JOIN booking_detail bd ON bd.room_id = r.room_id
            LEFT JOIN booking b ON bd.booking_id = b.booking_id AND b.booking_status != 'C'
            LEFT JOIN checkin_checkout cc ON b.booking_id = cc.booking_id
                AND cc.checkin_date <= d.day::date
                AND cc.checkout_date > d.day::date
            WHERE (cc.booking_id IS NOT NULL OR bd.booking_detail_id IS NULL)
            GROUP BY d.day, rt.room_type_name
            ORDER BY d.day ASC, rt.room_type_name ASC
        `, {
            replacements: { startDate: startDate as string, endDate: endDate as string },
            type: 'SELECT' as any
        }) as any[];

        // Build a lookup for total rooms per type
        const totalMap: Record<string, number> = {};
        roomTypes.forEach((rt: any) => {
            totalMap[rt.room_type_name] = parseInt(rt.total_rooms) || 0;
        });

        // Group booked data by date
        const dateMap: Record<string, Record<string, number>> = {};
        bookedData.forEach((row: any) => {
            const dateKey = new Date(row.report_date).toISOString().split('T')[0];
            if (!dateMap[dateKey]) dateMap[dateKey] = {};
            dateMap[dateKey][row.room_type_name] = parseInt(row.booked_rooms) || 0;
        });

        // Build result rows
        const roomTypeNames = roomTypes.map((rt: any) => rt.room_type_name);
        const result: any[] = [];

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            const row: any = { date: dateKey };
            roomTypeNames.forEach((name: string) => {
                const booked = dateMap[dateKey]?.[name] || 0;
                const total = totalMap[name] || 0;
                row[name] = `${booked}/${total}`;
            });
            result.push(row);
        }

        res.locals.occupancyReport = {
            roomTypes: roomTypeNames,
            data: result
        };
        next();
    } catch (error) {
        next(error);
    }
}

// ─── Booking Additional Charges ───────────────────────────────────────────────

export const getStayCharges = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { stay_id } = req.params;

        // Get all available charges
        const allCharges = await AdditionalChargeModel.findAll();

        // Get charges already added to this stay
        const added = await BookingAdditionalChargeModel.findAll({
            where: { stay_id },
            include: [{ model: AdditionalChargeModel, as: 'charge' }]
        });

        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get stay charges successfully',
            data: {
                all_charges: allCharges,
                added_charges: added
            }
        };
        next();
    } catch (error) {
        next(error);
    }
}

export const addBookingCharge = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { stay_id } = req.params;
        const { charge_id } = req.body;

        if (!stay_id || !charge_id) {
            return res.status(400).json({ res_code: '0400', res_desc: 'stay_id and charge_id are required' });
        }

        // Check stay exists
        const stay = await CheckInCheckOutModel.findByPk(stay_id);
        if (!stay) {
            return res.status(404).json({ res_code: '0404', res_desc: 'Stay record not found' });
        }

        // Check charge exists
        const charge = await AdditionalChargeModel.findByPk(charge_id);
        if (!charge) {
            return res.status(404).json({ res_code: '0404', res_desc: 'Charge not found' });
        }

        // Check if already added
        const existing = await BookingAdditionalChargeModel.findOne({ where: { stay_id, charge_id } });
        if (existing) {
            return res.status(400).json({ res_code: '0400', res_desc: 'Charge already added to this stay' });
        }

        await BookingAdditionalChargeModel.create({ stay_id, charge_id });

        res.locals.response = { res_code: '0000', res_desc: 'Charge added successfully' };
        next();
    } catch (error) {
        next(error);
    }
}

export const removeBookingCharge = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { stay_id, charge_id } = req.params;

        const record = await BookingAdditionalChargeModel.findOne({ where: { stay_id, charge_id } });
        if (!record) {
            return res.status(404).json({ res_code: '0404', res_desc: 'Charge record not found' });
        }

        await record.destroy();

        res.locals.response = { res_code: '0000', res_desc: 'Charge removed successfully' };
        next();
    } catch (error) {
        next(error);
    }
}

// ─── Additional Charges Master ────────────────────────────────────────────────

export const getAllAdditionalCharges = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const charges = await AdditionalChargeModel.findAll({
            order: [['charge_id', 'ASC']]
        });

        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Additional Charges successfully',
            data: charges
        };
        next();
    } catch (error) {
        next(error);
    }
}

export const createAdditionalCharge = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { charge_name, charge_amount, charge_unit } = req.body;

        if (!charge_name || charge_amount === undefined || !charge_unit) {
            return res.status(400).json({ res_code: '0400', res_desc: 'charge_name, charge_amount, and charge_unit are required' });
        }

        // Generate ID
        const lastCharge = await AdditionalChargeModel.findOne({ order: [['charge_id', 'DESC']] });
        let nextId = 'C01';
        if (lastCharge) {
            const lastIdNum = parseInt(lastCharge.charge_id.substring(1));
            if (!isNaN(lastIdNum)) {
                nextId = `C${(lastIdNum + 1).toString().padStart(2, '0')}`;
            }
        }

        const newCharge = await AdditionalChargeModel.create({
            charge_id: nextId,
            charge_name,
            charge_amount,
            charge_unit
        });

        res.locals.response = {
            res_code: '0000',
            res_desc: 'Create Additional Charge successfully',
            data: newCharge
        };
        next();
    } catch (error) {
        next(error);
    }
}

export const updateAdditionalCharge = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { charge_name, charge_amount, charge_unit } = req.body;

        if (!id) {
            return res.status(400).json({ res_code: '0400', res_desc: 'charge_id is required' });
        }

        const charge = await AdditionalChargeModel.findByPk(id);
        if (!charge) {
            return res.status(404).json({ res_code: '0404', res_desc: 'Additional charge not found' });
        }

        if (charge_name !== undefined) charge.charge_name = charge_name;
        if (charge_amount !== undefined) charge.charge_amount = charge_amount;
        if (charge_unit !== undefined) charge.charge_unit = charge_unit;

        await charge.save();

        res.locals.response = {
            res_code: '0000',
            res_desc: 'Update Additional Charge successfully',
            data: charge
        };
        next();
    } catch (error) {
        next(error);
    }
}

export const deleteAdditionalCharge = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ res_code: '0400', res_desc: 'charge_id is required' });
        }

        const charge = await AdditionalChargeModel.findByPk(id);
        if (!charge) {
            return res.status(404).json({ res_code: '0404', res_desc: 'Additional charge not found' });
        }

        // Check if charge is being used
        const usageCount = await BookingAdditionalChargeModel.count({ where: { charge_id: id } });
        if (usageCount > 0) {
            return res.status(400).json({ res_code: '0400', res_desc: 'Cannot delete charge: it is being used in bookings.' });
        }

        await charge.destroy();

        res.locals.response = { res_code: '0000', res_desc: 'Additional charge deleted successfully' };
        next();
    } catch (error) {
        next(error);
    }
}
