import { Router } from "express";
import { getAllVariants, getVariantById, createVariant, deleteVariant, updateVariant } from "../../controller/product/index.js";
import  authMiddleware  from "../../middleware/authMiddleware.js";
import  adminMiddleware  from "../../middleware/adminMiddleware.js";
const router = Router();

router.get("/", getAllVariants);
router.get("/:id", getVariantById);
router.post("/", authMiddleware, createVariant);
router.delete("/:id", authMiddleware, adminMiddleware, deleteVariant);
router.patch("/:id", authMiddleware, adminMiddleware, updateVariant);

export default router;