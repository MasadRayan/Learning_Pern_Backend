import { prisma } from "../../database/prisma.js";
import { z } from "zod";

export const getAllImages = async (req, res) => {
    
    const allImages = await prisma.productImage.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!allImages) {
        return res.status(404).json({
            status: "error",
            message: "No images found",
        });
    }

    return res.json({
        status: "success",
        message: "Images fetched successfully",
        data: { images: allImages },
    });

};

export const getImageById = async (req, res) => {
    const imageId = req.params.id;

    const imageSchema = z.object({
        id: z.uuid(),
    });

    const {success, data, error} = imageSchema.safeParse({ id: imageId });

    if (!success) {
        return res.status(400).json({
            status: "error",
            message: "Invalid image ID",
        });
    }

    const image = await prisma.productImage.findUnique({
        where: {
            id: data.id,
        },
    });

    if (!image) {
        return res.status(404).json({
            status: "error",
            message: "Image not found",
        });
    }

    return res.json({
        status: "success",
        message: "Image fetched successfully",
        data: { image },
    });
}

export const createImage = async (req, res) => {

    const imageSchema = z.object({
        productId: z.uuid(),
        imageUrl: z.url(),
        altText: z.string().optional(),
        displayOrder: z.number().int().nonnegative().optional(),
        isPrimary: z.boolean().default(false).optional(),
    })

    const { success, data, error } = imageSchema.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            status: "error",
            message: "Invalid image data",
            errors: error.errors,
        });
    }

    const isProductExists =await prisma.product.findUnique({
        where: {
            id: data.productId,
        },
    });

    if (!isProductExists) {
        return res.status(404).json({
            status: "error",
            message: "Product not found",
        });
    }

    const newImage = await prisma.productImage.create({
        data: {
            productId: data.productId,
            imageUrl: data.imageUrl,
            altText: data.altText,
            displayOrder: data.displayOrder,
            isPrimary: data.isPrimary,
        },
    });

    return res.json({
        status: "success",
        message: "Image created successfully",
        data: { image: newImage },
    });
    

}

export const deleteImage = async (req, res) => {
    const imageId = req.params.id;

    const imageSchema = z.object({
        id: z.uuid(),
    });

    const { success, data, error } = imageSchema.safeParse({ id: imageId });

    if (!success) {
        return res.status(400).json({
            status: "error",
            message: "Invalid image ID",
        });
    }

    const isImageExists = await prisma.productImage.findUnique({
        where: {
            id: data.id,
        },
    });

    if (!isImageExists) {
        return res.status(404).json({
            status: "error",
            message: "Image not found",
        });
    }

    const deletedImage = await prisma.productImage.delete({
        where: {
            id: data.id,
        },
    });

    if (!deletedImage) {
        return res.status(404).json({
            status: "error",
            message: "Image not found",
        });
    }

    return res.json({
        status: "success",
        message: "Image deleted successfully",
        data: { image: deletedImage },
    });
}

export const updateImage = async (req, res) => {
    const imageId = req.params.id;

    const imageSchema = z.object({
        id: z.uuid(),
        imageUrl: z.url().optional(),
        altText: z.string().optional(),
        displayOrder: z.number().int().nonnegative().optional(),
        isPrimary: z.boolean().optional(),
    });

    const { success, data, error } = imageSchema.safeParse({ id: imageId, ...req.body });

    if (!success) {
        return res.status(400).json({
            status: "error",
            message: "Invalid image data",
            errors: error.errors,
        });
    }

    const isImageExists = await prisma.productImage.findUnique({
        where: {
            id: data.id,
        },
    });

    if (!isImageExists) {
        return res.status(404).json({
            status: "error",
            message: "Image not found",
        });
    }

    const updatedImage = await prisma.productImage.update({
        where: {
            id: data.id,
        },
        data: {
            imageUrl: data.imageUrl,
            altText: data.altText,
            displayOrder: data.displayOrder,
            isPrimary: data.isPrimary,
        },
    });

    return res.json({
        status: "success",
        message: "Image updated successfully",
        data: { image: updatedImage },
    });
}