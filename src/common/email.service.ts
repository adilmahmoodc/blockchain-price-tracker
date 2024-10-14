import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Send an email alert when the price increases by more than the set threshold.
 * @param chain - The blockchain (e.g., Ethereum, Polygon).
 * @param email - The recipient email for the alert.
 * @param price - The current price of the blockchain.
 */
export const sendPriceAlertEmail = async (
  chain: string,
  email: string,
  price: number,
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
  });

  const mailOptions = {
    from: 'your-email@example.com',
    to: email,
    subject: `${chain} Price Alert`,
    text: `The price of ${chain} has increased to ${price} USD.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(
    `Price alert email sent for ${chain} at ${price} USD to ${email}`,
  );
};
