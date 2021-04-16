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
        Fld_NroRecetaOriginal: 25097980,
        Fld_TipoRecetOriginal: 5,
        Fld_FechaDigit: "2021-10-30",
        Fld_MedicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
        PAC_PAC_Numero: 306211,
        Fld_PatologiaCronica: "Hipertensión - Coronario",
        Pases: [
           {
              Fld_NroReceta: 25097985,
              Fld_FechaEmision: "2021-03-30",
              Fld_Pase: 6,
           },
        ],
    },
    {
        Fld_NroRecetaOriginal: 25097981,
        Fld_TipoRecetOriginal: 5,
        Fld_FechaDigit: "2021-10-29",
        Fld_MedicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
        PAC_PAC_Numero: 306211,
        Fld_PatologiaCronica: "Hipertensión - Coronario",
        Pases: [
           {
              Fld_NroReceta: 25097985,
              Fld_FechaEmision: "2021-03-30",
              Fld_Pase: 6,
           },
        ],
    },
    {
        Fld_NroRecetaOriginal: 25097982,
        Fld_TipoRecetOriginal: 5,
        Fld_FechaDigit: "2021-10-28",
        Fld_MedicoPrescriptor: "VICTOR ALEJANDRO VALDIVIA URRA",
        PAC_PAC_Numero: 306211,
        Fld_PatologiaCronica: "Hipertensión - Coronario",
        Pases: [
           {
              Fld_NroReceta: 25097985,
              Fld_FechaEmision: "2021-03-30",
              Fld_Pase: 6,
           },
        ],
    }
]

