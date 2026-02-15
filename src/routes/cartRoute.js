import { Router } from "express";
import { getCart, addItemtoCart, removeItemFromCart, updateCartItem, clearCart } from "../controller/cartController";
const router = Router();

router.get("/", getCart);
router.post("/item", addItemtoCart);
router.put("/item/:id", updateCartItem);
router.delete("/item/:id", removeItemFromCart);
router.delete("/clear", clearCart);


export default router;