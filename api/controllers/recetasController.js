const Recetas = require("../models/Recetas");

exports.getLast = async (req, res) => {
  try {
    const tipoReceta = req.params.tipoReceta;
    const receta = await Recetas.findOne({
      tipoRecetaOriginal: tipoReceta,
      "numeroPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento,
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
    await Recetas.create(recetas);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(`Recetas: ${error.name} - ${error.message}`);
  }
};
