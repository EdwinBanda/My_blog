const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send("pagina de posts")
})

router.get('/categorias', (req, res) => {
    Categoria.find().lean()
        .then((categorias) => {
            // console.log(categorias)
            res.render('admin/categorias', { categorias: categorias })
        })
        .catch((err)=>{
            req.flash("error_msg", "Erro ao Listar categorias")
            res.redirect("/admin")
        })

})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addCategoria')
})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome invalido!" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug invalido" })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome muito pequeno" })
    }

    if (erros.length > 0) {
        res.render("admin/addCategoria", { erros: erros })
    } else {
        const { nome, slug } = req.body
        const novaCategoria = {
            nome,
            slug
        }

        new Categoria(novaCategoria)
            .save()
            .then(() => {
                req.flash("success_msg", "Categoria Salva com sucesso")
                res.redirect("/admin/categorias")
            })
            .catch((err) => {
                req.flash("error_msg", "Erro ao cadastrar categoria, Tente novamente! " + err)
                res.redirect("/admin")
            })

    }

})

router.get('/teste', (req, res) => {
    res.send("Apenas um teste")
})


module.exports = router