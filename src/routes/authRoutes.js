import { Router } from "express";
import { UserSignIn, UserSignUp, GetCurrentUser } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router  = Router();

router.post("/sign-up", UserSignUp);
router.post("/sign-in", UserSignIn);
router.get("/me", authMiddleware, GetCurrentUser);

export default router;