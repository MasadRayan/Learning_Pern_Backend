import express from "express";
import cors from "cors";
import { z } from "zod";
import bcrypt from "bcrypt";
import { fi, id } from "zod/locales";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/auth/sign-up", async (req, res) => {
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
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    omit: {
      passwordHash: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json({
    status: "success",
    message: "Users fetched successfully",
    data: { users },
  });
});

app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  const getUserSchema = z.object({
    id: z.uuid(),
  });

  const {success, error } = getUserSchema.safeParse({
    id: userId,
  });

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      data: z.flattenError(error),
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      passwordHash: true,
    }
  })

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  res.json({
    status: "success",
    message: "User fetched successfully",
    data: { user },
  });
});

app.patch("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const userUpdateSchema = z.object({
      id: z.uuid(),
      firstName: z.string().min(3).optional(),
      lastName: z.string().min(3).optional(),
      email: z.email().optional(),
    });

    const { success, data, error } = userUpdateSchema.safeParse({
      id: userId,
      ...req.body,
    });

    if (!success) {
      return res
        .status(400)
        .json({ message: "Validation failed", data: z.flattenError(error) });
    }

    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: user,
      omit: {
        passwordHash: true,
      },
    });

    res.json({
      status: "success",
      message: "User updated successfully",
      data: { user: updateUser },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the user",
      data: "Can not update the user info",
    });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    
    const userdeleteSchema = z.object({
      id: z.uuid(),
    })

    const { success, error } = userdeleteSchema.safeParse({
      id: userId,
    })

    if (!success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        data: z.flattenError(error),
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    const deleteUser = await prisma.user.delete({
      where: {
        id: userId,
      },
      omit : {
        passwordHash: true,
      }
    })

    res.json({
      status: "success",
      message: "User deleted successfully",
      data: { user: deleteUser },
    });

  } catch (error) {
    
  }
})

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
