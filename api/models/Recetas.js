const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Receta = mongoose.model('receta', new Schema ({
    Fld_NroRecetaOriginal: Number,
    Fld_TipoRecetOriginal: Number,
    Fld_FechaDigit: Date,
    Fld_MedicoPrescriptor: String,
    PAC_PAC_Numero: Number,
    Fld_PatologiaCronica: String,
    Pases: [
        {
            Fld_NroReceta: Number,
            Fld_FechaEmision: Date,
            Fld_Pase: Number,
        }
    ],
}))

module.exports = Receta