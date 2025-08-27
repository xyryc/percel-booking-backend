import { Types } from "mongoose";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELED = "canceled",
  COMPLETED = "completed",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export interface IBooking {
  id: string;
  user: Types.ObjectId;
  tour: Types.ObjectId;
  status: BookingStatus;
  payment?: Types.ObjectId;
  guestCount: number;

  createdAt: Date;
  updatedAt: Date;
}
