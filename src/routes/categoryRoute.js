import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getACategory,
  getAllCategories,
  updateCategory,
} from "../controller/categoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", authMiddleware, adminMiddleware, createCategory);
router.get("/:id",  getACategory);
router.patch("/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;
