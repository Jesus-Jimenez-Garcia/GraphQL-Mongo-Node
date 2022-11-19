import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const verified = jwt.verify(token, "piedrarosseta");

    req.verifiedUser = verified.user;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};
