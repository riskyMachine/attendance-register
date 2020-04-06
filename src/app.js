require('../db/mongoose')
const express = require('express')
const app = express()
const userRouter = require('../routers/user')
const studentRouter = require('../routers/student')
const classRouter = require('../routers/class')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const port = process.env.PORT

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(publicDirectoryPath))

app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(userRouter)
app.use(classRouter)
app.use(studentRouter)

app.get('', (req,res) => {
    try{
        if(!req.cookies['user-token']){
            res.render('index')
        }else{
            res.redirect('/users/dashboard')
        }
    }catch(e){
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})

