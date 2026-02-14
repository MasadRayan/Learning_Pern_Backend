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