const express = require('express')
const recetasController = require('../controllers/recetasController')
const { isAuthenticated } = require('../middleware/auth')

const router = express.Router();

router.post("", isAuthenticated, recetasController.create);

router.put("", isAuthenticated, recetasController.updateMany);

router.delete("", isAuthenticated, recetasController.deleteMany);

module.exports = router;