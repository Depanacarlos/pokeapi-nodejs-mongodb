const express = require('express')
const app = express()
var cors = require('cors')
const router = require('./network/routes')
const db = require('./db')
app.use(cors())

router(app)

app.listen(3000, ()=>{
    db.connectionDb()
    console.log("ok")
})