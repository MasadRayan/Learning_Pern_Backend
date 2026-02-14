import { Router } from "express";
import productRoutes from "./productRoute.js";
import imageRoutes from "./imageRoute.js";
import varientRoutes from "./varientRoute.js";
const router = Router();

router.use("/images", imageRoutes);
router.use("/variants", varientRoutes);
router.use("/", productRoutes);

export default router;