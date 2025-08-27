import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISslCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslCommerzService } from "../sslCommerz/sslCommerze.service";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const UpdatedPayments = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PaymentStatus.PAID },
      { new: true, session },
    );

    if (!UpdatedPayments) {
      throw new Error("Payment not found or already updated.");
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      { _id: UpdatedPayments.bookingId },
      { status: BookingStatus.CONFIRMED },
      { new: true, session },
    );

    if (!updatedBooking) {
      throw new Error("Booking not found or already updated.");
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment and booking updated successfully.",
    };
  } catch (error) {
    throw new Error("Payment success handling failed: " + error);
  }
};

const failedPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const UpdatedPayments = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PaymentStatus.FAILED },
      { new: true, session },
    );

    if (!UpdatedPayments) {
      throw new Error("Payment not found or already updated.");
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      { _id: UpdatedPayments.bookingId },
      { status: BookingStatus.FAILED },
      { new: true, session },
    );

    if (!updatedBooking) {
      throw new Error("Booking not found or already updated.");
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment and booking failed successfully.",
    };
  } catch (error) {
    throw new Error("Payment success handling failed: " + error);
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const UpdatedPayments = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PaymentStatus.PENDING },
      { new: true, session },
    );

    if (!UpdatedPayments) {
      throw new Error("Payment not found or already updated.");
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      { _id: UpdatedPayments.bookingId },
      { status: BookingStatus.CANCELED },
      { new: true, session },
    );

    if (!updatedBooking) {
      throw new Error("Booking not found or already updated.");
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment and booking cancelled successfully.",
    };
  } catch (error) {
    throw new Error("Payment success handling failed: " + error);
  }
};

const initPayment = async (bookingId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const payment = await Payment.findOne({ bookingId }).session(session);
    if (!payment) {
      throw new Error("Payment not found for the booking.");
    }
    const booking = await Booking.findById(payment.bookingId).session(session).populate("user", "name email phone address");
    if (!booking) {
      throw new Error("Booking not found for the payment.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userAddress = (booking.user as any).address || "N/A";

    const sslPayload: ISslCommerz = {
      amount: payment.amount,
      transactionId: payment.transactionId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: (booking.user as any).name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      email: (booking.user as any).email,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      phone: (booking.user as any).phone,
      address: userAddress,
    };

    const sslPayment = await sslCommerzService.sslPaymentInit(sslPayload);
    if (!sslPayment || !sslPayment.GatewayPageURL) {
      throw new Error("SSL Commerz payment initialization failed.");
    }
    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Payment initialized successfully.",
      sslPayment: sslPayment.GatewayPageURL,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Payment initialization failed: " + error);

  }
};

export const paymentsService = {
  successPayment,
  failedPayment,
  cancelPayment,
  initPayment,
};
