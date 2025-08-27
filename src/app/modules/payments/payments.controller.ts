import { Request, Response } from "express";
import { paymentsService } from "./payments.service";

const successPayment = async (req: Request, res: Response) => {
  const { query } = req;

  try {
    const result = await paymentsService.successPayment(query as Record<string, string>);

    if (!result.success) {
      res.status(404).json({ message: "Payment or booking not found." });
    }

    // ✅ শুধু redirect করুন, frontend নিজে জানবে success
    res.redirect(`${process.env.SSL_COMMERZ_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}`);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const failedPayment = async (req: Request, res: Response) => {
  const { query } = req;

  try {
    const result = await paymentsService.failedPayment(query as Record<string, string>);

    if (!result.success) {
      res.status(404).json({ message: "Payment or booking not found." });
    }

    // ✅ শুধু redirect করুন, frontend নিজে জানবে success
    res.redirect(`${process.env.SSL_COMMERZ_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}`);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

const cancelPayment = async (req: Request, res: Response) => {
  const { query } = req;

  try {
    const result = await paymentsService.cancelPayment(query as Record<string, string>);

    if (!result.success) {
      res.status(404).json({ message: "Payment or booking not found." });
    }

    // ✅ শুধু redirect করুন, frontend নিজে জানবে success
    res.redirect(`${process.env.SSL_COMMERZ_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}`);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


const initPayment = async (req: Request, res: Response) => {
  const payload = req.body;
  

  try {
    const result = await paymentsService.initPayment(payload.bookingId);

    if (!result.success) {
      res.status(404).json({ message: "Payment initialization failed." });
    }

    res.json({ message: "Payment initialized successfully.", data: result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const paymentsController = {
  successPayment,
  failedPayment,
  cancelPayment,
  initPayment,
};
