import { Request, Response } from "express";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";
import { bookingService } from "./booking.service";
import { decodedToken } from "../../util/decodedToken";



const createBooking = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const isTokenValid = decodedToken(token as string);
    const booking = await bookingService.createBooking(req.body, isTokenValid.userId);
    res.status(200).json({
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    throw new AppError(
      `Error creating booking. ${error}`,
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};


export const bookingController = {
  createBooking,
};