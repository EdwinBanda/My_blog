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
    require('./models/postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const usuarios = require('./routes/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)

//Configuracoes
    //Sessao
        app.use(session({
            secret: "cursoNode",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())

    //Middleware
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
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
        Postagem.find().populate('categoria').sort({data: "desc"})
            .lean()
                .then((postagens)=>{
                    res.render('index', {postagens: postagens, titulo: "Home"})
                })
                .catch((err)=>{
                    req.flash("error_msg", "Erro ao listar as postagens")
                    res.redirect('/404')
                })
    })

    app.get('/404', (req, res)=>{
        res.send('Erro 404')
    })

    app.get('/postagem/:slug', (req,res)=>{
        Postagem.findOne({slug: req.params.slug})
            .lean()
                .then((postagem)=>{
                    if(postagem){
                        res.render('postagem/index', {postagem: postagem, titulo: "Conteudo da postagem"})
                    }else{
                        req.flash('error_msg', "Esta postagem nao existe")
                        res.redirect('/')
                    }
                })
                .catch((err)=>{
                    req.flash("error_msg", "houve um erro interno")
                    res.redirect('/')
                })
    })

    app.get('/categorias', (req, res)=>{
        Categoria.find()
            .lean()
                .then((categorias)=>{
                    res.render('categorias/index', {categorias: categorias})
                })
                .catch((err)=>{
                    req.flash('error_msg', "Houve um erro interno ao listar as categorias")
                    res.redirect('/')
                })
    })

    app.get('/categorias/:slug', (req, res)=>{
        Categoria.findOne({slug: req.params.slug}).lean()
            .then((categoria)=>{
                if(categoria){
                    Postagem.find({categoria: categoria._id}).lean()
                     .then((postagens)=>{
                        res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
                     })
                     .catch((err)=>{
                        req.flash('error_msg', "Houve um erro ao listar os posts")
                        res.redirect('/')
                     })
                }else{
                    req.flash('error_msg', "Esta categoria nao existe")
                }
            })
            .catch((err)=>{
                req.flash('error_msg', "Houve um erro interno ao carregar a pagina desta categoria")
                res.redirect('/')
            })
    })



    app.get('/posts', (req, res)=>{
        res.send("lista de posts")
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
    app

//Outros
const port = process.env.PORT || 8086
app.listen(port, ()=>{
    console.log("Servidor rodando no http://localhost:8086")
})