const mongoose = require('mongoose');

const TrabajoSchema = mongoose.Scghema({
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
    fecha_fin: {
        type: Date
    },
    creado: {
        type: Date,
        default: Date.now()
    }

});


module.exports = mongoose.model('Trabajo',TrabajoSchema)