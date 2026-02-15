import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/Product/index.js";
import categoryRoutes from "./routes/categoryRoute.js";
import cartRoute from "./routes/cartRoute.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/products", productRoutes);

app.use("/category", categoryRoutes);

app.use("/cart", cartRoute);

// handle not found routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "Not Found",
    message: "Route not found",
  })
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "Error",
    message: "Internal Server Error",
  });
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
