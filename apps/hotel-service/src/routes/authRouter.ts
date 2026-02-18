import express, { Request, Response, NextFunction } from 'express';
import { register, login, getMe } from "../controller/authenController"
import { verifyMemberToken } from "../middleware/authMiddleware"


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

router.post(
    '/login',
    login(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Login successfully',
            data: {
                member: res.locals.member,
                token: res.locals.token
            }
        }
        res.json(res.locals.response)
        next()
    }
)

router.get(
    '/me',
    verifyMemberToken(),
    getMe(),
    (req: Request, res: Response, next: NextFunction) => {
        res.locals.response = {
            res_code: '0000',
            res_desc: 'Get Me Successfully',
            data: {
                member: res.locals.member
            }
        }
        res.json(res.locals.response)
        next()
    }
)

export default router;