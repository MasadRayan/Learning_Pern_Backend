import { Router } from "express";
import { getAllVariants } from "../../controller/product/index.js";
const router = Router();

router.get("/", getAllVariants);

export default router;