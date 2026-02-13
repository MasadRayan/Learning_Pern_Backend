const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())


app.post("/auth/sign-up",  (req, res) => {
  if (req.body.firstName.length <= 2) {
    return res.status(400).json({
      error: "First name must be at least 3 characters long"
    })
  }
  res.json({
    user: req.body
  })
})


app.get("/", async (req, res) => {
  res.send("Hello World!");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
