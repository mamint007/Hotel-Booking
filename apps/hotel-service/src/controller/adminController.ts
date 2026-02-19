import { Request, Response, NextFunction } from 'express';
import { ServiceError } from "@hotel/helpers"
import AdminMasterError from '../constants/errors/admin.error.json'
import { EmployeeModel, RoleModel, RoomModel, RoomTypeModel, BookingModel, MemberModel, PaymentTypeModel, BookingDetailModel, CheckInCheckOutModel, PaymentModel, PromotionModel, AmenityModel, RoomTypeDetailModel } from "@hotel/models"
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
                    attributes: ['checkin_date', 'checkout_date']
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

        res.locals.bookings = bookings;
        next();
    } catch (error) {
        next(error);
    }
}


export const getAllPayments = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await PaymentModel.findAll({
            order: [['payment_id', 'DESC']]
        });

        res.locals.payments = payments;
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