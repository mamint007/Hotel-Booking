import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ServiceError } from "@hotel/helpers"
import AdminMasterError from '../constants/errors/admin.error.json'
import AuthenMasterError from '../constants/errors/authen.error.json'

// Extend Express Request to include decoded user
declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

export const verifyAdminToken = () => (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

        if (!token) {
            return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_REQUIRED))
        }

        console.log("token: ", token)

        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, decoded: any) => {
            if (err) {
                return next(new ServiceError(AdminMasterError.TOKEN_EXPIRED))
            }

            // Check for specific admin claims if needed
            if (decoded.role !== 'Owner' && decoded.role !== 'Admin') { // Example roles
                // Could create a specific Forbidden error, but reusing login fail or 403 is okay
                return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_FAIL))
            }

            req.user = decoded
            res.locals.user = decoded
            next()
        })
    } catch (error) {
        next(error)
    }

}

export const verifyMemberToken = () => (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

        if (!token) {
            return next(new ServiceError(AuthenMasterError.ERR_MEMBER_LOGIN_REQUIRED))
        }

        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, decoded: any) => {
            if (err) {
                return next(new ServiceError(AuthenMasterError.EXPIRED_TOKEN))
            }

            req.user = decoded
            res.locals.user = decoded
            next()
        })
    } catch (error) {
        next(error)
    }
}
