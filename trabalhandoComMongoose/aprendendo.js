const mongoose = require('mongoose')

//Configurando o mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1/aprendendo',)
    .then(() => {
        console.log("Connected!")
    })
    .catch((error) => {
        console.log("Error in mongoose connection " + error)
    })

//Definindo model - usuarios

const userSchema = mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais: {
        type: String,
    }
})

// Collection
mongoose.model('user', userSchema) //Dando nome a collection

const user = mongoose.model('user') //Criando um construtor "user"

new user({
    nome: "Joao",
    sobrenome: "Francisco",
    email: "JoaoF@gmail.com",
    idade: 23,
    pais: "Mocambique"
})
    .save()
    .then(() => {
        console.log("Usuario criado com sucesso!")
    })
    .catch((error) => {
        console.log("Houve um erro ao registrar usuario " + error)
    })