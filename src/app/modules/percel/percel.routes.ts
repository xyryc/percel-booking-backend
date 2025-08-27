import { Router } from "express";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createParcelZodSchema, updateParcelStatusZodSchema } from "./percel.validations";
import { ParcelControllers } from "./percel.controller";



const router = Router();
router.post("/",verifyToken(role.SENDER),validateRequest(createParcelZodSchema), ParcelControllers.createParcel);
router.get("/all",verifyToken(role.ADMIN), ParcelControllers.getAllParcel);
router.get("/my",verifyToken(role.SENDER), ParcelControllers.getMyParcels);

router.get("/incoming", verifyToken(role.RECIVER),ParcelControllers.getIncomingParcels);
router.get("/:id", verifyToken(...Object.values(role)),ParcelControllers.getSingleParcel);
router.patch("/:id/cancel",validateRequest(updateParcelStatusZodSchema), verifyToken(role.SENDER),ParcelControllers.cancelParcel);
router.patch("/:id/status", verifyToken(role.ADMIN),ParcelControllers.updateParcelStatus);


export const ParcelRoutes = router;