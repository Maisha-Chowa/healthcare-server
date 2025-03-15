import nodemailer from "nodemailer";
import config from "../../../config";
const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.email,
      pass: config.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Health-Care Projet 👻" <maisha.chowa@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Forgot Password", // Subject line
    text: "Here is your Forgot pass link", // plain text body
    html,
  });
};

export default emailSender;
