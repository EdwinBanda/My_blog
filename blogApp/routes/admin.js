const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res)=>{
    res.render('admin/index')
})

router.get('/posts', (req, res)=>{
    res.send("pagina de posts")
})

router.get('/categorias', (req, res)=>{
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addCategoria')
})

router.post('/categorias/nova', (req, res)=>{
    const {nome, slug} = req.body
    const novaCategoria = {
        nome,
        slug
    }

    new Categoria(novaCategoria)
        .save()
        .then(()=>{
            console.log("Categoria salva com Sucesso!")
        })
        .catch((err)=>{
            console.log("Erro ao cadastrar categoria "+err)
        })
})

router.get('/teste', (req, res)=>{
    res.send("Apenas um teste")
})


module.exports = router