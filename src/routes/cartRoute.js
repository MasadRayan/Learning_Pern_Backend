import { Router } from "express";
import { getCart, addItemtoCart, removeItemFromCart, updateCartItem, clearCart } from "../controller/cartController.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
const router = Router();

router.get("/", authMiddleware, getCart);
router.post("/item", authMiddleware, addItemtoCart);
router.patch("/item/:id", authMiddleware, updateCartItem);
router.delete("/item/:id", authMiddleware, removeItemFromCart);
router.delete("/clear", authMiddleware, clearCart);


export default router;