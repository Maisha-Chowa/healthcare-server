import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expiresIn: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_SECRET,
    refresh_token_expiresIn: process.env.REFRESH_EXPIRES_IN,
    reset_pass_token_secret: process.env.JWT_SECRET,
    reset_pass_token_expiresIn: process.env.PASS_RESET_EXPIRATION_TIME,
  },
  reset_pass_link: process.env.RESET_LINK,
  email: process.env.EMAIL,
  app_pass: process.env.APP_PASS,
};
