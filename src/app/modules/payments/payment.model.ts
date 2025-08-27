import { Schema, model } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentGetway: {
      type: Schema.Types.Mixed, 
      default: null,
    },
    invoiceUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
