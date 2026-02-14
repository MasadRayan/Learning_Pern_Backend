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
  
  const productId = req.params.id;

  const productSchema = z.object({
    id: z.uuid(),
  })

  const { success, data, error } = productSchema.safeParse({ id: productId });

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Invalid product ID",
    });
  }
  
  const product = await prisma.product.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  return res.json({
    status: "success",
    message: "Product fetched successfully",
    data: { product },
  })

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
  
  const productId = req.params.id;

  const productUpdateSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1).optional(),
    slug: z.string().min(1).nullable().optional(),
    description: z.string().nullable().optional(),
    categoryId: z.uuid().optional(),
    basePrice: z.number().min(1).optional(),
    originalPrice: z.number().min(1).optional(),
    stockQuantity: z.number().min(1).optional(),
  })

  const {success, data, error} = productUpdateSchema.safeParse({ id: productId, ...req.body });

  if (!success) {
    res.json({
      status: "error",
      message: "Invalid request data",
    })
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: data.id,
    }
  })

  if (!existingProduct) {
    res.json({
      status: "error",
      message: "Product not found",
    })
  }

  const productPayload = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    categoryId: data.categoryId,
    basePrice: data.basePrice,
    originalPrice: data.originalPrice,
    stockQuantity: data.stockQuantity,
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: data.id
    },
    data: productPayload,
  })

  res.json({
    status: "success",
    message: "Product updated successfully",
    data: { product: updatedProduct },
  })


};

export const deleteProduct = async (req, res) => {
  return res.send("Delete Product");
};
