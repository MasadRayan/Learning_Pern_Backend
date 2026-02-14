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

export const getVariantById = async (req, res) => {

    const variantId = req.params.id;

    const variantSchema = z.object({
        id: z.uuid(),
    })

    const { success, data, error } = variantSchema.safeParse({ id: variantId });

    if (!success) {
        return res.status(400).json({
            status: "error",
            message: "Invalid variant ID",
            error: error.errors,
        });
    }

    const variant = await prisma.productVariant.findUnique({
        where: {
            id: data.id,
        },
    });

    if (!variant) {
        return res.status(404).json({
            status: "error",
            message: "Variant not found",
        });
    }

    return res.json({
        status: "success",
        message: "Variant fetched successfully",
        data: { variant },
    });

}

/**
 * // product variant model
model ProductVariant {
  id              String   @id @default(uuid()) @db.Uuid()
  productId       String   @db.Uuid()
  variantName     String   @db.VarChar(255)
  variantValue    String   @db.VarChar(255)
  priceAdjustment Decimal  @default(0.00) @db.Decimal(10, 2)
  stockQuantity   Int      @default(0)
  imageUrl        String?  @db.VarChar(255)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
 */

export const createVariant = async (req, res) => {

    const productVariantSchema = z.object({
        productId: z.uuid(),
        variantName: z.string().min(1),
        variantValue: z.string().min(1),
        priceAdjustment: z.number().default(0.00).optional(),
        stockQuantity: z.number().int().nonnegative().default(0).optional(),
        imageUrl: z.url().optional(),
    })

    const { success, data, error } = productVariantSchema.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            status: "error",
            message: "Invalid request data",
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

    const newVariant = await prisma.productVariant.create({
        data: {
            productId: data.productId,
            variantName: data.variantName,
            variantValue: data.variantValue,
            priceAdjustment: data.priceAdjustment,
            stockQuantity: data.stockQuantity,
            imageUrl: data.imageUrl,
        },
    });

    return res.json({
        status: "success",
        message: "Variant created successfully",
        data: { variant: newVariant },
    });

}