const recetaDetallesGuardar = [
    {
        Fld_NroRecetaOriginal: 25097980,
        Fld_TipoRecetOriginal: 5,
        Medicamentos: [
           {
              FLD_MATNOMBRE: "CARVEDILOL CM 12,5 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ACIDO ACETIL SALICILICO CM 100MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ENALAPRILA CM 10 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ATORVASTATINA CM 40 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
        ],
    },
    {
        Fld_NroRecetaOriginal: 25097981,
        Fld_TipoRecetOriginal: 5,
        Medicamentos: [
           {
              FLD_MATNOMBRE: "CARVEDILOL CM 12,5 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ACIDO ACETIL SALICILICO CM 100MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ENALAPRILA CM 10 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ATORVASTATINA CM 40 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
        ],
    },
    {
        Fld_NroRecetaOriginal: 25097982,
        Fld_TipoRecetOriginal: 5,
        Medicamentos: [
           {
              FLD_MATNOMBRE: "CARVEDILOL CM 12,5 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ACIDO ACETIL SALICILICO CM 100MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ENALAPRILA CM 10 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
           },
           {
              FLD_MATNOMBRE: "ATORVASTATINA CM 40 MG",
              Fld_Dosis: 1,
              Fld_Dias: 30,
              Fld_CantDias: 1,
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
            expect(response.status).toBe(403)

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
            expect(response.body.Fld_NroRecetaOriginal).toBe(recetaGuardar[0].Fld_NroRecetaOriginal)
            expect(response.body.Fld_TipoRecetOriginal).toBe(recetaGuardar[0].Fld_TipoRecetOriginal)
            expect(Date.parse(response.body.Fld_FechaDigit)).toBe(Date.parse(recetaGuardar[0].Fld_FechaDigit))
            expect(response.body.Fld_MedicoPrescriptor).toBe(recetaGuardar[0].Fld_MedicoPrescriptor)
            expect(response.body.PAC_PAC_Numero).toBe(recetaGuardar[0].PAC_PAC_Numero)
            expect(response.body.Fld_PatologiaCronica).toBe(recetaGuardar[0].Fld_PatologiaCronica)
            expect(response.body.Pases[0].Fld_NroReceta).toBe(recetaGuardar[0].Pases[0].Fld_NroReceta)
            expect(Date.parse(response.body.Pases[0].Fld_FechaEmision)).toBe(Date.parse(recetaGuardar[0].Pases[0].Fld_FechaEmision))
            expect(response.body.Pases[0].Fld_Pase).toBe(recetaGuardar[0].Pases[0].Fld_Pase)

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
                Fld_NroRecetaOriginal: recetaGuardar[0].Fld_NroRecetaOriginal,
                Fld_TipoRecetOriginal: recetaGuardar[0].Fld_TipoRecetOriginal,
            }).exec()
            const recetaDetallesObtenida = await RecetasDetalles.findOne({
                Fld_NroRecetaOriginal: recetaGuardar[0].Fld_NroRecetaOriginal,
                Fld_TipoRecetOriginal: recetaGuardar[0].Fld_TipoRecetOriginal,
            }).exec()
            // verificar que retorno el status code correcto
            expect(response.status).toBe(403)
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
                Fld_NroRecetaOriginal: recetaGuardar[0].Fld_NroRecetaOriginal,
                Fld_TipoRecetOriginal: recetaGuardar[0].Fld_TipoRecetOriginal,
            }).exec()
            const recetaDetallesObtenida = await RecetasDetalles.findOne({
                Fld_NroRecetaOriginal: recetaGuardar[0].Fld_NroRecetaOriginal,
                Fld_TipoRecetOriginal: recetaGuardar[0].Fld_TipoRecetOriginal,
            }).exec()
            // verificar que retorno el status code correcto
            expect(response.status).toBe(201)
            // verificar que la receta obtenida es igual a la que se guardo
            expect(recetaObtenida.Fld_NroRecetaOriginal).toBe(recetaGuardar[0].Fld_NroRecetaOriginal)
            expect(recetaObtenida.Fld_TipoRecetOriginal).toBe(recetaGuardar[0].Fld_TipoRecetOriginal)
            expect(Date.parse(recetaObtenida.Fld_FechaDigit)).toBe(Date.parse(recetaGuardar[0].Fld_FechaDigit))
            expect(recetaObtenida.Fld_MedicoPrescriptor).toBe(recetaGuardar[0].Fld_MedicoPrescriptor)
            expect(recetaObtenida.PAC_PAC_Numero).toBe(recetaGuardar[0].PAC_PAC_Numero)
            expect(recetaObtenida.Fld_PatologiaCronica).toBe(recetaGuardar[0].Fld_PatologiaCronica)
            expect(recetaObtenida.Pases[0].Fld_NroReceta).toBe(recetaGuardar[0].Pases[0].Fld_NroReceta)
            expect(Date.parse(recetaObtenida.Pases[0].Fld_FechaEmision)).toBe(Date.parse(recetaGuardar[0].Pases[0].Fld_FechaEmision))
            expect(recetaObtenida.Pases[0].Fld_Pase).toBe(recetaGuardar[0].Pases[0].Fld_Pase)
            // verificar que la receta detalles obtenida es igual a la que se guardo
            expect(recetaDetallesObtenida.Fld_NroRecetaOriginal).toBe(recetaDetallesGuardar[0].Fld_NroRecetaOriginal)
            expect(recetaDetallesObtenida.Fld_TipoRecetOriginal).toBe(recetaDetallesGuardar[0].Fld_TipoRecetOriginal)
            expect(recetaDetallesObtenida.Medicamentos[0].FLD_MATNOMBRE).toBe(recetaDetallesGuardar[0].Medicamentos[0].FLD_MATNOMBRE)
            expect(recetaDetallesObtenida.Medicamentos[0].Fld_Dosis).toBe(recetaDetallesGuardar[0].Medicamentos[0].Fld_Dosis)
            expect(recetaDetallesObtenida.Medicamentos[0].Fld_Dias).toBe(recetaDetallesGuardar[0].Medicamentos[0].Fld_Dias)
            expect(recetaDetallesObtenida.Medicamentos[0].Fld_CantDias).toBe(recetaDetallesGuardar[0].Medicamentos[0].Fld_CantDias)
            expect(recetaDetallesObtenida.Medicamentos[1].FLD_MATNOMBRE).toBe(recetaDetallesGuardar[0].Medicamentos[1].FLD_MATNOMBRE)
            expect(recetaDetallesObtenida.Medicamentos[1].Fld_Dosis).toBe(recetaDetallesGuardar[0].Medicamentos[1].Fld_Dosis)
            expect(recetaDetallesObtenida.Medicamentos[1].Fld_Dias).toBe(recetaDetallesGuardar[0].Medicamentos[1].Fld_Dias)
            expect(recetaDetallesObtenida.Medicamentos[1].Fld_CantDias).toBe(recetaDetallesGuardar[0].Medicamentos[1].Fld_CantDias)
            expect(recetaDetallesObtenida.Medicamentos[2].FLD_MATNOMBRE).toBe(recetaDetallesGuardar[0].Medicamentos[2].FLD_MATNOMBRE)
            expect(recetaDetallesObtenida.Medicamentos[2].Fld_Dosis).toBe(recetaDetallesGuardar[0].Medicamentos[2].Fld_Dosis)
            expect(recetaDetallesObtenida.Medicamentos[2].Fld_Dias).toBe(recetaDetallesGuardar[0].Medicamentos[2].Fld_Dias)
            expect(recetaDetallesObtenida.Medicamentos[2].Fld_CantDias).toBe(recetaDetallesGuardar[0].Medicamentos[2].Fld_CantDias)

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
                Fld_NroRecetaOriginal: recetaGuardar[0].Fld_NroRecetaOriginal,
                Fld_TipoRecetOriginal: recetaGuardar[0].Fld_TipoRecetOriginal,
            }).exec()
            const recetaDetallesObtenida = await RecetasDetalles.findOne({
                Fld_NroRecetaOriginal: recetaDetallesGuardar[0].Fld_NroRecetaOriginal,
                Fld_TipoRecetOriginal: recetaGuardar[0].Fld_TipoRecetOriginal,
            }).exec()
            // verificar que retorno el status code correcto
            expect(response.status).toBe(500)

            expect(recetaObtenida).toBeFalsy()
            expect(recetaDetallesObtenida).toBeFalsy()

            done()
        })
    })
})
