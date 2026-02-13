import { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controller/userController.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;