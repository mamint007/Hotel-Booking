import express, { Request, Response, NextFunction } from 'express';
import { login, getAllEmployees, getAllRooms, getAllRoomTypes, getAllBookings, getAllPayments, getAllPromotions, createEmployee, deleteUser, updateRoomStatus, createRoom, updateRoom, deleteRoom, createRoomType, updateRoomType, deleteRoomType } from "../controller/adminController"
import { getAllUsers } from "../controller/userController"

import { verifyAdminToken } from '../middleware/authMiddleware';

const router = express.Router()



router.post(
    '/login',
    login(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Admin Login successfully',
            data: {
                employee: res.locals.employee,
                token: res.locals.token
            }
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/users',
    verifyAdminToken(),
    getAllUsers(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Users successfully',
            data: res.locals.users
        }
        res.json(res.locals.response)
        next()
    }
)

router.delete(
    '/users/:id',
    verifyAdminToken(),
    deleteUser(),
    (req: Request, res: Response, next: NextFunction) => {
        // Response handled in controller or here if needed, consistent with others:
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Delete User Successfully',
            data: res.locals.response
        }
        res.json(res.locals.response);
        next();
    }
)

router.get(
    '/employees',
    verifyAdminToken(),
    getAllEmployees(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Employees successfully',
            data: res.locals.employees
        }
        res.json(res.locals.response)
        next()
    }
)

router.post(
    '/employees',
    verifyAdminToken(),
    createEmployee(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Create Employee successfully',
            data: res.locals.employee
        }
        res.json(res.locals.response)
        next()
    }
)




router.get(
    '/rooms',
    verifyAdminToken(),
    getAllRooms(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Rooms successfully',
            data: res.locals.rooms
        }
        res.json(res.locals.response)
        next()
    }
)

router.post(
    '/rooms',
    verifyAdminToken(),
    createRoom(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Create Room successfully',
            data: res.locals.room
        }
        res.json(res.locals.response)
        next()
    }
)

router.put(
    '/rooms/:id',
    verifyAdminToken(),
    updateRoom(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Update Room successfully',
            data: res.locals.room
        }
        res.json(res.locals.response)
        next()
    }
)

router.patch(
    '/rooms/:id/status',
    verifyAdminToken(),
    updateRoomStatus(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Update Room Status successfully',
            data: res.locals.room
        }
        res.json(res.locals.response)
        next()
    }
)

router.delete(
    '/rooms/:id',
    verifyAdminToken(),
    deleteRoom(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Delete Room successfully',
            data: res.locals.response
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/room-types',
    verifyAdminToken(),
    getAllRoomTypes(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Room Types successfully',
            data: res.locals.roomTypes
        }
        res.json(res.locals.response)
        next()
    }
)

router.post(
    '/room-types',
    verifyAdminToken(),
    createRoomType(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Create Room Type successfully',
            data: res.locals.roomType
        }
        res.json(res.locals.response)
        next()
    }
)

router.put(
    '/room-types/:id',
    verifyAdminToken(),
    updateRoomType(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Update Room Type successfully',
            data: res.locals.roomType
        }
        res.json(res.locals.response)
        next()
    }
)

router.delete(
    '/room-types/:id',
    verifyAdminToken(),
    deleteRoomType(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Delete Room Type successfully',
            data: res.locals.response
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/bookings',
    verifyAdminToken(),
    getAllBookings(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Bookings successfully',
            data: res.locals.bookings
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/payments',
    verifyAdminToken(),
    getAllPayments(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Payments successfully',
            data: res.locals.payments
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/promotions',
    verifyAdminToken(),
    getAllPromotions(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Promotions successfully',
            data: res.locals.promotions
        }
        res.json(res.locals.response)
        next()
    }
)

export default router;
