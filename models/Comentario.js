const mongoose = require('mongoose');


const ComentarioSchema = mongoose.Schema({
    texto: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    actualizado: {
        type: Date,
        default: Date.now()
    }

});


module.exports = mongoose.model('Comentarios', ComentarioSchema);