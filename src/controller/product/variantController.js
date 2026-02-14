import { prisma } from "../../database/prisma.js";
import { z } from "zod";

export const getAllVariants = async (req, res) => {
   
    const allVariants = await prisma.productVariant.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!allVariants) {
        return res.status(404).json({
            status: "error",
            message: "No variants found",
        });
    }

    return res.json({
        status: "success",
        message: "Variants fetched successfully",
        data: { variants: allVariants },
    });
};