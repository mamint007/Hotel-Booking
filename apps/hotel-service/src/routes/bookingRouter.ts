import express, { Request, Response, NextFunction } from 'express';
// Rebuild triggered after migration
import { createBooking, getMyBookings, getBookingById, submitPaymentSlip, cancelBooking } from "../controller/bookingController";
import { createReview } from '../controller/reviewController';
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
        res.json(res.locals.response);
        next();
    }
);

router.post(
    '/review',
    verifyMemberToken(),
    createReview(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response);
        next();
    }
);

router.get(
    '/:id',
    verifyMemberToken(),
    getBookingById(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response);
        next();
    }
);

router.post(
    '/submit-payment',
    verifyMemberToken(),
    upload.single('payment_slip'),
    submitPaymentSlip(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response);
        next();
    }
);

router.post(
    '/cancel',
    verifyMemberToken(),
    cancelBooking(),
    (req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals.response);
        next();
    }
);

export default router;
