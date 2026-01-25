import { Router } from "express";
import authenRoute from "./routes/authRouter"
import adminRoute from "./routes/adminRouter"
const router = Router()


router.use('/authen', authenRoute)
router.use('/admin', adminRoute)


export default router