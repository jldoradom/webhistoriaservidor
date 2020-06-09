const mongoose = require('mongoose');


const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    edad:{
        type: Number,
        required: true,
        trim: true
    },
    curso:{
        type: String,
        required: true,
    },
    ies: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    logros: {
        type: Array
    },
    rol:{
        type: String,
        default: "NORMAL"
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Usuario' , UsuarioSchema);