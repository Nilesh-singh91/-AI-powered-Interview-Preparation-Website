import jwt from "jsonwebtoken";

console.log("JWT_SECRET =", process.env.JWT_SECRET);

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;