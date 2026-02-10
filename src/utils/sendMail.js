import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (email, subject, body) => {
  try {
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: body,
    };
    await transporter.sendMail(mailOption);
    console.log('Email sending successfully.');
  } catch (error) {
    console.log('Faild to send email:', error);
  }
};
