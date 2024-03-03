import pool from "../../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  let { name, email, phoneNumber, address, password, role } = req.body;

  try {
    const existingUser = await pool.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email]
    );
    console.log(existingUser);

    if (!existingUser) {
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

      console.log(result.rows[0]);

      res.send(
        `<script>alert("Registration successful!"); window.location.href = "/user/login";</script>`
      );
    } else {
      throw new Error("User already exists");
    }
    // Hash the password
  } catch (error) {
    res.render("error", { errorMessage: error.message });
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

        res.cookie("token", token, { httpOnly: true });
        if (email === "nikeshsapkota@gmail.com") {
          res.send(`<script> window.location.href = "/admin";</script>`);
        } else {
          res.send(`<script> window.location.href = "/";</script>`);
        }
      } else {
        throw new Error("Invalid Password");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.render("error", { errorMessage: error.message });
  }
};
