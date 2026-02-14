import { Router } from "express";
import { createCategory, deleteCategory, getACategory, getAllCategories, updateCategory } from "../controller/categoryController.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.get("/:id", getACategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;