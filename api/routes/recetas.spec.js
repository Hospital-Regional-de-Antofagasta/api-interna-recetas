const supertest = require('supertest')
const app = require('../index')
const mongoose = require('mongoose')
const Recetas = require('../models/Recetas')
const RecetasDetalles = require('../models/RecetasDetalles')
const recetasSeed = require('../testSeeds/recetasSeed.json')
const recetasDetallesSeed = require('../testSeeds/recetasDetallesSeed.json')

const request = supertest(app)

const token = process.env.HRADB_A_MONGODB_SECRET

beforeEach(async () => {
    // cerrar la coneccion que se crea en el index.js
    await mongoose.disconnect()
    // conectarse a la bd de testing
    await mongoose.connect(`${process.env.MONGO_URI_TEST}recetas_test`, { useNewUrlParser: true, useUnifiedTopology: true })
    // cargar los seeds a la bd
    for (const recetaSeed of recetasSeed) {
        await Recetas.create(recetaSeed)
    }
    // cargar los seeds a la bd
    for (const recetaDetallesSeed of recetasDetallesSeed) {
        await RecetasDetalles.create(recetaDetallesSeed)
    }
})

afterEach(async () => {
    // borrar el contenido de la colleccion en la bd
    await Promise.all([
        Recetas.deleteMany().exec(),
        RecetasDetalles.deleteMany().exec()
    ])
    // desconectar la db mongoDB
    await mongoose.disconnect()
})

// receta para realizar las pruebas
const recetaGuardar = [
    {
        numeroRecetaOriginal: 25097980,
        tipoRecetaOriginal: 5,
        medicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
        numeroPaciente: 306211,
        patologiaCronica: "Hipertensión - Coronario",
        pases: [
           {
              numeroReceta: 25097985,
              fechaEmision: "2021-03-30",
              numeroPase: 6,
           },
        ],
    },
    {
        numeroRecetaOriginal: 25097981,
        tipoRecetaOriginal: 5,
        medicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
        numeroPaciente: 306211,
        patologiaCronica: "Hipertensión - Coronario",
        pases: [
           {
              numeroReceta: 25097985,
              fechaEmision: "2021-03-30",
              numeroPase: 6,
           },
        ],
    },
    {
        numeroRecetaOriginal: 25097982,
        tipoRecetaOriginal: 5,
        medicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
        numeroPaciente: 306211,
        patologiaCronica: "Hipertensión - Coronario",
        pases: [
           {
              numeroReceta: 25097985,
              fechaEmision: "2021-03-30",
              numeroPase: 6,
           },
        ],
    }
]

