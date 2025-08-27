import AppError from "../../errorHelpers/appError";
import getTransactionId from "../../util/getTransctionId";
import { User } from "../user/user.model";
import { BookingStatus, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payments/payment.model";
import { PaymentStatus } from "../payments/payment.interface";
import { sslCommerzService } from "../sslCommerz/sslCommerze.service";
import { Parcel } from "../percel/percel.mode";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  try {
    const transactionId = getTransactionId();
    const session = await Booking.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId);
      if (!user || !user.phone || !user.address) {
        throw new AppError(
          "User must have a phone number and address to create a booking.",
          httpStatus.BAD_REQUEST,
        );
      }

      const parcel = await Parcel.findById(payload.tour).select("costFrom");
      if (!parcel?.costFrom) {
        throw new AppError(
          "Parcel must have a cost to create a booking.",
          httpStatus.BAD_REQUEST,
        );
      }

      const amount = Number(parcel.costFrom) * Number(payload.guestCount);

      const booking = await Booking.create(
        [
          {
            ...payload,
            user: userId,
            status: BookingStatus.PENDING,
          },
        ],
        { session },
      );

      if (!booking) {
        throw new AppError(
          "Booking creation failed.",
          httpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const payment = await Payment.create(
        [
          {
            bookingId: booking[0]._id, //when we added session, it returns an array for creation and update, we take the first element
            status: PaymentStatus.UNPAID,
            transactionId: transactionId,
            amount: amount,
          },
        ],
        { session },
      );

      if (!payment) {
        throw new AppError(
          "Payment creation failed.",
          httpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const updatedBooking = await Booking.findByIdAndUpdate(
        booking[0]._id,
        {
          payment: payment[0]._id,
        },
        { new: true, runValidators: true, session },
      )
        .populate("user", "name email phone address")
        .populate("tour", "name maxGests")
        .populate("payment", "amount status");

      if (!updatedBooking) {
        throw new AppError(
          "Booking update failed.",
          httpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userAddress = (updatedBooking.user as any).address || "N/A";

      const sslPayload = {
        amount: amount,
        transactionId: transactionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (updatedBooking.user as any).name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        email: (updatedBooking.user as any).email,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        phone: (updatedBooking.user as any).phone,
        address: userAddress,
      };

      const sslPayment = await sslCommerzService.sslPaymentInit({
        ...sslPayload,
      });

      await session.commitTransaction();
      session.endSession();
      return { booking: updatedBooking, sslPayment: sslPayment.GatewayPageURL };
    } catch (error) {
      // If any error occurs, we abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    throw new AppError(
      `Error creating booking. ${error}`,
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const bookingService = { createBooking };
