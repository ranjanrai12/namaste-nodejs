const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../utils/sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  const subject = "✨ Welcome to DevMatches – Let’s Get Started!";
  const htmlBody = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        background: #ffffff;
        margin: 40px auto;
        padding: 30px;
        max-width: 600px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 10px;
      }
      .header h1 {
        color: #4f46e5;
        margin: 0;
        font-size: 26px;
      }
      .content {
        padding: 20px 0;
        color: #333333;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        background-color: #4f46e5;
        color: white !important;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        color: #999999;
        font-size: 12px;
        padding-top: 20px;
      }
      @media (max-width: 600px) {
        .container {
          width: 95%;
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to DevMatches 🎉</h1>
      </div>
      <div class="content">
        <p>Hi there 👋,</p>
        <p>We’re thrilled to have you join <strong>DevMatches</strong> — a place where developers and opportunities meet.</p>
        <p>Click the button below to verify your email and start building meaningful connections:</p>
        <a href="https://devmatches.xyz/verify?email=${encodeURIComponent(toAddress)}" class="button">Verify My Email</a>
        <p>If you didn’t request this, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} DevMatches. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const textBody = `
  Welcome to DevMatches!

  We're excited to have you onboard.
  Verify your email to get started:
  https://devmatches.xyz/verify?email=${toAddress}

  — The DevMatches Team
  `;

  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "ranjankrrai93@gmail.com",
    "ranjan@devmatches.xyz"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      return caught;
    }
    throw caught;
  }
};

module.exports = { run };
