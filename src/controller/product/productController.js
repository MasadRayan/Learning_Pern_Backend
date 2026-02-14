import { spec } from "node:test/reporters";
import { prisma } from "../../database/prisma.js";
import { z } from "zod";
import { is } from "zod/locales";

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
  });

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
    include: {
      category: true,
      variants: true,
      images: true,
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
  });
};

export const createProduct = async (req, res) => {
  const productSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    description: z.string().min(5),
    basePrice: z.number().positive(),
    originalPrice: z.number().positive().optional(),
    stockQuantity: z.number().int().nonnegative(),
    specifications: z.any().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    categoryId: z.uuid(),
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
    title: data.title,
    slug: data.slug,
    description: data.description,
    basePrice: data.basePrice,
    originalPrice: data.originalPrice,
    stockQuantity: data.stockQuantity,
    specifications: data.specifications,
    isFeatured: data.isFeatured,
    isActive: data.isActive,
    categoryId: data.categoryId,
  };

  const createProduct = await prisma.product.create({
    data: productPayload,
  });

  res.json({
    status: "success",
    message: "Product created successfully",
    data: { product: createProduct },
  });
};

export const updateProduct = async (req, res) => {
  const productId = req.params.id;

  const productUpdateSchema = z.object({
    id: z.uuid(),
    title: z.string().min(1).optional(),
    slug: z.string().min(1).nullable().optional(),
    description: z.string().nullable().optional(),
    categoryId: z.uuid().optional(),
    basePrice: z.coerce.number().min(0.01).optional(),
    originalPrice: z.coerce.number().min(0.01).nullable().optional(),
    stockQuantity: z.coerce.number().int().min(0).optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    specifications: z.any().optional(),
  });

  const { success, data, error } = productUpdateSchema.safeParse({
    id: productId,
    ...req.body,
  });

  if (!success) {
    console.log(error); // Debug: see what's failing
    return res.status(400).json({
      // Add return and proper status code
      status: "error",
      message: "Invalid request data",
      errors: error.errors, // Include error details
    });
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!existingProduct) {
    return res.status(404).json({
      // Add return and proper status code
      status: "error",
      message: "Product not found",
    });
  }

  const productPayload = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    categoryId: data.categoryId,
    basePrice: data.basePrice,
    originalPrice: data.originalPrice,
    stockQuantity: data.stockQuantity,
    isFeatured: data.isFeatured,
    isActive: data.isActive,
    specifications: data.specifications,
  };

  const updatedProduct = await prisma.product.update({
    where: {
      id: data.id,
    },
    data: productPayload,
  });

  return res.json({
    status: "success",
    message: "Product updated successfully",
    data: { product: updatedProduct },
  });
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  const productSchema = z.object({
    id: z.uuid(),
  });

  const { success, data, error } = productSchema.safeParse({ id: productId });

  if (!success) {
    return res.status(400).json({
      status: "error",
      message: "Invalid product ID",
    });
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!existingProduct) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  const deletedProduct = await prisma.product.delete({
    where: {
      id: data.id,
    },
  });

  res.json({
    status: "success",
    message: "Product deleted successfully",
    data: { product: deletedProduct },
  });
};
