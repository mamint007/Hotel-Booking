
import express, { Request, Response, NextFunction } from 'express';
import { getRooms } from "../controller/roomController";
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

export default router;
