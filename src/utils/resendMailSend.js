import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email, subject, body) => {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: subject,
    html: body,
  });
  if (error) {
    console.log('Failed to sending email', error);
    return;
  }
  console.log('Email sent successfully');
  return data;
};
