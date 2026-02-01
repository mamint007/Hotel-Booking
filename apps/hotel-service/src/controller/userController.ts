import { NextFunction, Request, Response } from "express";
import { MemberModel } from "@hotel/models";
import { ServiceError } from "@hotel/helpers";

export const getAllUsers = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await MemberModel.findAll({
            attributes: { exclude: ['m_password'] } // Exclude password for security
        });

        res.locals.users = users;
        next();
    } catch (err) {
        // You might want to define a specific error code for this
        return next(err);
    }
}