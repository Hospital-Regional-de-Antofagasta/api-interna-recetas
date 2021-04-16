const express = require('express')
const { isAuthenticated } = require('../middleware/auth')
const recetasController = require('../controllers/recetasController')

const router = express.Router()

router.get('/ultimo/:tipoReceta', isAuthenticated, recetasController.getLast)

router.post('/', isAuthenticated, recetasController.create)

module.exports = router