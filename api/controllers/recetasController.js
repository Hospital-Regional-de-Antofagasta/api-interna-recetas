const Recetas = require("../models/Recetas");

exports.create = async (req, res) => {
  const recetasInsertadas = [];
  try {
    const recetas = req.body;
    for (let receta of recetas) {
      try {
        const recetasMismoIdentificador = await Recetas.find({
          $and: [
            { correlativo: receta.correlativo },
            { codigoEstablecimiento: receta.codigoEstablecimiento },
          ],
        }).exec();
        // si existen multiples recetas con el mismo identificador, indicar el error
        if (recetasMismoIdentificador.length > 1) {
          recetasInsertadas.push({
            afectado: receta.correlativo,
            realizado: false,
            error: `Existen ${recetasMismoIdentificador.length} recetas con el correlativo ${receta.correlativo} para el establecimiento ${receta.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si ya existe la receta, indicar el error y decir que se inserto
        if (recetasMismoIdentificador.length === 1) {
          recetasInsertadas.push({
            afectado: receta.correlativo,
            realizado: true,
            error: "La receta ya existe.",
          });
          continue;
        }
        // si la receta no existe, se inserta
        await Recetas.create(receta);
        recetasInsertadas.push({
          afectado: receta.correlativo,
          realizado: true,
          error: "",
        });
      } catch (error) {
        recetasInsertadas.push({
          afectado: receta.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(201).send({
      respuesta: recetasInsertadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `Recetas create: ${error.name} - ${error.message}`,
      respuesta: recetasInsertadas,
    });
  }
};

exports.updateMany = async (req, res) => {
  const recetasActualizadas = [];
  try {
    const recetas = req.body;
    for (let receta of recetas) {
      try {
        const recetasMismoIdentificador = await Recetas.find({
          $and: [
            { correlativo: receta.correlativo },
            { codigoEstablecimiento: receta.codigoEstablecimiento },
          ],
        }).exec();
        // si la receta no existe, reportar el error
        if (recetasMismoIdentificador.length === 0) {
          recetasActualizadas.push({
            afectado: receta.correlativo,
            realizado: false,
            error: "La receta no existe.",
          });
          continue;
        }
        // si existen multiples recetas con el mismo identificador, indicar el error
        if (recetasMismoIdentificador.length > 1) {
          recetasActualizadas.push({
            afectado: receta.correlativo,
            realizado: false,
            error: `Existen ${recetasMismoIdentificador.length} recetas con el correlativo ${receta.correlativo} para el establecimiento ${receta.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si solo encontro una para actualizar, lo actualiza
        const response = await Recetas.updateOne(
          {
            correlativo: receta.correlativo,
            codigoEstablecimiento: receta.codigoEstablecimiento,
          },
          receta
        ).exec();
        recetasActualizadas.push({
          afectado: receta.correlativo,
          realizado: response.modifiedCount ? true : false,
          error: response.modifiedCount
            ? ""
            : "La receta no fue actualizada.",
        });
      } catch (error) {
        recetasActualizadas.push({
          afectado: receta.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: recetasActualizadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `Recetas delete: ${error.name} - ${error.message}`,
      respuesta: recetasActualizadas,
    });
  }
};

exports.deleteMany = async (req, res) => {
  const recetasEliminadas = [];
  try {
    const identificadoresRecetas = req.body;
    for (let identificadorReceta of identificadoresRecetas) {
      try {
        const recetasMismoIdentificador = await Recetas.find({
          $and: [
            { correlativo: identificadorReceta.correlativo },
            {
              codigoEstablecimiento:
                identificadorReceta.codigoEstablecimiento,
            },
          ],
        }).exec();
        // si la receta no existe, reportar el error e indicar que se elimino
        if (recetasMismoIdentificador.length === 0) {
          recetasEliminadas.push({
            afectado: identificadorReceta.correlativo,
            realizado: true,
            error: "La receta no existe.",
          });
          continue;
        }
        // si existen multiples recetas con el mismo identificador, indicar el error
        if (recetasMismoIdentificador.length > 1) {
          recetasEliminadas.push({
            afectado: identificadorReceta.correlativo,
            realizado: false,
            error: `Existen ${recetasMismoIdentificador.length} recetas con el correlativo ${identificadorReceta.correlativo} para el establecimiento ${identificadorReceta.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si solo encontro una receta para eliminar, la elimina
        const response = await Recetas.deleteOne(
          identificadorReceta
        ).exec();
        recetasEliminadas.push({
          afectado: identificadorReceta.correlativo,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount ? "" : "La receta no fue eliminada.",
        });
      } catch (error) {
        recetasEliminadas.push({
          afectado: identificadorReceta.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: recetasEliminadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `Recetas delete: ${error.name} - ${error.message}`,
      respuesta: recetasEliminadas,
    });
  }
};
