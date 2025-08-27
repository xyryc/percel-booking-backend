import { Types } from "mongoose";

export enum PaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  PENDING = "pending",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPayment {
  bookingId: Types.ObjectId;
  transactionId: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGetway?: any;
  invoiceUrl?: string;
  status: PaymentStatus;
  createdAt: Date;
}
