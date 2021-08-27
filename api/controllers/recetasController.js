const Recetas = require("../models/Recetas");

exports.getLast = async (req, res) => {
  try {
    const tipoReceta = req.params.tipoReceta;
    const receta = await Recetas.findOne({
      tipoRecetaOriginal: tipoReceta,
    })
      .sort({ numeroRecetaOriginal: -1 })
      .exec();
    res.status(200).send(receta);
  } catch (error) {
    res.status(500).send(`Recetas: ${error.name} - ${error.message}`);
  }
};

exports.create = async (req, res) => {
  try {
    const recetas = req.body;
    if (Array.isArray(recetas)) {
      recetas.forEach((receta) => {
        receta.medicamentos.forEach((medicamento) => {
          let mensaje = medicamento.dosis + " ";
          switch (medicamento.cantidadDias) {
            case 0.99:
              mensaje += "semanal por " + medicamento.dias + " semana(s)";
              break;
            case 1.01:
              mensaje += "mensual por " + medicamento.dias + " mes(es)";
              break;
            default:
              const horas = 24 / medicamento.cantidadDias;
              mensaje +=
                "cada " + horas + " Hrs. por " + medicamento.dias + " día(s)";
              break;
          }
          medicamento.mensaje = mensaje;
        });
      });
    } else {
      recetas.medicamentos.forEach((medicamento) => {
        let mensaje = medicamento.dosis + " ";
          switch (medicamento.cantidadDias) {
            case 0.99:
              mensaje += "semanal por " + medicamento.dias + " semana(s)";
              break;
            case 1.01:
              mensaje += "mensual por " + medicamento.dias + " mes(es)";
              break;
            default:
              const horas = 24 / medicamento.cantidadDias;
              mensaje +=
                "cada " + horas + " Hrs. por " + medicamento.dias + " día(s)";
              break;
          }
        medicamento.mensaje = mensaje;
      });
    }
    await Recetas.create(recetas);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(`Recetas: ${error.name} - ${error.message}`);
  }
};
