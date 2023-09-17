//Carregando modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyparser = require('body-parser')
    const mongoose = require('mongoose')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')

//Configuracoes
    //Sessao
        app.use(session({
            secret: "cursoNode",
            resave: true,
            saveUninitialized: true
        }))

        app.use(flash())

    //Middleware
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })

    //Body-parser
        app.use(bodyparser.urlencoded({extended: true}))
        app.use(bodyparser.json())
    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: "main"}))
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://127.0.0.1/blogApp")
            .then(()=>{
                console.log("Connected!")
            })
            .catch((err)=>{
                console.log("Error connecting to mongodb "+err)
            })
    
    //Public 
        app.use(express.static(path.join(__dirname, "public")))
    
    app.use((req, res, next)=>{
        console.log("Hey, sou um middleware")
        next()
    })
//Rotas
    app.get('/', (req, res)=>{
        res.send("Rota principal")
    })

    app.get('/posts', (req, res)=>{
        res.send("lista de posts")
    })

    app.use('/admin', admin)

//Outros
const port = 8086
app.listen(port, ()=>{
    console.log("Servidor rodando no http://localhost:8086")
})