const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get('/registro', (req, res)=>{
    res.render('usuarios/registro')
})

router.post('/registro', (req, res)=>{
    const {nome, email, senha, senha2} = req.body
    var erros = []

    if(!nome || typeof nome === undefined || nome === null){
        erros.push({texto: "nome Invalido"})
    }
    if(!email || typeof email === undefined || email === null){
        erros.push({texto: "Email Invalido"})
    }
    if(!senha || typeof senha === undefined || senha === null){
        erros.push({texto: "Senha Invalida"})
    }

    if(senha.length < 4){
        erros.push({texto:"Senha demasiado curta"})
    }
    if(senha != senha2){
        erros.push({texto: "As senhas sao diferentes, tente novamente"})
    }

    if(erros.length > 0){
        res.render('usuarios/registro', {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email})
            .then((usuario)=>{
                if(usuario){
                    req.flash('error_msg', "Email ja existente!")
                    res.redirect('/usuarios/registro')
                }else{
                    const novoUsuario = new Usuario({
                        nome,
                        email,
                        senha,
                        isAdmin: 0
                    })
                    bcrypt.genSalt(10, (erro, salt)=>{
                        bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                            if(erro){
                                req.flash('error_msg', "Houve um erro durante o salvamento do usuario")
                                res.redirect('/')
                            }
                            novoUsuario.senha = hash

                            novoUsuario.save()
                                .then(()=>{
                                    req.flash('success_msg', "Usuario Criado com sucesso")
                                    res.redirect('/')
                                })
                                .catch((err)=>{
                                    req.flash('error_msg', "Erro ao criar usuario")
                                    res.redirect('/usuarios/registro')
                                })

                        })
                    })
                }
            })
            .catch((err)=>{
                req.flash('error_msg', "Houve um erro interno")
                res.redirect('/')
            })
    }
})

router.get('/login', (req, res)=>{
    res.render('usuarios/login')
})

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res)=>{
    req.logOut(()=>{
<<<<<<< HEAD
        req.flash('success_msg', "Deslogado com sucesso")
=======
        req.flash('success_msg', "Deslogado com sucesso!")
        res.redirect('/')
    })
    .catch((err)=>{
        req.flash('error_msg', "Erro ao deslogar a sessao")
>>>>>>> 55a6fe3fda1393a429a907de95460660c99c58dd
        res.redirect('/')
    })
})


module.exports = router