const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Receta_detalles = mongoose.model('recetas_detalle', new Schema ({
    numeroRecetaOriginal: Number,
    tipoRecetaOriginal: Number,
    medicamentos: [
        {
            nombreMaterial: String,
            dosis: Number,
            dias: Number,
            cantidadDias: Number,
            medicamentoControlado: Boolean
        }
    ],
}, { timestamps: true }))

module.exports = Receta_detalles