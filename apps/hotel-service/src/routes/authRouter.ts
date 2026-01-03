import express, { Request, Response, NextFunction } from 'express';
import {register} from "../controller/authenController"


const router = express.Router()


router.post(
    '/register',
    register(),
     (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'User registered successfully',
            data: {
                newMember: res.locals.newMember
            }
        }
        res.json(res.locals.response)
        next()
    }
)

export default router;