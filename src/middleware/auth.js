import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  const accessToken = authHeader.split(" ")[1];

  const secretkey = process.env.JWT_SECRET;

  jwt.verify(accessToken, secretkey, async (error, decoded) => {
    if (error) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    const userId = decoded.sub;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        passwordHash: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    req.user = user;
    next();
  });
};

export default authMiddleware;