import { Request, Response, NextFunction } from 'express';
import { ServiceError } from "@hotel/helpers"
import AdminMasterError from '../constants/errors/admin.error.json'
import { EmployeeModel, RoleModel } from "@hotel/models"
import jwt from 'jsonwebtoken'

export const login = () => async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_REQUIRED))
    }

    try {
        // Find employee by email
        const employee = await EmployeeModel.findOne({
            where: { emp_email: email }
        })

        if (!employee) {
            return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_FAIL))
        }

        // Verify password (direct comparison for now as per Member implementation)
        // In production, should use bcrypt or similar
        const isMatch = employee.emp_password === password
        if (!isMatch) {
            return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_FAIL))
        }

        // Check if role exists and is active (Optional but good practice)
        if (employee.role_id) {
            const role = await RoleModel.findByPk(employee.role_id)
            console.log("Role: ",role)
            if (!role || role.is_active !== 'A') {
                // Maybe specific error for inactive role, reusing login fail for security
                return next(new ServiceError(AdminMasterError.ERR_ADMIN_LOGIN_FAIL))
            }
        }

        const accessToken = jwt.sign(
            {
                id: employee.employee_id,
                email: employee.emp_email,
                role: 'admin', // Or use dynamic role name from RoleModel
                role_id: employee.role_id
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        )

        res.locals.token = accessToken
        res.locals.employee = employee
        return next()

    } catch (error) {
        next(error)
    }
}
