import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controller/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router  = Router();


router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, createOrder);
router.patch("/:id", authMiddleware, adminMiddleware, updateOrder);
router.delete("/:id", authMiddleware, adminMiddleware, deleteOrder);


export default router;