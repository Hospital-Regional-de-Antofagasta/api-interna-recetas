const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Receta = mongoose.model(
  "receta",
  new Schema(
    {
      correlativo: Number,
      numeroReceta: Number,
      tipoReceta: Number,
      rutPaciente: String,
      medicoPrescriptor: String,
      patologia: String,
      recetaRetenida: Boolean,
      fechaEmision: String,
      codigoEstablecimiento: String,
      nombreEstablecimiento: String,
      pases: [
        {
          numeroReceta: Number,
          fechaEmisionFutura: String,
          numeroPase: Number,
        },
      ],
      medicamentos: [
        {
          nombreMedicamento: String,
          medicamentoControlado: Boolean,
          mensaje: String,
        },
      ],
    },
    { timestamps: true },
  )
);


module.exports = Receta;
