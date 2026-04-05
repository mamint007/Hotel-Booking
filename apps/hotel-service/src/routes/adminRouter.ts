import express, { Request, Response, NextFunction, Router } from 'express';
import { login, getAllEmployees, getAllRooms, getAllRoomTypes, getAllBookings, getAllPayments, getAllPromotions, createEmployee, updateEmployeeStatus, deleteUser, updateRoomStatus, createRoom, updateRoom, deleteRoom, createRoomType, updateRoomType, deleteRoomType, getMe, createPromotion, updatePromotion, deletePromotion, getAllAmenities, updateBookingStatus, updatePaymentStatus, getBookingReport, getRoomOccupancyReport, getStayCharges, addBookingCharge, removeBookingCharge, getAllAdditionalCharges, createAdditionalCharge, updateAdditionalCharge, deleteAdditionalCharge } from "../controller/adminController"
import { getAllUsers } from "../controller/userController"

import { verifyAdminToken, verifyOwnerToken } from '../middleware/authMiddleware';


import { upload } from '../middleware/uploadMiddleware';

const router = Router()



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

router.patch(
    '/employees/:id/status',
    verifyAdminToken(),
    updateEmployeeStatus(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Update Employee Status successfully',
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
    upload.single('room_image'),
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
    upload.single('room_image'),
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

router.patch(
    '/bookings/:id/status',
    verifyAdminToken(),
    updateBookingStatus(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Update Booking Status successfully',
            data: res.locals.booking
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

router.patch(
    '/payments/:id/status',
    verifyAdminToken(),
    updatePaymentStatus(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Update Payment Status successfully',
            data: res.locals.payment
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

router.post(
    '/promotions',
    verifyAdminToken(),
    createPromotion(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Create Promotion successfully',
            data: res.locals.promotion
        }
        res.json(res.locals.response)
        next()
    }
)

router.put(
    '/promotions/:id',
    verifyAdminToken(),
    updatePromotion(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Update Promotion successfully',
            data: res.locals.promotion
        }
        res.json(res.locals.response)
        next()
    }
)

router.delete(
    '/promotions/:id',
    verifyAdminToken(),
    deletePromotion(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Delete Promotion successfully',
            data: res.locals.response
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/me',
    verifyAdminToken(),
    getMe(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get Me Successfully',
            data: {
                employee: res.locals.employee
            }
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/amenities',
    verifyAdminToken(),
    getAllAmenities(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get All Amenities successfully',
            data: res.locals.amenities
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/report/bookings',
    verifyOwnerToken(),
    getBookingReport(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get Booking Report successfully',
            data: res.locals.report
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/report/occupancy',
    verifyAdminToken(),
    getRoomOccupancyReport(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get Room Occupancy Report successfully',
            data: res.locals.occupancyReport
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/stays/:stay_id/charges',
    verifyAdminToken(),
    getStayCharges(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response)
        next()
    }
)

router.post(
    '/stays/:stay_id/charges',
    verifyAdminToken(),
    addBookingCharge(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response)
        next()
    }
)

router.delete(
    '/stays/:stay_id/charges/:charge_id',
    verifyAdminToken(),
    removeBookingCharge(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/additional-charges',
    verifyAdminToken(),
    getAllAdditionalCharges(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response)
        next()
    }
)

router.post(
    '/additional-charges',
    verifyAdminToken(),
    createAdditionalCharge(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response)
        next()
    }
)

router.put(
    '/additional-charges/:id',
    verifyAdminToken(),
    updateAdditionalCharge(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response)
        next()
    }
)

router.delete(
    '/additional-charges/:id',
    verifyAdminToken(),
    deleteAdditionalCharge(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response)
        next()
    }
)

export default router;
