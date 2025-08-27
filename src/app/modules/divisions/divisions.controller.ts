import { Request, Response } from "express";
import AppError from "../../errorHelpers/appError";
import { divisionsService } from "./divisions.service";

const createDivisions = async (req: Request, res: Response) => {
  try {
    const newDivision = await divisionsService.createDivisons(req.body);
    res.status(201).json({
      message: "Division created successfully",
      division: newDivision,
    });
  } catch (error) {
    throw new AppError(`Failed to create division: ${error}`, 500);
  }
};

const getAllDivisions = async (req: Request, res: Response) => {
  try {
    const divisions = await divisionsService.getAllDivisions();
    res.status(200).json({
      message: "Divisions retrieved successfully",
      data: divisions.data,
      meta: divisions.meta,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve divisions: ${error}`, 500);
  }
};

const getSingleDivision = async (req: Request, res: Response) => {
  try {
    const division = await divisionsService.getSingleDivision(req.params.slug);
    res.status(200).json({
      message: "Division retrieved successfully",
      data: division,
    });
  } catch (error) {
    throw new AppError(`Failed to retrieve division: ${error}`, 500);
  }
};

const deleteDivision = async (req: Request, res: Response) => {
  try {
    const division = await divisionsService.deleteDivision(req.params.id);
    res.status(200).json({
      message: "Division deleted successfully",
      data: division,
    });
  } catch (error) {
    throw new AppError(`Failed to delete division: ${error}`, 500);
  }
};

const updateDivision = async (req: Request, res: Response) => {
  try {
    const updatedDivision = await divisionsService.updateDivision(req.params.id, req.body);
    res.status(200).json({
      message: "Division updated successfully",
      data: updatedDivision,
    });
  } catch (error) {
    throw new AppError(`Failed to update division: ${error}`, 500);
  }
};

export const divisionsController = {
  createDivisions,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
