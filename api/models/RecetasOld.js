const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp";

if (env === "test") db = `${db}_test`;

const conection = mongoose.connection.useDb(db);

const Receta = conection.model(
  "receta",
  new Schema(
    {
      numeroRecetaOriginal: Number,
      tipoRecetaOriginal: Number,
      medicoPrescriptor: String,
      numeroPaciente: { type: Number, require: true },
      patologiaCronica: String,
      recetaRetenida: Boolean,
      pases: [
        {
          numeroReceta: Number,
          fechaEmision: Date,
          numeroPase: Number,
        },
      ],
      medicamentos: [
        {
          nombreMaterial: String,
          medicamentoControlado: Boolean,
          mensaje: String,
        },
      ],
    },
    { timestamps: true }
  ) //.index({'numeroPaciente.numero':1,'numeroPaciente.codigoEstablecimiento':1},{unique: true})
);

module.exports = Receta;
