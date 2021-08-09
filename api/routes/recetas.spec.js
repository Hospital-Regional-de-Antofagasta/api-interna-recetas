const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Recetas = require("../models/Recetas");
const recetasSeed = require("../testSeeds/recetasSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  // cerrar la coneccion que se crea en el index.js
  await mongoose.disconnect();
  // conectarse a la bd de testing
  await mongoose.connect(`${process.env.MONGO_URI_TEST}recetas_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // cargar los seeds a la bd
  await Recetas.create(recetasSeed);
});

afterEach(async () => {
  // borrar el contenido de la colleccion en la bd
  await Recetas.deleteMany().exec();
  // desconectar la db mongoDB
  await mongoose.disconnect();
});

// receta para realizar las pruebas
const recetaGuardar = [
  {
    numeroRecetaOriginal: 25097980,
    tipoRecetaOriginal: 5,
    medicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
    numeroPaciente: {
      numero: 306211,
      codigoEstablecimiento: "E01",
      nombreEstablecimiento: "Hospital Regional de Antofagasta",
    },
    patologiaCronica: "Hipertensión - Coronario",
    recetaRetenida: false,
    pases: [
      {
        numeroReceta: 25097985,
        fechaEmision: "2021-03-30",
        numeroPase: 6,
      },
    ],
    medicamentos: [
      {
        nombreMaterial: "CARVEDILOL CM 12,5 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ACIDO ACETIL SALICILICO CM 100MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ENALAPRILA CM 10 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ATORVASTATINA CM 40 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
    ],
  },
  {
    numeroRecetaOriginal: 25097981,
    tipoRecetaOriginal: 5,
    medicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
    numeroPaciente: {
      numero: 306211,
      codigoEstablecimiento: "E01",
      nombreEstablecimiento: "Hospital Regional de Antofagasta",
    },
    patologiaCronica: "Hipertensión - Coronario",
    recetaRetenida: false,
    pases: [
      {
        numeroReceta: 25097985,
        fechaEmision: "2021-03-30",
        numeroPase: 6,
      },
    ],
    medicamentos: [
      {
        nombreMaterial: "CARVEDILOL CM 12,5 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ACIDO ACETIL SALICILICO CM 100MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ENALAPRILA CM 10 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ATORVASTATINA CM 40 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
    ],
  },
  {
    numeroRecetaOriginal: 25097982,
    tipoRecetaOriginal: 5,
    medicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
    numeroPaciente: {
      numero: 306211,
      codigoEstablecimiento: "E01",
      nombreEstablecimiento: "Hospital Regional de Antofagasta",
    },
    patologiaCronica: "Hipertensión - Coronario",
    recetaRetenida: false,
    pases: [
      {
        numeroReceta: 25097985,
        fechaEmision: "2021-03-30",
        numeroPase: 6,
      },
    ],
    medicamentos: [
      {
        nombreMaterial: "CARVEDILOL CM 12,5 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ACIDO ACETIL SALICILICO CM 100MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ENALAPRILA CM 10 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
      {
        nombreMaterial: "ATORVASTATINA CM 40 MG",
        dosis: 1,
        dias: 30,
        cantidadDias: 1,
        medicamentoControlado: false,
      },
    ],
  },
];

describe("Endpoints recetas", () => {
  describe("GET /hra/hradb_a_mongodb/recetas/ultimo/:tipoReceta/:codigoEstablecimiento", () => {
    // test autorizacion
    it("Should not get last receta from database", async (done) => {
      // ejecutar endpoint
      const response = await request
        .get("/hra/hradb_a_mongodb/recetas/ultimo/5/E01")
        .set("Authorization", "no-token");
      // verificar que retorno el status code correcto
      expect(response.status).toBe(401);

      done();
    });
    // test bd vacia
    it("Should get last receta from empty database", async (done) => {
      // borrar el contenido de la colleccion en la bd
      await Recetas.deleteMany().exec();
      // ejecutar endpoint
      const response = await request
        .get("/hra/hradb_a_mongodb/recetas/ultimo/5/E01")
        .set("Authorization", token);
      // verificar que retorno el status code correcto
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});

      done();
    });
    // test ultima receta
    it("Should get last receta from database", async (done) => {
      // guardar receta que sera la ultimo
      await Recetas.create(recetaGuardar);
      // ejecutar endpoint
      const response = await request
        .get("/hra/hradb_a_mongodb/recetas/ultimo/5/E01")
        .set("Authorization", token);
      // verificar que retorno el status code correcto
      expect(response.status).toBe(200);
      // verificar que la receta obtenida es igual a la que se guardo
      expect(response.body.numeroRecetaOriginal).toBe(
        recetaGuardar[2].numeroRecetaOriginal
      );
      expect(response.body.tipoRecetaOriginal).toBe(
        recetaGuardar[2].tipoRecetaOriginal
      );
      expect(response.body.medicoPrescriptor).toBe(
        recetaGuardar[2].medicoPrescriptor
      );
      expect(response.body.numeroPaciente).toStrictEqual(
        recetaGuardar[2].numeroPaciente
      );
      expect(response.body.patologiaCronica).toBe(
        recetaGuardar[2].patologiaCronica
      );
      expect(response.body.pases[0].numeroReceta).toBe(
        recetaGuardar[2].pases[0].numeroReceta
      );
      expect(Date.parse(response.body.pases[0].fechaEmision)).toBe(
        Date.parse(recetaGuardar[2].pases[0].fechaEmision)
      );
      expect(response.body.pases[0].numeroPase).toBe(
        recetaGuardar[2].pases[0].numeroPase
      );

      done();
    });
  });
  describe("POST /hra/hradb_a_mongodb/recetas", () => {
    // test autorizacion
    it("Should not save receta to database", async (done) => {
      // ejecutar endpoint
      const response = await request
        .post("/hra/hradb_a_mongodb/recetas")
        .set("Authorization", "no-token")
        .send(recetaGuardar);
      // obtener la receta que no se guardo
      const recetaObtenida = await Recetas.findOne({
        numeroRecetaOriginal: recetaGuardar[0].numeroRecetaOriginal,
        tipoRecetaOriginal: recetaGuardar[0].tipoRecetaOriginal,
      }).exec();
      // verificar que retorno el status code correcto
      expect(response.status).toBe(401);
      // no se debe haber encontrado el paciente
      expect(recetaObtenida).toBeFalsy();

      done();
    });
    // test guardar receta
    it("Should save receta to database", async (done) => {
      // ejecutar endpoint
      const response = await request
        .post("/hra/hradb_a_mongodb/recetas")
        .set("Authorization", token)
        .send(recetaGuardar);
      // obtener la receta que se guardo
      const recetaObtenida = await Recetas.findOne({
        numeroRecetaOriginal: recetaGuardar[0].numeroRecetaOriginal,
        tipoRecetaOriginal: recetaGuardar[0].tipoRecetaOriginal,
      }).exec();
      // verificar que retorno el status code correcto
      expect(response.status).toBe(201);
      // verificar que la receta obtenida es igual a la que se guardo
      expect(recetaObtenida.numeroRecetaOriginal).toBe(
        recetaGuardar[0].numeroRecetaOriginal
      );
      expect(recetaObtenida.tipoRecetaOriginal).toBe(
        recetaGuardar[0].tipoRecetaOriginal
      );
      expect(recetaObtenida.medicoPrescriptor).toBe(
        recetaGuardar[0].medicoPrescriptor
      );
      expect(recetaObtenida.numeroPaciente.numero).toBe(
        recetaGuardar[0].numeroPaciente.numero
      );
      expect(recetaObtenida.numeroPaciente.codigoEstablecimiento).toBe(
        recetaGuardar[0].numeroPaciente.codigoEstablecimiento
      );
      expect(recetaObtenida.numeroPaciente.nombreEstablecimiento).toBe(
        recetaGuardar[0].numeroPaciente.nombreEstablecimiento
      );
      expect(recetaObtenida.patologiaCronica).toBe(
        recetaGuardar[0].patologiaCronica
      );
      expect(recetaObtenida.recetaRetenida).toBe(
        recetaGuardar[0].recetaRetenida
      );
      expect(recetaObtenida.pases[0].numeroReceta).toBe(
        recetaGuardar[0].pases[0].numeroReceta
      );
      expect(Date.parse(recetaObtenida.pases[0].fechaEmision)).toBe(
        Date.parse(recetaGuardar[0].pases[0].fechaEmision)
      );
      expect(recetaObtenida.pases[0].numeroPase).toBe(
        recetaGuardar[0].pases[0].numeroPase
      );
      expect(recetaObtenida.medicamentos[0].nombreMaterial).toBe(
        recetaGuardar[0].medicamentos[0].nombreMaterial
      );
      expect(recetaObtenida.medicamentos[0].dosis).toBe(
        recetaGuardar[0].medicamentos[0].dosis
      );
      expect(recetaObtenida.medicamentos[0].dias).toBe(
        recetaGuardar[0].medicamentos[0].dias
      );
      expect(recetaObtenida.medicamentos[0].cantidadDias).toBe(
        recetaGuardar[0].medicamentos[0].cantidadDias
      );
      expect(recetaObtenida.medicamentos[0].medicamentoControlado).toBe(
        recetaGuardar[0].medicamentos[0].medicamentoControlado
      );
      expect(recetaObtenida.medicamentos[1].nombreMaterial).toBe(
        recetaGuardar[0].medicamentos[1].nombreMaterial
      );
      expect(recetaObtenida.medicamentos[1].dosis).toBe(
        recetaGuardar[0].medicamentos[1].dosis
      );
      expect(recetaObtenida.medicamentos[1].dias).toBe(
        recetaGuardar[0].medicamentos[1].dias
      );
      expect(recetaObtenida.medicamentos[1].cantidadDias).toBe(
        recetaGuardar[0].medicamentos[1].cantidadDias
      );
      expect(recetaObtenida.medicamentos[1].medicamentoControlado).toBe(
        recetaGuardar[0].medicamentos[1].medicamentoControlado
      );
      expect(recetaObtenida.medicamentos[2].nombreMaterial).toBe(
        recetaGuardar[0].medicamentos[2].nombreMaterial
      );
      expect(recetaObtenida.medicamentos[2].dosis).toBe(
        recetaGuardar[0].medicamentos[2].dosis
      );
      expect(recetaObtenida.medicamentos[2].dias).toBe(
        recetaGuardar[0].medicamentos[2].dias
      );
      expect(recetaObtenida.medicamentos[2].cantidadDias).toBe(
        recetaGuardar[0].medicamentos[2].cantidadDias
      );
      expect(recetaObtenida.medicamentos[2].medicamentoControlado).toBe(
        recetaGuardar[0].medicamentos[2].medicamentoControlado
      );

      done();
    });
  });
});
