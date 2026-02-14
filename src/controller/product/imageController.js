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