import express, { Request, Response, NextFunction } from 'express';
import { login, getAllEmployees } from "../controller/adminController"
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

export default router;
