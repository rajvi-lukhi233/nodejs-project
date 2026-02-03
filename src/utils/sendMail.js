const nodemailer = require("nodemailer");

const transporter = nodemailer.transporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMail = async (otp, email, subject, body) => {
  try {
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      body,
    };
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log("Faild to send email:", error);
  }
};
