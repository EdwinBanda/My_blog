const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoriaSchema = new Schema({
    nome:{
        type: String,
        require: true
    },
    slug:{
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('categorias', categoriaSchema)