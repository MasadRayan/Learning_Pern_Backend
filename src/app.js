import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes)

app.use("/users", userRoutes)

app.use("/products", productRoutes)

app.use("/category", categoryRoutes)

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
