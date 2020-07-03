const mongoose = require('mongoose');

const FileSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    encoding: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('File', FileSchema);