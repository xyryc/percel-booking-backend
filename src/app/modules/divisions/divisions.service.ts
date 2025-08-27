import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivisons = async (payload: IDivision) => {
  const BaseSlug = payload.name.toLowerCase().split(" ").join("-");
  let slug = `${BaseSlug}-division`;
  const existingDivision = await Division.findOne({
    where: { name: payload.name },
  });
  if (existingDivision) {
    throw new Error("Division already exists");
  }
  let count = 0;
  while (await Division.exists({ slug })) {
    count++;
    slug = `${BaseSlug}-division-${count}`;
  }
  payload.slug = slug;
  payload.isActive = true;
  const newDivision = Division.create(payload);
  return newDivision;
};

const getAllDivisions = async () => {
  const divisions = await Division.find({});
  const divisionCount = await Division.countDocuments();
  return{
    data: divisions,
    meta:{
      total: divisionCount,
    },
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  if (!division) {
    throw new Error("Division not found");
  }
  return division;
};

const deleteDivision = async(id: string) => {
  const division = await Division.findByIdAndDelete(id);
  if (!division) {
    throw new Error("Division not found");
  }
  return division;
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await Division.findById(id);
  if (!existingDivision) {
    throw new Error("Division not found");
  }
  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new Error("Division with this name already exists");
  }
  if (payload.name) {
    const BaseSlug = payload.name.toLowerCase().split(" ").join("-");
    let slug = `${BaseSlug}-division`;
    let count = 0;
    while (await Division.exists({ slug, _id: { $ne: id } })) {
      count++;
      slug = `${BaseSlug}-division-${count}`;
    }
    payload.slug = slug;
  }
  const updatedDivision = await Division.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );
  if (!updatedDivision) {
    throw new Error("Failed to update division");
  }
  return updatedDivision;
};

export const divisionsService = {
  createDivisons,
  getAllDivisions,
  getSingleDivision,
  deleteDivision,
  updateDivision,
};
