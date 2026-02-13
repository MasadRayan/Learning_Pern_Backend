const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/auth/sign-up", (req, res) => {
  const userCreateSchema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
  });

  const { success, data, error } = userCreateSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      error: "Invalid input data",
    })
  }

  res.json({
    user: req.body,
  });
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
