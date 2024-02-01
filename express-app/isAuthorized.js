import fs from "fs/promises";
const jsonPath = "./users.json";

const readUsers = async () => {
  try {
    const fileContent = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error("Existing data couldn't be fetched");
  }
};

const isAuthorized = (roles) => {
  return async (req, res, next) => {
    try {
      let UserId = req.id;
      console.log(UserId);
      let users = await readUsers();
      let user = users.find((value) => value.id === UserId);
      let userRole = user.role;
      console.log(userRole);
      console.log(roles);
      if (roles.includes(userRole)) {
        next();
      } else {
        res.status(401).json({
          status: false,
          message: `Not authorized`,
        });
      }
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default isAuthorized;
