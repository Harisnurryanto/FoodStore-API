import Jwt from "jsonwebtoken";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    res
      .status(401)
      .json({
        errors: "you are not authenticated",
      })
      .end();
  }

  try {
    const token = auth.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    const data = Jwt.verify(token, secret);
    const user = await prismaClient.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new ResponseError(404, "data is not found");
    }

    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

export { authMiddleware };
