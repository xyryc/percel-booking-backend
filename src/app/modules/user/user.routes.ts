import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validations";
import { validateRequest } from "../../middleware/validateRequest";
import { verifyToken } from "../../util/verifyToken";
import { role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser,
);
router.get(
  "/",verifyToken(role.ADMIN),
  UserController.getAllUsers,
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  verifyToken(role.ADMIN, role.RECIVER, role.SENDER),
  UserController.updateUser,
);
  
export const UserRoutes = router;
