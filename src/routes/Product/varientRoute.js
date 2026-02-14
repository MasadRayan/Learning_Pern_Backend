import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from product image route!");
});

export default router;