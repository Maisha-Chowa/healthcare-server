import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { userSearchAbleFields } from "./user.constants";

const prisma = new PrismaClient();
const createAdmin = async (req: Request): Promise<Admin> => {
  console.log("File: ", req.file);
  console.log(req.body);
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log("url : ", uploadToCloudinary?.secure_url);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  console.log(hashedPassword);
  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionclient) => {
    const createUserData = await transactionclient.user.create({
      data: userData,
    });
    console.log(req.body.admin);
    const createAdminData = await transactionclient.admin.create({
      data: req.body.admin,
    });

    return createAdminData;
  });
  return result;
};
const createDoctor = async (req: Request): Promise<Doctor> => {
  console.log("File: ", req.file);
  console.log(req.body);
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log("url : ", uploadToCloudinary?.secure_url);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  console.log(hashedPassword);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const result = await prisma.$transaction(async (transactionclient) => {
    const createUserData = await transactionclient.user.create({
      data: userData,
    });
    console.log(req.body.doctor);
    const createDoctorData = await transactionclient.doctor.create({
      data: req.body.doctor,
    });

    return createDoctorData;
  });
  return result;
};
const createPatient = async (req: Request): Promise<Patient> => {
  console.log("File: ", req.file);
  console.log(req.body);
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    console.log("url : ", uploadToCloudinary?.secure_url);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  console.log(hashedPassword);
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const result = await prisma.$transaction(async (transactionclient) => {
    const createUserData = await transactionclient.user.create({
      data: userData,
    });
    console.log(req.body.patient);
    const createPatientData = await transactionclient.patient.create({
      data: req.body.patient,
    });

    return createPatientData;
  });
  return result;
};

const getAllfromDB = async (params: any, options: IPaginationOptions) => {
  //   console.log({ params });
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.UserWhereInput[] = [];
  //   const adminSearchAbleFields = ["name", "email"];
  if (params.searchTerm) {
    andCondition.push({
      OR: userSearchAbleFields.map(
        (field) => (
          console.log("field:", field),
          console.log([field]),
          {
            [field]: {
              contains: params.searchTerm,
              mode: "insensitive",
            },
          }
        )
      ), //use map, cause map return an arry and we need to pass an array inside OR
      //   OR: ["name", "email"].map(
      //     (field) => (
      //       console.log(field),
      //       console.log([field]),
      //       {
      //         [field]: {
      //           contains: params.searchTerm,
      //           mode: "insensitive",
      //         },
      //       }
      //     )
      //   ), //use map, cause map return an arry and we need to pass an array inside OR
      //   OR: [
      //     {
      //       name: {
      //         contains: params.searchTerm,
      //         mode: "insensitive",
      //       },
      //     },
      //     {
      //       email: {
      //         contains: params.searchTerm,
      //         mode: "insensitive",
      //       },
      //     },
      //   ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  console.dir(andCondition, { depth: "infinity" });
  const whereConditions: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  // return result;
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllfromDB,
};
