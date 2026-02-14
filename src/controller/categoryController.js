import { id } from "zod/locales";
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
    
    const categoryId = req.params.id;

    const categorySchema = z.object({
        id: z.uuid(),
    })

    const { success, data, error } = categorySchema.safeParse({ id: categoryId });

    if (!success) {
        return res.status(400).json({
            status: "error",
            message: "Invalid category ID",
        });
    }

    const category = await prisma.category.findUnique({
        where: {
            id: data.id,
        },
    });

    if (!category) {
        return res.status(404).json({
            status: "error",
            message: "Category not found",
        });
    }
    
    return res.json({
        status: "success",
        message: "Category fetched successfully",
        data: { category },
    });

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
    
    const categoryId = req.params.id;

    const categoryUpdateSchema = z.object({
        id: z.uuid(),
        name: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        slug: z.string().min(1).nullable().optional(),
        parentId: z.uuid().nullable().optional(),
        imageUrl: z.string().url().nullable().optional(),
    })

    const { success, data, error } = categoryUpdateSchema.safeParse({ ...req.body, id: categoryId });

    if (!success) {
        console.log(error); // Add this to see what's failing
        return res.status(400).json({
            status: "error",
            message: "Invalid request data",
            errors: error.errors, // Include this to help with debugging
        });
    }
    
    const categoryPayload = {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId,
        description: data.description,
        imageUrl: data.imageUrl,
    };

    const updatedCategory = await prisma.category.update({
        where: {
            id: data.id,
        },
        data: categoryPayload,
    });

    return res.json({
        status: "success",
        message: "Category updated successfully",
        data: { category: updatedCategory },
    });

}

export const deleteCategory = async (req, res) => {
   
    const categoryId = req.params.id;

    const categorySchema = z.object({
        id: z.uuid()
    })

    const {success, data, error} = categorySchema.safeParse({ id: categoryId });

    if (!success) {
        res.status(400).json({
            status: "error",
            message: "Invalid category ID",
        });
    }

    const iscCategoryExists = await prisma.category.findUnique({
        where: {
            id: data.id,
        }
    })

    if (!iscCategoryExists) {
        return res.status(404).json({
            status: "error",
            message: "Category not found",
        });
    }

    const deleteCategory = await prisma.category.delete({
        where: {
            id: data.id,
        }
    })

    res.json({
        status: "success",
        message: "Category deleted successfully",
        data: { category: deleteCategory },
    })

}