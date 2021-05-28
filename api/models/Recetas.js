const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Receta = mongoose.model('receta', new Schema ({
    numeroRecetaOriginal: Number,
    tipoRecetaOriginal: Number,
    medicoPrescriptor: String,
    numeroPaciente: Number,
    patologiaCronica: String,
    recetaRetenida: Boolean,
    pases: [
        {
            numeroReceta: Number,
            fechaEmision: Date,
            numeroPase: Number,
        }
    ],
}, { timestamps: true }))

module.exports = Receta