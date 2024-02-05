import fs from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const jsonPath = "./src/fs/Controllers/user.json";
import dotenv from "dotenv";

dotenv.config();

// Read all products
const readUsers = async () => {
  try {
    const fileContent = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File not found, return an empty array
      return [];
    }
    throw new Error("Error reading data from the file");
  }
};

//Write product
const writeUsers = async (data) => {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error writing data to the file");
  }
};

export const createUser = async (req, res) => {
  let newUser = {};
  try {
    const { name, email, phoneNumber, address, password, role } = req.body;

    // read previous users
    let existingUsers = await readUsers();
    console.log(existingUsers.name);

    // check if new user already exists in database
    const existingUser = existingUsers.find((value) => value.email === email);

    if (!existingUser) {
      const id = Date.now();
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      newUser = {
        id,
        name,
        email,
        phoneNumber,
        address,
        password: hashedPassword,
        role,
      };
      const updatedData = [...existingUsers, newUser];

      console.log(id);

      //write new user
      await writeUsers(updatedData);
    } else {
      throw new Error("User already exists");
    }

    res.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const allUsers = await readUsers();
    const user = allUsers.find((user) => user.email === email);
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        let infoObj = {
          _id: user.id,
        };

        let expiryInfo = {
          expiresIn: "365d",
        };
        const verificationToken = await jwt.sign(
          infoObj,
          process.env.SECRET_KEY,
          expiryInfo
        );
        res.json({
          success: true,
          message: "Login successful",
          data: user,
          token: verificationToken,
        });
      } else {
        throw new Error("Password is wrong");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await readUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

//Get products that are out of stock
export const getOutOfStock = async (req, res) => {
  try {
    const products = await readUsers();
    //filter products having quantity less than 1
    const outOfStock = products.filter((value) => value.quantity < 1);
    res.json({
      success: true,
      data: outOfStock,
    });
  } catch (error) {
    res.json({
      success: false,
      error: "Error getting out-of-stock products",
    });
  }
};

//Update products information
export const updateUser = async (req, res) => {
  //change id to integer
  const id = parseInt(req.params.id);
  const data = req.body;

  delete data.email;
  delete data.password;
  try {
    const users = await readUsers();
    //get index of product to update
    const userIndex = users.findIndex((value) => value.id === id);
    if (userIndex > -1) {
      users[userIndex] = { ...users[userIndex], ...data };

      //save to file
      await writeUsers(users);
    } else {
      throw new Error("User not found");
    }

    //update with new data

    res.json({
      success: true,
      data: users[userIndex],
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

//Delete specific product
export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const users = await readUsers();
    const userIndex = users.findIndex((value) => value.id === id);

    // Delete the specific product needed to delete
    users.splice(userIndex, 1);

    // Save remaining producs to file
    await writeUsers(users);

    res.json({
      success: true,
      data: users[userIndex],
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

//Get specific product
export const getSpecificUser = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  try {
    const users = await readUsers();
    console.log(users);
    const user = users.find((value) => value.id === id);
    console.log(user);
    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      throw Error;
    }
  } catch (error) {
    res.json({
      success: false,
      error: `No user with the id ${id}`,
    });
  }
};
