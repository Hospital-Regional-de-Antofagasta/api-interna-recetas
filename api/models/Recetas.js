const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Receta = mongoose.model(
  "receta",
  new Schema(
    {
      numeroRecetaOriginal: Number,
      tipoRecetaOriginal: Number,
      medicoPrescriptor: String,
      numeroPaciente: {type: Number, require: true},
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
          dosis: Number,
          dias: Number,
          cantidadDias: Number,
          medicamentoControlado: Boolean,
          mensaje: String,
        },
      ],
    },
    { timestamps: true },
  )//.index({'numeroPaciente.numero':1,'numeroPaciente.codigoEstablecimiento':1},{unique: true})
);


module.exports = Receta;
