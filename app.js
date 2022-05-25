const express = require('express')
const connect = require('./schemas/index')
const app = express()
const port = 3000

connect()

const listsRouter = require('./routes/lists')

const requestMiddleware = (req,res,next)=>{
    console.log('Request URL:', req.originalUrl,'-',new Date())
    next()
}

app.use(express.json())
app.use(requestMiddleware)

app.use('/api', [listsRouter])

app.get('/', (req,res) => {
    res.send("welcome to changmin's blog")
})

app.listen(port, () => {
    console.log(port, '포트가 켜졌어요')
})