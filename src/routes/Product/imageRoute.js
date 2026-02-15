import { Router } from "express";
import { getAllImages, getImageById, createImage, deleteImage, updateImage } from "../../controller/product/index.js";
import  authMiddleware  from "../../middleware/authMiddleware.js";
import  adminMiddleware  from "../../middleware/adminMiddleware.js";
const router = Router();

router.get("/", getAllImages);
router.get("/:id", getImageById);
router.post("/", authMiddleware, createImage);
router.patch("/:id", authMiddleware, adminMiddleware, updateImage);
router.delete("/:id", authMiddleware, adminMiddleware, deleteImage);

export default router;