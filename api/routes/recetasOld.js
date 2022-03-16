const express = require('express')
const { isAuthenticated } = require('../middleware/authOld')
const recetasController = require('../controllers/recetasOldController')

const router = express.Router()

router.get('/ultimo/:tipoReceta', isAuthenticated, recetasController.getLast)

router.post('', isAuthenticated, recetasController.create)

module.exports = router