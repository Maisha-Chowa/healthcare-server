import { Admin, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { adminSearchAbleFields } from "./admin.constant";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllfromDB = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  //   console.log({ params });
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.AdminWhereInput[] = [];
  //   const adminSearchAbleFields = ["name", "email"];
  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map(
        (field) => (
          console.log(field),
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
  andCondition.push({
    isDeleted: false,
  });
  console.dir(andCondition, { depth: "infinity" });
  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
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
  });

  const total = await prisma.admin.count({
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

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    const userDeletedData = await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });
  return result;
};

const softdeleteFromDB = async (id: string): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    const userDeletedData = await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const AdminService = {
  getAllfromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softdeleteFromDB,
};
