const express = require('express')
const app = express()
const port = 8081
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const post = require('./models/Post')



// Config
    // Template engine
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')

    // Bodyparser
    app.use(bodyparser.urlencoded({extended: false}))
    app.use(bodyparser.json())

// Rotas
    app.get('/', (req,res)=>{
        post.findAll({order: [['id','DESC']]})
            .then((posts)=>{
                // console.log(posts)
                res.render('home', {posts: posts})
            })
    })

    app.get('/cad', (req, res)=>{
        res.render('formulario')
    })

    app.post('/add', (req, res)=>{
        post.create({
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        }).then(()=>{
            res.redirect('/')
        })
        .catch((erro)=>{
            res.send('Houve um erro! '+erro)
        })
    })

    app.get('/deletar/:id', (req,res)=>{
        post.destroy({where: {'id': req.params.id}})
            .then(()=>{
                res.redirect('/')
            })
            .catch((erro)=>{
                res.send('Esta postagem nao existe! '+erro)
            })
    })


app.listen(port, ()=>{
    console.log("Servidor rodando na url http://localhost:8081")
})