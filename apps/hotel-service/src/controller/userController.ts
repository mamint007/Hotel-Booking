// import { NextFunction, Request, Response } from "express";


// export const authMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization
//     const token = authHeader?.split(' ')[1]

//     if (!token) {
//         return res.status(401).json({ res_desc: 'Unauthorized' })
//     }
//     const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)

//     try {
//         const { payload } = await jwtVerify(token, jwtSecret) as any
//         const user = await UserModel.findOne({
//             where: {id: payload.id, status: true},
//             attributes: ['id', 'username', 'email', 'role_id', 'last_login', 'recent_login'],
//             include: [
//                 {
//                     model: UserRoleModel,
//                     as: 'role',
//                     attributes: ['name']
//                 }
//             ]
//         })
//         req.user = user as any
//         next()
//     } catch (err) {
//         return next(new ServiceError(HTTP_ERROR.ERR_HTTP_401))
//     }
// }