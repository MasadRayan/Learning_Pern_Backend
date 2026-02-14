import { prisma } from "../database/prisma.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllProducts = async (req, res) => {
  const allProducts = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json({
    status: "success",
    message: "Products fetched successfully",
    data: { products: allProducts },
  });
};

export const getAProduct = async (req, res) => {
  return res.send("A Product");
};

export const createProduct = async (req, res) => {
  const productSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    categoryId: z.uuid(),
    basePrice: z.number().min(1),
    originalPrice: z.number().min(1).optional(),
    stockQuantity: z.number().min(1),
    
  });

  const { success, data, error } = productSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Invalid request data",
    });
  }

  // check if category exists
  const categoryExists = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!categoryExists) {
    return res.status(400).json({
      status: "error",
      message: "Category does not exist",
    });
  }

    const productPayload = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    categoryId: data.categoryId,
    basePrice: data.basePrice,
    originalPrice: data.originalPrice,
    stockQuantity: data.stockQuantity,
  };

  const createProduct = await prisma.product.create({
    data: productPayload,
  })

  res.json({
    status: "success",
    message: "Product created successfully",
    data: { product: createProduct },
  })


};

export const updateProduct = async (req, res) => {
  return res.send("Update Product");
};

export const deleteProduct = async (req, res) => {
  return res.send("Delete Product");
};
