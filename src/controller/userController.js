import { z } from "zod";
import { prisma } from "../database/prisma.js";


export const getAllUsers = async (req, res) => {
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
}

export const getUserById = async (req, res) => {
    const userId = req.params.id;

  const getUserSchema = z.object({
    id: z.uuid(),
  });

  const { success, error } = getUserSchema.safeParse({
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
    },
  });

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
}

export const updateUser = async (req, res) => {
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
}
export const deleteUser = async (req, res) => {
    try {
    const userId = req.params.id;

    const userdeleteSchema = z.object({
      id: z.uuid(),
    });

    const { success, error } = userdeleteSchema.safeParse({
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
      omit: {
        passwordHash: true,
      },
    });

    res.json({
      status: "success",
      message: "User deleted successfully",
      data: { user: deleteUser },
    });
  } catch (error) {
        res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the user",
      data: "Can not delete the user",
    });
  }
}