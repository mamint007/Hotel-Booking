import { Router } from "express";
import authenRoute from "./routes/authRouter"
import adminRoute from "./routes/adminRouter"
import roomRoute from "./routes/roomRouter"
import bookingRoute from "./routes/bookingRouter"

const router = Router()

router.use('/authen', authenRoute)
router.use('/admin', adminRoute)
router.use('/rooms', roomRoute)
router.use('/bookings', bookingRoute)

export default router