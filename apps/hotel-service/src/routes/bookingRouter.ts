import express, { Request, Response, NextFunction } from 'express';
import { createBooking } from "../controller/bookingController";
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

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
