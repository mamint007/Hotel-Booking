import express, { Request, Response, NextFunction } from 'express';
import { createBooking, getMyBookings } from "../controller/bookingController";
import { upload } from '../middleware/uploadMiddleware';
import { verifyMemberToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get(
    '/my-bookings',
    verifyMemberToken(),
    getMyBookings(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response);
        next();
    }
);

router.post(
    '/',
    upload.single('payment_slip'),
    createBooking(),
    (req: Request, res: Response, next: NextFunction) => {
        // Response handled in controller or here if needed
        res.json(res.locals.response);
        next();
    }
);

export default router;
