const mongoose = require('mongoose');

const LogroSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    descripcion:{
        type: String,
        rquire: true
    },
    trabajo: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Trabajo'
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('Logro', LogroSchema);