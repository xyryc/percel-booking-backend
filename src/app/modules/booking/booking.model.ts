import { Schema, model } from "mongoose";
import { BookingStatus, IBooking } from "./booking.interface";
import { Parcel } from "../percel/percel.mode";



const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: Parcel.modelName,
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
    },
    status: {
      type: String,
      ref: "Payment",
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Booking = model<IBooking>("Booking", bookingSchema);
