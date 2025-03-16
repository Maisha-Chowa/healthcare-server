import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";

const prisma = new PrismaClient();
const createAdmin = async (req: any) => {
  console.log("File: ", req.file);
  console.log(req.body);
  const file = req.file;
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

export const userService = {
  createAdmin,
};
