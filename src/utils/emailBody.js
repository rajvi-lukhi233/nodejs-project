export const getVerifyEmailTemplate = (name, verifyLink) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background:#f4f6f8;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:20px;">
            <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:30px; border-radius:8px;">
              <tr>
                <td>
                  <h2 style="margin-top:0;">Hello ${name}, 👋</h2>

                  <p>
                    Thanks for registering. Please verify your email address by clicking
                    the button below:
                  </p>

                  <div style="text-align:center; margin:30px 0;">
                    <a
                      href="${verifyLink}"
                      target="_blank"
                      style="
                        background:#4f46e5;
                        color:#ffffff;
                        padding:14px 24px;
                        text-decoration:none;
                        border-radius:6px;
                        display:inline-block;
                        font-weight:bold;
                      "
                    >
                      Verify Email
                    </a>
                  </div>

                  <p style="margin-bottom:8px;">
                    If the button does not work, click the link below:
                  </p>

                  <p style="word-break: break-all;">
                    <a
                      href="${verifyLink}"
                      target="_blank"
                      style="color:#4f46e5; text-decoration:none;"
                    >
                      ${verifyLink}
                    </a>
                  </p>

                  <p style="font-size:12px; color:#888;">
                    This link will expire soon. If you did not create this account,
                    you can safely ignore this email.
                  </p>

                  <p>
                    Thanks,<br/>
                    Your App Team
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

export const getOtpEmailTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>OTP Verification</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f6f8;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; padding:30px; border-radius:8px;">
              
              <tr>
                <td>
                  <h2 style="margin-top:0;">Hello ${name}, 👋</h2>
                  <p>
                    Thank you for registering. Please use the OTP below to verify your account.
                  </p>

                  <div style="text-align:center; margin:30px 0;">
                    <span style="
                      font-size:28px;
                      font-weight:bold;
                      letter-spacing:8px;
                      color:#4f46e5;
                      background:#eef2ff;
                      padding:15px 25px;
                      border-radius:6px;
                      display:inline-block;
                    ">
                      ${otp}
                    </span>
                  </div>

                  <p>
                    This OTP is valid for <strong>10 minutes</strong>.
                  </p>

                  <p style="font-size:12px; color:#888;">
                    If you did not request this, please ignore this email.
                  </p>

                  <p>
                    Thanks,<br/>
                    Your App Team
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
