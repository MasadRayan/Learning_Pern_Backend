import { Router } from "express";
import {
  getAllProducts,
  getAProduct,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../../controller/productController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";

const router = Router();

router.get("/", getAllProducts);
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.get("/:id", getAProduct);
router.patch("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
