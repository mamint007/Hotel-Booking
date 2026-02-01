import express, { Request, Response, NextFunction } from 'express';
import { login, getAllEmployees, getAllRooms, getAllRoomTypes, getAllBookings, getAllPayments } from "../controller/adminController"
import { getAllUsers } from "../controller/userController"
import { verifyAdminToken } from '../middleware/authMiddleware';
// import { verifyAdminToken } from "../middleware/authMiddleware"

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
    verifyAdminToken(), // Uncomment to enable auth protection
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

export default router;
