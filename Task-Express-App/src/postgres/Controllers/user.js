import pool from "../../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

export const createUser = async (req, res) => {
  let { name, email, phoneNumber, address, password, role } = req.body;
  console.log("emailName", email);
  console.log("password", password);

  try {
    const existingUser = await pool.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email]
    );
    // console.log(existingUser);
    // logger.log("info", existingUser.rows[0]);
    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (!role) {
        role = "customer";
      }

      const query = `
        INSERT INTO "user" (name, email, phone_number, address, password, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const values = [name, email, phoneNumber, address, hashedPassword, role];

      const result = await pool.query(query, values);

      // console.log(result.rows[0]);

      if (process.env.RESPONSE_TYPE === "JSON") {
        return res.json({ success: true, data: result.rows[0] });
      } else if (process.env.RESPONSE_TYPE === "EJS") {
        res.send(
          `<script>alert("Registration successful!"); window.location.href = "/user/login";</script>`
        );
      } else {
        logger.log("error", "Invalid response type");
      }

      logger.log("info", "User registered successfully");
    } else {
      // logger.log("error", "User already exists");
      throw new Error("User already exists");
    }
    // Hash the password
  } catch (error) {
    logger.log("error", error.message);
    if (process.env.RESPONSE_TYPE === "JSON") {
      return res.json({ success: false, error: error.message });
    } else if (process.env.RESPONSE_TYPE === "EJS") {
      res.render("error", { errorMessage: error.message });
    } else {
      logger.log("error", "Invalid response type");
    }
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [
      email,
    ]);
    if (user) {
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );
      if (validPassword) {
        const infoObj = {
          _id: user.rows[0].id,
        };
        const expiryDate = {
          expiresIn: "365d",
        };
        const token = jwt.sign(infoObj, process.env.SECRET_KEY, expiryDate);

        if (process.env.RESPONSE_TYPE === "JSON") {
          res.cookie("token", token, { httpOnly: true });

          return res.json({
            success: true,
            message: "Login successful",
            token: token,
          });
        } else if (process.env.RESPONSE_TYPE === "EJS") {
          res.cookie("token", token, { httpOnly: true });
          if (email === "nikeshsapkota@gmail.com") {
            logger.log("info", "Admin logged in");
            res.send(`<script> window.location.href = "/admin";</script>`);
          } else {
            logger.log("info", "User logged in");
            res.send(`<script> window.location.href = "/";</script>`);
          }
        } else {
          logger.log("error", "Invalid response type");
        }
      } else {
        throw new Error("Invalid Password");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    logger.log("error", error.message);
    if (process.env.RESPONSE_TYPE === "JSON") {
      return res.json({ success: false, error: error.message });
    } else if (process.env.RESPONSE_TYPE === "EJS") {
      res.render("error", { errorMessage: error.message });
    } else {
      logger.log("error", "Invalid response type");
    }
  }
};
