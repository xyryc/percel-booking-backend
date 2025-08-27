import { Router } from "express";
import { paymentsController } from "./payments.controller";


const router = Router();
router.post("/success", paymentsController.successPayment);
router.post("/fail",  paymentsController.failedPayment);
router.post("/cancel",  paymentsController.cancelPayment);
router.post("/init-payment", paymentsController.initPayment);

export const paymentRoutes = router;
