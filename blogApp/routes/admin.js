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
        .catch((err) => {
            req.flash("error_msg", "Erro ao Listar categorias " + err)
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
        erros.push({ texto: "Nome demasiado curto" })
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

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean()
        .then((categoria) => {
            res.render("admin/editCategorias", { categoria: categoria })
        })
        .catch((err) => {
            req.flash("error_msg", "Categoria nao encontrada")
            res.redirect("/admin/categorias")
        })
})

router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({ _id: req.body.id })
        .then((categoria) => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            categoria.save()
                .then(() => {
                    req.flash("success_msg", "Categoria editada com sucesso!")
                    res.redirect("/admin/categorias")
                })
                .catch((err) => {
                    req.flash("error_msg", "Houve um erro interno ao salvar a edicao da categoria")
                    res.redirect("/admin/categorias")
                })
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao editar a categoria")
            res.redirect("/admin/categorias")
        })
})

router.post('/categorias/delete', (req, res)=>{
    Categoria.deleteOne({_id: req.body.id})
        .then(()=>{
            req.flash("success_msg", "Categoria removida com sucesso!")
            res.redirect("/admin/categorias")
        })
        .catch((err)=>{
            req.flash("error_msg", "Erro ao remover categoria")
            res.redirect("/admin/categorias")
        })
})

router.get('/teste', (req, res) => {
    res.send("Apenas um teste")
})


module.exports = router