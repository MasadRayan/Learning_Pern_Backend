import { prisma } from "../database/prisma.js";
import { z } from "zod";



export const getAllCategories = async (req, res) => {
    const allCategories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return res.json({
        status: "success",
        message: "Categories fetched successfully",
        data: { categories: allCategories },
    });
}

export const getACategory = async (req, res) => {
    return res.send("A Category")
}

export const createCategory = async (req, res) => {
    const categorySchema = z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        slug: z.string().min(1).optional(),
        parentId: z.uuid().optional(),
        imageUrl: z.url().optional(),
    });

    const { success, data, error } = categorySchema.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            status: "error",
            message: "Invalid request data",
        });
    }

    // check if parent category exists
    // if (data.parentId) {
    //     const parentCategoryExists = await prisma.category.findUnique({
    //         where: {
    //             id: data.parentId,
    //         },
    //     });

    //     if (!parentCategoryExists) {
    //         return res.status(400).json({
    //             status: "error",
    //             message: "Parent category does not exist",
    //         });
    //     }
    // }

    const categoryPayload = {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId,
        description: data.description,
        imageUrl: data.imageUrl,
    };

    const newCategory = await prisma.category.create({
        data: categoryPayload,
    });

    return res.json({
        status: "success",
        message: "Category created successfully",
        data: { category: newCategory },
    });
}

export const updateCategory = async (req, res) => {
    return res.send("Update Category")
}

export const deleteCategory = async (req, res) => {
    return res.send("Delete Category")
}