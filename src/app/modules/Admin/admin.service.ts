import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { adminSearchAbleFields } from "./admin.constant";

const getAllfromDB = async (params: any, options: any) => {
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
          equals: filterData[key],
        },
      })),
    });
  }
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
  return result;
};

export const AdminService = {
  getAllfromDB,
};
