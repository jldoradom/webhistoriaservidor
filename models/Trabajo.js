const mongoose = require('mongoose');

const TrabajoSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String,
        required: true
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    logros: {
        type: Array
    },
    fechafin: {
        type: String
    },
    creado: {
        type: Date,
        default: Date.now()
    }

});


module.exports = mongoose.model('Trabajo',TrabajoSchema)