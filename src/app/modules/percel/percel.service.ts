import { IParcel, ICreateParcelPayload, IUpdateParcelStatusPayload, IParcelStatus } from "./percel.interface";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { Parcel } from "./percel.mode";
import AppError from "../../errorHelpers/appError";
import { role } from "../user/user.interface";


const prepareParcelResponse = (parcel: IParcel): IParcel => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { ...rest } = (parcel as any).toJSON();
  return rest as IParcel;
};

// Helper function to generate a unique tracking ID
const generateTrackingId = (): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const randomChars = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `TRK-${formattedDate}-${randomChars}`;
};


const createParcel = async (
  payload: ICreateParcelPayload,
  senderId: string,
): Promise<IParcel> => {

  // Ensure receiver.userId is a valid ObjectId if provided
  let receiverUserId: Types.ObjectId | undefined;
  if (payload.receiver.userId && Types.ObjectId.isValid(payload.receiver.userId)) {
    receiverUserId = new Types.ObjectId(payload.receiver.userId);
  }

  const newParcelData: IParcel = {
    // Other payload data
    parcelType: payload.parcelType,
    weight: payload.weight,
    deliveryAddress: payload.deliveryAddress,
    
    // Core parcel data
    trackingId: generateTrackingId(),
    sender: new Types.ObjectId(senderId),
    receiver: {
      name: payload.receiver.name,
      phone: payload.receiver.phone,
      address: payload.receiver.address,
      userId: receiverUserId,
    },
    currentStatus: IParcelStatus.Requested,
    isCancelled: false,
    isDelivered: false,
    statusLogs: [
      {
        status: IParcelStatus.Requested,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(senderId),
        note: "Parcel delivery request created by sender",
      },
    ],
  };

  const newParcel = await Parcel.create(newParcelData);
  return prepareParcelResponse(newParcel);
};



const getAllParcels = async (): Promise<IParcel[]> => {
  const parcels = await Parcel.find({}).populate("sender").populate("receiver.userId");
  return parcels.map((parcel) => prepareParcelResponse(parcel as IParcel));
};



const getSingleParcel = async (parcelId: string, user: JwtPayload): Promise<IParcel | null> => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError( "Parcel not found", httpStatus.NOT_FOUND);
  }

  if (user.role === role.ADMIN || parcel.sender.toString() === user.userId || parcel.receiver.userId?.toString() === user.userId) {
    return prepareParcelResponse(parcel as IParcel);
  }

  throw new AppError( "You are not authorized to view this parcel", httpStatus.FORBIDDEN);
};

const cancelParcel = async (parcelId: string, senderId: string): Promise<IParcel> => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError( "Parcel not found", httpStatus.NOT_FOUND);
  }

 
  if (parcel.sender.toString() !== senderId.toString()) { 
    throw new AppError( "You are not authorized to cancel this parcel", httpStatus.FORBIDDEN);
  }


  if (parcel.currentStatus !== IParcelStatus.Requested && parcel.currentStatus !== IParcelStatus.Approved) {
    throw new AppError( "Parcel cannot be cancelled as it has already been dispatched", httpStatus.BAD_REQUEST);
  }
  
  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      isCancelled: true,
      currentStatus: IParcelStatus.Cancelled,
      $push: {
        statusLogs: {
          status: IParcelStatus.Cancelled,
          timestamp: new Date(),
          updatedBy: new Types.ObjectId(senderId.toString()), 
          note: "Parcel was cancelled by sender",
        },
      },
    },
    { new: true },
  );

  return prepareParcelResponse(updatedParcel as IParcel);
};


const updateParcelStatus = async (
  parcelId: string,
  payload: IUpdateParcelStatusPayload,
  adminId: string,
): Promise<IParcel> => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError( "Parcel not found", httpStatus.NOT_FOUND);
  }

  const currentStatus = parcel.currentStatus;
  const newStatus = payload.status;
  
  if (
    (currentStatus === IParcelStatus.Requested && newStatus !== IParcelStatus.Approved && newStatus !== IParcelStatus.Cancelled && newStatus !== IParcelStatus.Held) ||
    (currentStatus === IParcelStatus.Approved && newStatus !== IParcelStatus.Dispatched && newStatus !== IParcelStatus.Cancelled && newStatus !== IParcelStatus.Held) ||
    (currentStatus === IParcelStatus.Dispatched && newStatus !== IParcelStatus.InTransit && newStatus !== IParcelStatus.Delivered) ||
    (currentStatus === IParcelStatus.InTransit && newStatus !== IParcelStatus.Delivered) ||
    (currentStatus === IParcelStatus.Delivered || currentStatus === IParcelStatus.Cancelled || currentStatus === IParcelStatus.Returned)
  ) {
    throw new AppError( `Cannot change status from ${currentStatus} to ${newStatus}`, httpStatus.BAD_REQUEST);
  }

  if (parcel.isCancelled || parcel.isDelivered) {
    throw new AppError( "Cannot update a cancelled or delivered parcel.", httpStatus.BAD_REQUEST);
  }

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      currentStatus: newStatus,
      $push: {
        statusLogs: {
          status: newStatus,
          timestamp: new Date(),
          updatedBy: new Types.ObjectId(adminId),
          location: payload.location,
          note: payload.note,
        },
      },
    },
    { new: true },
  );

  return prepareParcelResponse(updatedParcel as IParcel);
};



const getMyParcels = async (senderId: string): Promise<IParcel[]> => {
  const parcels = await Parcel.find({ sender: new Types.ObjectId(senderId) }).populate("sender").populate("receiver.userId");
  return parcels.map((parcel) => prepareParcelResponse(parcel as IParcel));
};

const getIncomingParcels = async (receiverId: string): Promise<IParcel[]> => {
  const parcels = await Parcel.find({ "receiver.userId": new Types.ObjectId(receiverId) }).populate("sender").populate("receiver.userId");
  return parcels.map((parcel) => prepareParcelResponse(parcel as IParcel));
};


const deleteParcel = async (parcelId: string): Promise<IParcel | null> => {
  const deletedParcel = await Parcel.findByIdAndDelete(parcelId);
  if (!deletedParcel) {
    throw new AppError( "Parcel not found", httpStatus.NOT_FOUND);
  }
  return prepareParcelResponse(deletedParcel as IParcel);
};


export const ParcelServices = {
  createParcel,
  getAllParcels,
  getMyParcels,
  getSingleParcel,
  getIncomingParcels,
  cancelParcel,
  updateParcelStatus,
  deleteParcel,
};