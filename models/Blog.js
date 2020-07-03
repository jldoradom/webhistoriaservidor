const mongoose = require('mongoose');


const BlogSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    },
    puntos:{
        type: Number,
        default: 1
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    usuarios: {
        type: Array
    },
    categoria:{
        type: String,
        required: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Blog' , BlogSchema);