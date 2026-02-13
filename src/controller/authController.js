import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../database/prisma.js";
import jwt from "jsonwebtoken";

export const UserSignUp = async (req, res) => {
  const userCreateSchema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
  });

  const { success, data, error } = userCreateSchema.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ message: "Validation failed", data: z.flattenError(error) });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash,
  };

  // save the user info to the database
  const createdUser = await prisma.user.create({
    data: user,
  });

  res.json({
    status: "success",
    message: "User created successfully",
    data: { user: createdUser },
  });
};

export const UserSignIn = async (req, res) => {
  const userSignInSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
  });

  const { success, data, error } = userSignInSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      data: z.flattenError(error),
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      status: "error",
      message: "Invalid password",
    });
  }

  const secretkey = process.env.JWT_SECRET;

  const accessToken = jwt.sign({ sub: user.id }, secretkey, {
    expiresIn: "7d",
  });

  res.json({
    status: "success",
    message: "User signed in successfully",
    data: { accessToken },
  });
};

export const GetCurrentUser = async (req, res) => {
  const user = req.user;

  res.json({
    status: "success",
    message: "User info fetched successfully",
    data: { user },
  });
};
