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
    const recetas = req.body
    const hospital = {};
    let propiedad = ''
    hospital[propiedad] = 1;
    if(Array.isArray(recetas)){
      recetas.forEach(receta => {
        propiedad = `${receta.numeroPaciente.codigoEstablecimiento}`;
        hospital[propiedad] = 1;
        receta.numeroPaciente.hospital = hospital
      });
    }else{//Sólo un objeto
      propiedad = `${recetas.numeroPaciente.codigoEstablecimiento}`;
      hospital[propiedad] = 1;
      recetas.numeroPaciente.hospital = hospital
    }    
    await Recetas.create(recetas);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(`Recetas: ${error.name} - ${error.message}`);
  }
};
