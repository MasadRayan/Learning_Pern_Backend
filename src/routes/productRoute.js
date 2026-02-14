import { Router } from "express";
import { getAllProducts, getAProduct, updateProduct, deleteProduct, createProduct } from "../controller/productController.js";

const router =Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getAProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;