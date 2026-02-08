import { Request, Response, NextFunction } from 'express';
import { ServiceError } from "@hotel/helpers"
import AdminMasterError from '../constants/errors/admin.error.json'
import { EmployeeModel, RoleModel, RoomModel, RoomTypeModel, BookingModel, MemberModel, PaymentTypeModel, BookingDetailModel, PaymentModel, PromotionModel } from "@hotel/models"
import jwt from 'jsonwebtoken'

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
            include: [{
                model: RoomTypeModel,
                as: 'room_type',
                attributes: ['room_type_name']
            }],
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



export const deleteUser = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(new Error('User ID is required')); // Should use defined error
        }

        const user = await MemberModel.findByPk(id);
        if (!user) {
            return next(new Error('User not found')); // Should use defined error
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
        const { room_id, room_number, floor, price_per_night, bed_type, bed_quantity, max_guest, room_status, room_type_id } = req.body;

        if (!room_id || !room_number || !floor || !price_per_night || !bed_type || !bed_quantity || !max_guest || !room_status || !room_type_id) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_CREATE_REQUIRED));
        }

        // Check if room_id already exists
        const existingRoomById = await RoomModel.findByPk(room_id);
        if (existingRoomById) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_ID_EXISTS));
        }

        // Check if room_number already exists
        const existingRoomByNumber = await RoomModel.findOne({ where: { room_number } });
        if (existingRoomByNumber) {
            return next(new ServiceError(AdminMasterError.ERR_ROOM_NUMBER_EXISTS));
        }

        const newRoom = await RoomModel.create({
            room_id,
            room_number,
            floor,
            price_per_night,
            bed_type,
            bed_quantity,
            max_guest,
            room_status,
            room_type_id
        });

        res.locals.room = newRoom;
        next();

    } catch (err) {
        return next(err);
    }
}

export const updateRoom = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { room_number, floor, price_per_night, bed_type, bed_quantity, max_guest, room_status, room_type_id } = req.body;

        if (!id) {
            return next(new Error('Room ID is required'));
        }

        const room = await RoomModel.findByPk(id);
        if (!room) {
            return next(new Error('Room not found'));
        }

        // Check if new room_number already exists (and is not that of the current room)
        if (room_number && room_number !== room.room_number) {
            const existingRoomByNumber = await RoomModel.findOne({ where: { room_number } });
            if (existingRoomByNumber) {
                return next(new Error('Room Number already exists'));
            }
        }

        await room.update({
            room_number: room_number || room.room_number,
            floor: floor || room.floor,
            price_per_night: price_per_night || room.price_per_night,
            bed_type: bed_type || room.bed_type,
            bed_quantity: bed_quantity || room.bed_quantity,
            max_guest: max_guest || room.max_guest,
            room_status: room_status || room.room_status,
            room_type_id: room_type_id || room.room_type_id
        });

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
            return next(new Error('Room ID and status are required'));
        }

        const room = await RoomModel.findByPk(id);
        if (!room) {
            return next(new Error('Room not found'));
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
            return next(new Error('Room ID is required'));
        }

        const room = await RoomModel.findByPk(id);
        if (!room) {
            return next(new Error('Room not found'));
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
            return next(new Error('Room type name is required'));
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
            return next(new Error('Room Type ID and name are required'));
        }

        const roomType = await RoomTypeModel.findByPk(id);
        if (!roomType) {
            return next(new Error('Room Type not found'));
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
            return next(new Error('Room Type ID is required'));
        }

        const roomType = await RoomTypeModel.findByPk(id);
        if (!roomType) {
            return next(new Error('Room Type not found'));
        }

        // Check if room type is in use
        const roomCount = await RoomModel.count({ where: { room_type_id: id } });
        if (roomCount > 0) {
            return next(new Error('Cannot delete Room Type because it is in use by rooms'));
        }

        await roomType.destroy();

        res.locals.response = { message: 'Room Type deleted successfully' };
        next();

    } catch (error) {
        next(error);
    }
}