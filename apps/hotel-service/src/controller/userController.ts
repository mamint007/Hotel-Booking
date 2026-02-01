import { NextFunction, Request, Response } from "express";
import { MemberModel } from "@hotel/models";
import { ServiceError } from "@hotel/helpers";

export const getAllUsers = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await MemberModel.findAll({
            where: { is_deleted: false }, // Only fetch active users
            attributes: { exclude: ['m_password'] }
        });

        res.locals.users = users;
        next();
    } catch (err) {
        return next(err);
    }
}