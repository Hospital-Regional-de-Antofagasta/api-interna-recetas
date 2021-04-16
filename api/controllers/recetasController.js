const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/RecetasDetalles')

exports.getLast = async (req, res) => {
    try {
        const tipoReceta = req.params.tipoReceta
        const receta = await Recetas.findOne({ Fld_TipoRecetOriginal: tipoReceta })
            .sort({ Fld_FechaDigit: -1 })
            .exec()
        res.status(200).send(receta)
    } catch (error) {
        res.status(500).send(`Recetas: ${error.name} - ${error.message}`)
    }
}

exports.create = async (req, res) => {
    const { recetas, recetasDetalles } = req.body
    try {
        await Promise.all([
            Recetas.create(recetas),
            RecetasDetalles.create(recetasDetalles),
        ])
        res.sendStatus(201)
    } catch (error) {
        // eliminar todas las recetas que se ingresaron para mantener la
        // consistencia de los datos
        await Promise.all([
            recetas.map(async (receta) => {
                Recetas.deleteOne({
                    Fld_NroRecetaOriginal: receta.Fld_NroRecetaOriginal,
                    Fld_TipoRecetOriginal: receta.Fld_TipoRecetOriginal,
                }).exec()
            }),
            recetasDetalles.map(async (recetaDetalle) => {
                RecetasDetalles.deleteOne({
                    Fld_NroRecetaOriginal: recetaDetalle.Fld_NroRecetaOriginal,
                    Fld_TipoRecetOriginal: recetaDetalle.Fld_TipoRecetOriginal,
                }).exec()
            }),
        ])
        res.status(500).send(`Recetas: ${error.name} - ${error.message}`)
    }
}