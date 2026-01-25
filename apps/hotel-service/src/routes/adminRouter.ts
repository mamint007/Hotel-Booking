import express, { Request, Response, NextFunction } from 'express';
import { login } from "../controller/adminController"

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

export default router;
