import { Router } from "express";
import { divisionsController } from "./divisions.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./divisions.validations";
import { verifyToken } from "../../util/verifyToken";
import { role } from "../user/user.interface";

const router = Router();
router.post("/create", verifyToken(role.ADMIN, role.ADMIN), validateRequest(createDivisionSchema), divisionsController.createDivisions);
router.get("/", verifyToken(role.ADMIN), divisionsController.getAllDivisions);
router.get("/:slug", verifyToken(role.ADMIN), divisionsController.getSingleDivision);
router.delete("/:id", verifyToken(role.ADMIN), divisionsController.deleteDivision);
router.patch("/:id", verifyToken(role.ADMIN), validateRequest(updateDivisionSchema), divisionsController.updateDivision);
export const DivisionsRoutes = router;