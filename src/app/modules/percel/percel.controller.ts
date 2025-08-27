import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendResponse";
import { ParcelServices } from "./percel.service";
import { decodedToken } from "../../util/decodedToken";

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }

  const senderId = decode.userId;

  const parcel = await ParcelServices.createParcel(req.body, senderId);

  sendResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "Parcel Created Successfully",
    data: parcel,
  });
});

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }
  const adminId = decode.userId;
  const { status, location, note } = req.body;

  const result = await ParcelServices.updateParcelStatus(
    id,
    { status, location, note },
    adminId,
  );

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Parcel status updated successfully",
    data: result,
  });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }
  const senderId = decode.userId;

  const result = await ParcelServices.cancelParcel(id, senderId);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Parcel cancelled successfully",
    data: result,
  });
});

const getAllParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelServices.getAllParcels();

  sendResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "All Parcel Retrieved Successfully",
    data: result,
  });
});

const getSingleParcel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }

  const result = await ParcelServices.getSingleParcel(id, decode);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Single Parcel Retrieved Successfully",
    data: result,
  });
});

const getMyParcels = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }
  const senderId = decode.userId;

  const result = await ParcelServices.getMyParcels(senderId);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Sender's parcels retrieved successfully",
    data: result,
  });
});

/**
 * Controller for retrieving parcels intended for the authenticated receiver.
 */
const getIncomingParcels = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }
  const decode = decodedToken(token as string);

  if (!decode) {
    throw new Error("Unauthorized: Invalid token");
  }
  const receiverId = decode.userId;
  const result = await ParcelServices.getIncomingParcels(receiverId);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Receiver's incoming parcels retrieved successfully",
    data: result,
  });
});

export const ParcelControllers = {
  createParcel,
  getAllParcel,
  updateParcelStatus,
  cancelParcel,
  getSingleParcel,
  getMyParcels,
  getIncomingParcels,
};
