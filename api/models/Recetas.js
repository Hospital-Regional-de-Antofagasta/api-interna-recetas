const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp_recetas";

if (env === "test") db = `${db}_test`;

const conection = mongoose.connection.useDb(db);

const Receta = conection.model(
  "receta",
  new Schema(
    {
      correlativo: { type: Number, required: true },
      numeroReceta: { type: Number, required: true },
      tipoReceta: { type: Number, required: true },
      rutPaciente: { type: String, required: true },
      medicoPrescriptor: { type: String, required: true },
      patologia: String,
      recetaRetenida: { type: Boolean, default: false },
      fechaEmision: { type: String, required: true },
      codigoEstablecimiento: { type: String, required: true },
      nombreEstablecimiento: { type: String, required: true },
      pases: [
        {
          numeroReceta: { type: Number, required: true },
          fechaEmisionFutura: { type: String, required: true },
          numeroPase: { type: Number, required: true },
        },
      ],
      medicamentos: {
        type: [
          {
            nombreMedicamento: { type: String, required: true },
            medicamentoControlado: { type: Boolean, default: false },
            mensaje: { type: String, required: true },
          },
        ],
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = Receta;
