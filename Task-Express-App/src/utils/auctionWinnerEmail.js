import nodemailer from "nodemailer";
import cron from "node-cron";
import { Product } from "../db/Model/model.js";
import { loginUser } from "../db/Controller/users.js";
import pool from "../../db.js";
import logger from "./logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nikeshsapkota2021@gmail.com",
    pass: "fxtl sxvi ssmz hyvt",
  },
});

const sendVerificationEmail = async (
  to,
  productName,
  bidAmount,
  productImageURL
) => {
  console.log(productImageURL);
  const mailOptions = {
    from: "nikeshsapkota2021@gmail.com",
    to,
    subject: "Congratulations you won the auction",
    html: `
    <div style="text-align: center;">
      <h1 style="color: #007bff; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Congratulations! You won the auction</h1>
      <p style="color: #333333; font-size: 16px; line-height: 24px;">
        Dear winner,<br/><br/>
        Congratulations! You won the auction for the product "<span style="font-weight: bold;">${productName}</span>".<br/>
        Your bid amount was <span style="font-weight: bold;">Rs.${bidAmount}</span>.<br/><br/>
        Thank you for participating in the auction.<br/><br/>
        <span style="font-weight: bold;">Best regards,<br/>
        Sapkota Auction Team</span>
      </p>
      <img src="${productImageURL}" alt="${productName}" style="max-width: 100%; height: auto; margin-top: 20px;">
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Auction winning mail sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
export const runCronJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      logger.log("info", "Checking for inspiry");

      // console.log("Checking for expiry");

      // Construct the SQL query to find expired products and their highest bidders
      const query = `
        SELECT p.id AS product_id,
               p.name AS product_name,
               p.photos AS product_photo,
               p.highest_bidder AS bidder_id,
               u.email AS bidder_email,
               p.highest_bid_amount AS bid_amount
        FROM product p
        JOIN "user" u ON p.highest_bidder = u.id
        WHERE p.expiry_date <= NOW()
        AND p.win_notified = FALSE;
      `;

      // Execute the query
      const { rows: expiredProducts } = await pool.query(query);

      // Iterate over each expired product
      for (const product of expiredProducts) {
        // Send email to the winner
        const emailSent = await sendVerificationEmail(
          product.bidder_email,
          product.product_name,
          product.bid_amount,
          product.product_photo
        );

        // Update the product to mark the win as notified
        const updateQuery = `
          UPDATE product
          SET win_notified = TRUE
          WHERE id = $1;
        `;
        await pool.query(updateQuery, [product.product_id]);
      }
    } catch (error) {
      console.error(
        "Error occurred while checking for expired auctions:",
        error
      );
    }
  });
};
