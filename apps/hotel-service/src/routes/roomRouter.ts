
import express, { Request, Response, NextFunction } from 'express';
import { getRooms, getAdditionalCharges } from "../controller/roomController";

import { getAllRoomTypes } from "../controller/adminController";

const router = express.Router();

router.get(
    '/types',
    getAllRoomTypes(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get Room Types successfully',
            data: res.locals.roomTypes
        }
        res.json(res.locals.response)
        next()
    }
);

router.get(
    '/',
    getRooms(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get Rooms successfully',
            data: res.locals.rooms
        }
        res.json(res.locals.response)
        next()
    }
);

router.get(
    '/additional-charges',
    getAdditionalCharges(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get Additional Charges successfully',
            data: res.locals.additionalCharges
        }
        res.json(res.locals.response)
        next()
    }
);


export default router;
