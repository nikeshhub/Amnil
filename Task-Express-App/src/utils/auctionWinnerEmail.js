import nodemailer from "nodemailer";
import cron from "node-cron";
import { Product } from "../db/Model/model.js";
import { loginUser } from "../db/Controller/users.js";

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
      console.log("checking for expiry");
      const expiredProducts = await Product.find({
        expiryDate: { $lte: new Date() },
      }).populate("highestBid.bidder");

      // Iterate over each expired product
      for (const product of expiredProducts) {
        const { highestBid } = product;

        if (highestBid && !highestBid.notified) {
          // Send email to the winner
          const emailSent = await sendVerificationEmail(
            highestBid.bidder.email,
            product.name,
            highestBid.bidAmount,
            product.photos[0]
          );

          // Mark the highest bid as notified
          highestBid.notified = true;
          await product.save();
        }
      }
    } catch (error) {
      console.error(
        "Error occurred while checking for expired auctions:",
        error
      );
    }
  });
};
