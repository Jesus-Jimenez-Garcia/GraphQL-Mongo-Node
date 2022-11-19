import jwt from "jsonwebtoken";

export const createJWTToken = (user) => {
  return jwt.sign({ user }, "piedrarosseta", {
    expiresIn: "4d",
  });
};
