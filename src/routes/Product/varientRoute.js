import { Router } from "express";
import { getAllVariants, getVariantById, createVariant, deleteVariant, updateVariant } from "../../controller/product/index.js";
const router = Router();

router.get("/", getAllVariants);
router.get("/:id", getVariantById);
router.post("/", createVariant);
router.delete("/:id", deleteVariant);
router.patch("/:id", updateVariant);

export default router;