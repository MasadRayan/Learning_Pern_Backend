import { Router } from "express";
import { getCart, addItemtoCart, removeItemFromCart, updateCartItem, clearCart } from "../controller/cartController.js";
const router = Router();

router.get("/", getCart);
router.post("/item", addItemtoCart);
router.patch("/item/:id", updateCartItem);
router.delete("/item/:id", removeItemFromCart);
router.delete("/clear", clearCart);


export default router;