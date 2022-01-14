const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const Recetas = require("../api/models/Recetas");
const recetasSeed = require("../tests/testSeeds/recetasSeed.json");
const recetasAInsertarSeed = require("../tests/testSeeds/recetasAInsertarSeed.json");
const recetasAActualizarSeed = require("../tests/testSeeds/recetasAActualizarSeed.json");
const recetasAEliminarSeed = require("../tests/testSeeds/recetasAEliminarSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

const recetaGuardar = {
  correlativo: 9,
  numeroReceta: 1,
  tipoReceta: 5,
  rutPaciente: "11111111-1",
  medicoPrescriptor: "Nombre medico",
  patologia: "Patologia",
  recetaRetenida: false,
  fechaEmision: "2022-01-01",
  codigoEstablecimiento: "HRA",
  nombreEstablecimiento: "Hospital Regional Antofagasta Dr. Leonardo Guzmán",
  pases: [
    {
      numeroReceta: 11,
      fechaEmisionFutura: "2022-01-02",
      numeroPase: 1,
    },
    {
      numeroReceta: 12,
      fechaEmisionFutura: "2022-01-03",
      numeroPase: 2,
    },
    {
      numeroReceta: 13,
      fechaEmisionFutura: "2022-01-04",
      numeroPase: 3,
    },
    {
      numeroReceta: 14,
      fechaEmisionFutura: "2022-01-05",
      numeroPase: 4,
    },
    {
      numeroReceta: 15,
      fechaEmisionFutura: "2022-01-06",
      numeroPase: 5,
    },
  ],
  medicamentos: [
    {
      nombreMedicamento: "Nombre material",
      medicamentoControlado: false,
      mensaje: "1 cada 24 HRS. por 30 día(s)",
    },
    {
      nombreMedicamento: "Nombre material 2",
      medicamentoControlado: true,
      mensaje: "1 cada 12 HRS. por 30 día(s)",
    },
  ],
};

const recetaActualizar = {
  correlativo: 2,
  numeroReceta: 2,
  tipoReceta: 5,
  rutPaciente: "11111111-1",
  medicoPrescriptor: "Nombre medico 2",
  patologia: "Patologia 2",
  recetaRetenida: false,
  fechaEmision: "2021-01-01",
  codigoEstablecimiento: "HRA",
  nombreEstablecimiento: "Hospital Regional Antofagasta Dr. Leonardo Guzmán",
  pases: [
    {
      numeroReceta: 11,
      fechaEmisionFutura: "2021-01-02",
      numeroPase: 1,
    },
    {
      numeroReceta: 12,
      fechaEmisionFutura: "2021-01-03",
      numeroPase: 2,
    },
    {
      numeroReceta: 13,
      fechaEmisionFutura: "2021-01-04",
      numeroPase: 3,
    },
    {
      numeroReceta: 14,
      fechaEmisionFutura: "2021-01-05",
      numeroPase: 4,
    },
    {
      numeroReceta: 15,
      fechaEmisionFutura: "2021-01-06",
      numeroPase: 5,
    },
  ],
  medicamentos: [
    {
      nombreMedicamento: "Nombre material 2",
      medicamentoControlado: false,
      mensaje: "2 cada 24 HRS. por 30 día(s)",
    },
    {
      nombreMedicamento: "Nombre material 3",
      medicamentoControlado: true,
      mensaje: "4 cada 12 HRS. por 30 día(s)",
    },
  ],
};

beforeEach(async () => {
  // await mongoose.disconnect();
  // await mongoose.connect(`${process.env.MONGO_URI}/recetas_salida_test`, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  await Recetas.create(recetasSeed);
});

afterEach(async () => {
  await Recetas.deleteMany();
  // await mongoose.disconnect();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Endpoints recetas salida", () => {
  describe("POST /inter-mongo-recetas/salida", () => {
    it("Should not save receta without token", async () => {
      const response = await request
        .post("/inter-mongo-recetas/salida")
        .send(recetaGuardar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: recetaGuardar.correlativo },
          { codigoEstablecimiento: recetaGuardar.codigoEstablecimiento },
        ],
      });

      expect(recetaDespues).toBeFalsy();
    });
    it("Should not save receta with invalid token", async () => {
      const response = await request
        .post("/inter-mongo-recetas/salida")
        .set("Authorization", "no-token")
        .send(recetaGuardar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: recetaGuardar.correlativo },
          { codigoEstablecimiento: recetaGuardar.codigoEstablecimiento },
        ],
      });

      expect(recetaDespues).toBeFalsy();
    });
    it("Should save receta", async () => {
      const response = await request
        .post("/inter-mongo-recetas/salida")
        .set("Authorization", token)
        .send([recetaGuardar]);

      expect(response.status).toBe(201);

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: recetaGuardar.correlativo },
          { codigoEstablecimiento: recetaGuardar.codigoEstablecimiento },
        ],
      }).exec();

      expect(recetaDespues).toBeTruthy();
      expect(recetaDespues.correlativo).toBe(recetaGuardar.correlativo);
      expect(recetaDespues.numeroReceta).toBe(recetaGuardar.numeroReceta);
      expect(recetaDespues.tipoReceta).toBe(recetaGuardar.tipoReceta);
      expect(recetaDespues.rutPaciente).toBe(recetaGuardar.rutPaciente);
      expect(recetaDespues.medicoPrescriptor).toBe(
        recetaGuardar.medicoPrescriptor
      );
      expect(recetaDespues.patologia).toBe(recetaGuardar.patologia);
      expect(recetaDespues.recetaRetenida).toBe(recetaGuardar.recetaRetenida);
      expect(Date.parse(recetaDespues.fechaEmision)).toBe(
        Date.parse(recetaGuardar.fechaEmision)
      );
      expect(recetaDespues.codigoEstablecimiento).toBe(
        recetaGuardar.codigoEstablecimiento
      );
      expect(recetaDespues.nombreEstablecimiento).toBe(
        recetaGuardar.nombreEstablecimiento
      );
      expect(recetaDespues.pases[0].numeroReceta).toBe(recetaGuardar.pases[0].numeroReceta)
      expect(Date.parse(recetaDespues.pases[0].fechaEmisionFutura)).toBe(Date.parse(recetaGuardar.pases[0].fechaEmisionFutura))
      expect(recetaDespues.pases[0].numeroPase).toBe(recetaGuardar.pases[0].numeroPase)
      expect(recetaDespues.pases[1].numeroReceta).toBe(recetaGuardar.pases[1].numeroReceta)
      expect(Date.parse(recetaDespues.pases[1].fechaEmisionFutura)).toBe(Date.parse(recetaGuardar.pases[1].fechaEmisionFutura))
      expect(recetaDespues.pases[1].numeroPase).toBe(recetaGuardar.pases[1].numeroPase)
      expect(recetaDespues.pases[2].numeroReceta).toBe(recetaGuardar.pases[2].numeroReceta)
      expect(Date.parse(recetaDespues.pases[2].fechaEmisionFutura)).toBe(Date.parse(recetaGuardar.pases[2].fechaEmisionFutura))
      expect(recetaDespues.pases[2].numeroPase).toBe(recetaGuardar.pases[2].numeroPase)
      expect(recetaDespues.pases[3].numeroReceta).toBe(recetaGuardar.pases[3].numeroReceta)
      expect(Date.parse(recetaDespues.pases[3].fechaEmisionFutura)).toBe(Date.parse(recetaGuardar.pases[3].fechaEmisionFutura))
      expect(recetaDespues.pases[3].numeroPase).toBe(recetaGuardar.pases[3].numeroPase)
      expect(recetaDespues.pases[4].numeroReceta).toBe(recetaGuardar.pases[4].numeroReceta)
      expect(Date.parse(recetaDespues.pases[4].fechaEmisionFutura)).toBe(Date.parse(recetaGuardar.pases[4].fechaEmisionFutura))
      expect(recetaDespues.pases[4].numeroPase).toBe(recetaGuardar.pases[4].numeroPase)
      const medicamentos = []
      for (let medicamento of recetaDespues.medicamentos) {
        medicamentos.push({
          medicamentoControlado: medicamento.medicamentoControlado,
          mensaje: medicamento.mensaje,
          nombreMedicamento: medicamento.nombreMedicamento,
        });
      }
      expect(medicamentos).toEqual(recetaGuardar.medicamentos);
    });
    it("Should save multiple recetas and return errors", async () => {
      const response = await request
        .post("/inter-mongo-recetas/salida")
        .set("Authorization", token)
        .send(recetasAInsertarSeed);

      expect(response.status).toBe(201);

      const recetasBD = await Recetas.find().exec();

      expect(recetasBD.length).toBe(8);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(7);
      expect(respuesta).toEqual([
        {
          afectado: 1,
          realizado: true,
          error: "La receta ya existe.",
        },
        {
          afectado: 13,
          realizado: true,
          error: "",
        },
        {
          afectado: 2,
          realizado: true,
          error: "La receta ya existe.",
        },
        {
          afectado: 14,
          realizado: true,
          error: "",
        },
        {
          afectado: 16,
          realizado: false,
          error:
            "MongoServerError - E11000 duplicate key error collection: hrapp_recetas_test.recetas index: _id_ dup key: { _id: ObjectId('303030303030303030303031') }",
        },
        {
          afectado: 15,
          realizado: true,
          error: "",
        },
        {
          afectado: 4,
          realizado: true,
          error: "La receta ya existe.",
        },
      ]);
    });
  });
  describe("PUT /inter-mongo-recetas/salida", () => {
    it("Should not update receta without token", async () => {
      const recetaAntes = await Recetas.findOne({
        $and: [
          { correlativo: recetaActualizar.correlativo },
          { codigoEstablecimiento: recetaActualizar.codigoEstablecimiento },
        ],
      }).exec();

      const response = await request
        .put("/inter-mongo-recetas/salida")
        .send(recetaActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: recetaActualizar.correlativo },
          { codigoEstablecimiento: recetaActualizar.codigoEstablecimiento },
        ],
      }).exec();

      expect(recetaAntes).toEqual(recetaDespues);
    });
    it("Should not update receta with invalid token", async () => {
      const recetaAntes = await Recetas.findOne({
        $and: [
          { correlativo: recetaActualizar.correlativo },
          { codigoEstablecimiento: recetaActualizar.codigoEstablecimiento },
        ],
      }).exec();

      const response = await request
        .put("/inter-mongo-recetas/salida")
        .set("Authorization", "no-token")
        .send(recetaActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: recetaActualizar.correlativo },
          { codigoEstablecimiento: recetaActualizar.codigoEstablecimiento },
        ],
      }).exec();

      expect(recetaAntes).toEqual(recetaDespues);
    });
    it("Should update receta", async () => {
      const response = await request
        .put("/inter-mongo-recetas/salida")
        .set("Authorization", token)
        .send([recetaActualizar]);

      expect(response.status).toBe(200);

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: recetaActualizar.correlativo },
          { codigoEstablecimiento: recetaActualizar.codigoEstablecimiento },
        ],
      }).exec();

      expect(recetaDespues.correlativo).toBe(recetaActualizar.correlativo);
      expect(recetaDespues.numeroReceta).toBe(recetaActualizar.numeroReceta);
      expect(recetaDespues.tipoReceta).toBe(recetaActualizar.tipoReceta);
      expect(recetaDespues.rutPaciente).toBe(recetaActualizar.rutPaciente);
      expect(recetaDespues.medicoPrescriptor).toBe(
        recetaActualizar.medicoPrescriptor
      );
      expect(recetaDespues.patologia).toBe(recetaActualizar.patologia);
      expect(recetaDespues.recetaRetenida).toBe(
        recetaActualizar.recetaRetenida
      );
      expect(Date.parse(recetaDespues.fechaEmision)).toBe(
        Date.parse(recetaActualizar.fechaEmision)
      );
      expect(recetaDespues.codigoEstablecimiento).toBe(
        recetaActualizar.codigoEstablecimiento
      );
      expect(recetaDespues.nombreEstablecimiento).toBe(
        recetaActualizar.nombreEstablecimiento
      );
      expect(recetaDespues.pases[0].numeroReceta).toBe(recetaActualizar.pases[0].numeroReceta)
      expect(Date.parse(recetaDespues.pases[0].fechaEmisionFutura)).toBe(Date.parse(recetaActualizar.pases[0].fechaEmisionFutura))
      expect(recetaDespues.pases[0].numeroPase).toBe(recetaActualizar.pases[0].numeroPase)
      expect(recetaDespues.pases[1].numeroReceta).toBe(recetaActualizar.pases[1].numeroReceta)
      expect(Date.parse(recetaDespues.pases[1].fechaEmisionFutura)).toBe(Date.parse(recetaActualizar.pases[1].fechaEmisionFutura))
      expect(recetaDespues.pases[1].numeroPase).toBe(recetaActualizar.pases[1].numeroPase)
      expect(recetaDespues.pases[2].numeroReceta).toBe(recetaActualizar.pases[2].numeroReceta)
      expect(Date.parse(recetaDespues.pases[2].fechaEmisionFutura)).toBe(Date.parse(recetaActualizar.pases[2].fechaEmisionFutura))
      expect(recetaDespues.pases[2].numeroPase).toBe(recetaActualizar.pases[2].numeroPase)
      expect(recetaDespues.pases[3].numeroReceta).toBe(recetaActualizar.pases[3].numeroReceta)
      expect(Date.parse(recetaDespues.pases[3].fechaEmisionFutura)).toBe(Date.parse(recetaActualizar.pases[3].fechaEmisionFutura))
      expect(recetaDespues.pases[3].numeroPase).toBe(recetaActualizar.pases[3].numeroPase)
      expect(recetaDespues.pases[4].numeroReceta).toBe(recetaActualizar.pases[4].numeroReceta)
      expect(Date.parse(recetaDespues.pases[4].fechaEmisionFutura)).toBe(Date.parse(recetaActualizar.pases[4].fechaEmisionFutura))
      expect(recetaDespues.pases[4].numeroPase).toBe(recetaActualizar.pases[4].numeroPase)
      const medicamentos = []
      for (let medicamento of recetaDespues.medicamentos) {
        medicamentos.push({
          medicamentoControlado: medicamento.medicamentoControlado,
          mensaje: medicamento.mensaje,
          nombreMedicamento: medicamento.nombreMedicamento,
        });
      }
      expect(medicamentos).toEqual(recetaActualizar.medicamentos);
    });
    it("Should update multiple recetas and return errors", async () => {
      const response = await request
        .put("/inter-mongo-recetas/salida")
        .set("Authorization", token)
        .send(recetasAActualizarSeed);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);

      expect(respuesta).toEqual([
        {
          afectado: 10,
          realizado: false,
          error: "La receta no existe.",
        },
        {
          afectado: 2,
          realizado: true,
          error: "",
        },
        {
          afectado: 3,
          realizado: false,
          error:
            "MongoServerError - Performing an update on the path '_id' would modify the immutable field '_id'",
        },
        {
          afectado: 3,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("DELETE /inter-mongo-recetas/salida", () => {
    it("Should not delete receta without token", async () => {
      const recetaAntes = await Recetas.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      const response = await request
        .delete("/inter-mongo-recetas/salida")
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      expect(recetaAntes).toEqual(recetaDespues);
    });
    it("Should not delete receta with invalid token", async () => {
      const recetaAntes = await Recetas.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      const response = await request
        .delete("/inter-mongo-recetas/salida")
        .set("Authorization", "no-token")
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      expect(recetaAntes).toEqual(recetaDespues);
    });
    it("Should delete receta", async () => {
      const response = await request
        .delete("/inter-mongo-recetas/salida")
        .set("Authorization", token)
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      const recetaDespues = await Recetas.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      expect(response.status).toBe(200);
      expect(recetaDespues).toBeFalsy();
    });
    it("Should delete multiple recetas and return errors", async () => {
      const response = await request
        .delete("/inter-mongo-recetas/salida")
        .set("Authorization", token)
        .send(recetasAEliminarSeed);

      expect(response.status).toBe(200);

      const recetasBD = await Recetas.find().exec();

      expect(recetasBD.length).toBe(3);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: 14,
          realizado: true,
          error: "La receta no existe.",
        },
        {
          afectado: 1,
          realizado: true,
          error: "",
        },
        {
          afectado: 15,
          realizado: true,
          error: "La receta no existe.",
        },
        {
          afectado: 3,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
});
