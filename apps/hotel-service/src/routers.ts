import { Router } from "express";
import authenRoute from "./routes/authRouter"
import adminRoute from "./routes/adminRouter"
import roomRoute from "./routes/roomRouter"

const router = Router()

router.use('/authen', authenRoute)
router.use('/admin', adminRoute)
router.use('/rooms', roomRoute)

export default router