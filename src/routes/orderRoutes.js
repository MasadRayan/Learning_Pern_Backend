import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controller/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router  = Router();


router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);


export default router;