const recetaDetallesGuardar = [
    {
        numeroRecetaOriginal: 25097980,
        tipoRecetaOriginal: 5,
        medicamentos: [
           {
              nombreMaterial: "CARVEDILOL CM 12,5 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ACIDO ACETIL SALICILICO CM 100MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ENALAPRILA CM 10 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ATORVASTATINA CM 40 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
        ],
    },
    {
        numeroRecetaOriginal: 25097981,
        tipoRecetaOriginal: 5,
        medicamentos: [
           {
              nombreMaterial: "CARVEDILOL CM 12,5 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ACIDO ACETIL SALICILICO CM 100MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ENALAPRILA CM 10 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ATORVASTATINA CM 40 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
        ],
    },
    {
        numeroRecetaOriginal: 25097982,
        tipoRecetaOriginal: 5,
        medicamentos: [
           {
              nombreMaterial: "CARVEDILOL CM 12,5 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ACIDO ACETIL SALICILICO CM 100MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ENALAPRILA CM 10 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
           {
              nombreMaterial: "ATORVASTATINA CM 40 MG",
              dosis: 1,
              dias: 30,
              cantidadDias: 1,
           },
        ],
    }
]

describe('Endpoints recetas', () => {
    describe('Get last receta', () => {
        // test autorizacion
        it('Should not get last receta from database', async (done) => {
            // ejecutar endpoint
            const response = await request.get('/hra/hradb_a_mongodb/recetas/ultimo/5')
                .set('Authorization', 'no-token')
            // verificar que retorno el status code correcto
            expect(response.status).toBe(401)

            done()
        })
        // test bd vacia
        it('Should get last receta from empty database', async (done) => {
            // borrar el contenido de la colleccion en la bd
            await Promise.all([
                Recetas.deleteMany().exec(),
                RecetasDetalles.deleteMany().exec()
            ])
            // ejecutar endpoint
            const response = await request.get('/hra/hradb_a_mongodb/recetas/ultimo/5')
                .set('Authorization', token)
            // verificar que retorno el status code correcto
            expect(response.status).toBe(200)
            expect(response.body).toEqual({})

            done()
        })
        // test ultima receta
        it('Should get last receta from database', async (done) => {
            // guardar receta que sera la ultimo
            await Recetas.create(recetaGuardar)
            // ejecutar endpoint
            const response = await request.get('/hra/hradb_a_mongodb/recetas/ultimo/5')
                .set('Authorization', token)
            // verificar que retorno el status code correcto
            expect(response.status).toBe(200)
            // verificar que la receta obtenida es igual a la que se guardo
            expect(response.body.numeroRecetaOriginal).toBe(recetaGuardar[2].numeroRecetaOriginal)
            expect(response.body.tipoRecetaOriginal).toBe(recetaGuardar[2].tipoRecetaOriginal)
            expect(response.body.medicoPrescriptor).toBe(recetaGuardar[2].medicoPrescriptor)
            expect(response.body.numeroPaciente).toBe(recetaGuardar[2].numeroPaciente)
            expect(response.body.patologiaCronica).toBe(recetaGuardar[2].patologiaCronica)
            expect(response.body.pases[0].numeroReceta).toBe(recetaGuardar[2].pases[0].numeroReceta)
            expect(Date.parse(response.body.pases[0].fechaEmision)).toBe(Date.parse(recetaGuardar[2].pases[0].fechaEmision))
            expect(response.body.pases[0].numeroPase).toBe(recetaGuardar[2].pases[0].numeroPase)

            done()
        })
    })
    describe('Save receta', () => {
        // test autorizacion
        it('Should not save receta to database', async (done) => {
            // ejecutar endpoint
            const response = await request.post('/hra/hradb_a_mongodb/recetas/')
                .set('Authorization', 'no-token')
                .send({
                    recetas: recetaGuardar,
                    recetasDetalles: recetaDetallesGuardar,
                })
            // obtener la receta que no se guardo
            const recetaObtenida = await Recetas.findOne({
                numeroRecetaOriginal: recetaGuardar[0].numeroRecetaOriginal,
                tipoRecetaOriginal: recetaGuardar[0].tipoRecetaOriginal,
            }).exec()
            const recetaDetallesObtenida = await RecetasDetalles.findOne({
                numeroRecetaOriginal: recetaGuardar[0].numeroRecetaOriginal,
                tipoRecetaOriginal: recetaGuardar[0].tipoRecetaOriginal,
            }).exec()
            // verificar que retorno el status code correcto
            expect(response.status).toBe(401)
            // no se debe haber encontrado el paciente
            expect(recetaObtenida).toBeFalsy()
            expect(recetaDetallesObtenida).toBeFalsy()

            done()
        })
        // test guardar receta
        it('Should save receta to database', async (done) => {
            // ejecutar endpoint
            const response = await request.post('/hra/hradb_a_mongodb/recetas/')
                .set('Authorization', token)
                .send({
                    recetas: recetaGuardar,
                    recetasDetalles: recetaDetallesGuardar,
                })
            // obtener la receta que se guardo
            const recetaObtenida = await Recetas.findOne({
                numeroRecetaOriginal: recetaGuardar[0].numeroRecetaOriginal,
                tipoRecetaOriginal: recetaGuardar[0].tipoRecetaOriginal,
            }).exec()
            const recetaDetallesObtenida = await RecetasDetalles.findOne({
                numeroRecetaOriginal: recetaGuardar[0].numeroRecetaOriginal,
                tipoRecetaOriginal: recetaGuardar[0].tipoRecetaOriginal,
            }).exec()
            // verificar que retorno el status code correcto
            expect(response.status).toBe(201)
            // verificar que la receta obtenida es igual a la que se guardo
            expect(recetaObtenida.numeroRecetaOriginal).toBe(recetaGuardar[0].numeroRecetaOriginal)
            expect(recetaObtenida.tipoRecetaOriginal).toBe(recetaGuardar[0].tipoRecetaOriginal)
            expect(recetaObtenida.medicoPrescriptor).toBe(recetaGuardar[0].medicoPrescriptor)
            expect(recetaObtenida.numeroPaciente).toBe(recetaGuardar[0].numeroPaciente)
            expect(recetaObtenida.patologiaCronica).toBe(recetaGuardar[0].patologiaCronica)
            expect(recetaObtenida.pases[0].numeroReceta).toBe(recetaGuardar[0].pases[0].numeroReceta)
            expect(Date.parse(recetaObtenida.pases[0].fechaEmision)).toBe(Date.parse(recetaGuardar[0].pases[0].fechaEmision))
            expect(recetaObtenida.pases[0].numeroPase).toBe(recetaGuardar[0].pases[0].numeroPase)
            // verificar que la receta detalles obtenida es igual a la que se guardo
            expect(recetaDetallesObtenida.numeroRecetaOriginal).toBe(recetaDetallesGuardar[0].numeroRecetaOriginal)
            expect(recetaDetallesObtenida.tipoRecetaOriginal).toBe(recetaDetallesGuardar[0].tipoRecetaOriginal)
            expect(recetaDetallesObtenida.medicamentos[0].nombreMaterial).toBe(recetaDetallesGuardar[0].medicamentos[0].nombreMaterial)
            expect(recetaDetallesObtenida.medicamentos[0].dosis).toBe(recetaDetallesGuardar[0].medicamentos[0].dosis)
            expect(recetaDetallesObtenida.medicamentos[0].dias).toBe(recetaDetallesGuardar[0].medicamentos[0].dias)
            expect(recetaDetallesObtenida.medicamentos[0].cantidadDias).toBe(recetaDetallesGuardar[0].medicamentos[0].cantidadDias)
            expect(recetaDetallesObtenida.medicamentos[1].nombreMaterial).toBe(recetaDetallesGuardar[0].medicamentos[1].nombreMaterial)
            expect(recetaDetallesObtenida.medicamentos[1].dosis).toBe(recetaDetallesGuardar[0].medicamentos[1].dosis)
            expect(recetaDetallesObtenida.medicamentos[1].dias).toBe(recetaDetallesGuardar[0].medicamentos[1].dias)
            expect(recetaDetallesObtenida.medicamentos[1].cantidadDias).toBe(recetaDetallesGuardar[0].medicamentos[1].cantidadDias)
            expect(recetaDetallesObtenida.medicamentos[2].nombreMaterial).toBe(recetaDetallesGuardar[0].medicamentos[2].nombreMaterial)
            expect(recetaDetallesObtenida.medicamentos[2].dosis).toBe(recetaDetallesGuardar[0].medicamentos[2].dosis)
            expect(recetaDetallesObtenida.medicamentos[2].dias).toBe(recetaDetallesGuardar[0].medicamentos[2].dias)
            expect(recetaDetallesObtenida.medicamentos[2].cantidadDias).toBe(recetaDetallesGuardar[0].medicamentos[2].cantidadDias)

            done()
        })
        // test save recetas incorrectas
        it('Should delete recetas y recetasDetalles if there was an error', async (done) => {
            // ejecutar endpoint
            const response = await request.post('/hra/hradb_a_mongodb/recetas/')
                .set('Authorization', token)
                .send({
                    recetas: recetaGuardar,
                    recetasDetalles: [1],
                })

            const recetaObtenida = await Recetas.findOne({
                numeroRecetaOriginal: recetaGuardar[0].numeroRecetaOriginal,
                tipoRecetaOriginal: recetaGuardar[0].tipoRecetaOriginal,
            }).exec()
            const recetaDetallesObtenida = await RecetasDetalles.findOne({
                numeroRecetaOriginal: recetaDetallesGuardar[0].numeroRecetaOriginal,
                tipoRecetaOriginal: recetaGuardar[0].tipoRecetaOriginal,
            }).exec()
            // verificar que retorno el status code correcto
            expect(response.status).toBe(500)

            expect(recetaObtenida).toBeFalsy()
            expect(recetaDetallesObtenida).toBeFalsy()

            done()
        })
    })
})
