const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Receta = mongoose.model(
  "receta",
  new Schema(
    {
      correlativo: { type: Number, require: true },
      numeroReceta: { type: Number, require: true },
      tipoReceta: { type: Number, require: true },
      rutPaciente: { type: String, require: true },
      medicoPrescriptor: { type: String, require: true },
      patologia: String,
      recetaRetenida: { type: Boolean, default: false },
      fechaEmision: { type: String, require: true },
      codigoEstablecimiento: { type: String, require: true },
      nombreEstablecimiento: { type: String, require: true },
      pases: [
        {
          numeroReceta: { type: Number, require: true },
          fechaEmisionFutura: { type: String, require: true },
          numeroPase: { type: Number, require: true },
        },
      ],
      medicamentos: { type: [
        {
          nombreMedicamento: { type: String, require: true },
          medicamentoControlado: { type: Boolean, default: false },
          mensaje: { type: String, require: true },
        },
      ], require: true }
    },
    { timestamps: true },
  )
);


module.exports = Receta;
