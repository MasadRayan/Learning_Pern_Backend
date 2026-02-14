import { Router } from "express";
import { getAllImages } from "../../controller/product/index.js";
const router = Router();

router.get("/", getAllImages);


export default router;