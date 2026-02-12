const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.get('/categories', (req, res) => {
  res.send('Category read')
})

app.post('/categories', (req, res) => {
  res.send('Category created')
})

app.put('/categories', (req, res) => {
  res.send('Category updated')
})

app.delete('/categories', (req, res) => {
  res.send('Category deleted')  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
