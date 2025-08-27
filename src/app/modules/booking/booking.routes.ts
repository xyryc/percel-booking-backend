import { Router } from "express";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";
import { bookingController } from "./booking.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookingZodSchema } from "./booking.validations";

const router = Router();
router.post("/create", verifyToken(role.ADMIN), validateRequest(createBookingZodSchema), bookingController.createBooking);



export const bookingRouter = router;