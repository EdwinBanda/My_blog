const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require("../models/postagem")
const Postagem = mongoose.model("postagens")

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

router.get('/postagens', (req, res) => {
    Postagem.find().populate("categoria").sort({data:"desc"}).lean()
        .then((postagem)=>{
            res.render("admin/postagens", {postagem: postagem})
        })
        .catch((err)=>{
            req.flash('error_msg', "Houve um erro ao listar as postagens")
            res.redirect('/admin/postagens')
        })
})

router.get('/postagens/add', (req, res)=>{
    Categoria.find().lean()
        .then((categorias)=>{
            res.render('admin/addPostagem' , {categorias: categorias})
        })
        .catch((err)=>{
            req.flash('error_msg', "Houve um erro ao carregar o formulario")
            res.redirect('/admin/addPostagem')
        })
})

router.post('/postagens/nova', (req, res)=>{
    const {titulo, slug, descricao, conteudo, categoria} = req.body
    const erros = []

    if(categoria === "0"){
        erros.push({texto: "Categoria invalida, registre uma categoria"})
    }

    if(erros.length > 0){
        res.render('admin/addPostagem', {erros: erros})
    }else{
        const novaPostagem = {
            titulo,
            slug,
            descricao,
            conteudo,
            categoria
        }
        new Postagem(novaPostagem)
            .save()
            .then(()=>{
                req.flash('success_msg', "Psotagem Criada com sucesso")
                res.redirect('/admin/postagens')
            })
            .catch((err)=>{
                req.flash('error_msg', "Houve um erro durante o salvamento da postagem")
                res.redirect('/admin/postagens')
            })
            
    }
    
})

router.get('/postagens/edit/:id', (req, res)=>{
    Postagem.findOne({_id: req.params.id}).lean()
        .then((postagem)=>{
            Categoria.find().lean()
                .then((categorias)=>{
                    res.render('admin/editPostagens', {postagem: postagem, categorias: categorias})
                })
                .catch((err)=>{
                    req.flash('error_msg', "Houve um erro ao lisar as categorias")
                    res.redirect('/admin/postagens')
                })
        })
        .catch((err)=>{
            req.flash('error_msg', "Houveum erro ao carregar formulario de edicao")
            res.redirect('/admin/postagens')
        })

})

router.post('/postagem/edit', (req, res)=>{
    const {titulo, slug, descricao, conteudo, categoria} = req.body
    Postagem.findOne({_id: req.body.id})
        .then((postagem)=>{
            postagem.titulo = titulo,
            postagem.slug = slug,
            postagem.descricao = descricao,
            postagem.conteudo = conteudo,
            postagem.categoria = categoria

            postagem.save()
                .then(()=>{
                    req.flash('success_msg', "Postagem editada com sucesso")
                    res.redirect('/admin/postagens')
                })
                .catch((err)=>{
                    req.flash('error_msg', "Erro ao interno ao editar postagem")
                    res.redirect('/admin/postagens')
                })
        })
        .catch((err)=>{
            req.flash('error_msg', "Erro ao editar postagem "+err)
            res.redirect('/admin/postagens')
        })
})



module.exports = router