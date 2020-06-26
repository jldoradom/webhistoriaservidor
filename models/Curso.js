const mongoose = require('mongoose');

const CursoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    instituto: {
        type: String,
        required: true
    },
    cantidadAlumnos: {
        type: Number,
        default: 0
    },
    localidad: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        default: "ACTUAL"
    },
    curso: {
        type: String,
        required: true
    },
    usuarios: {
        type: Array
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Curso', CursoSchema);