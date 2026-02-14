import { Router } from "express";
import { getAllImages, getImageById, createImage, deleteImage, updateImage } from "../../controller/product/index.js";
const router = Router();

router.get("/", getAllImages);
router.get("/:id", getImageById);
router.post("/", createImage);
router.patch("/:id", updateImage);
router.delete("/:id", deleteImage);

export default router;