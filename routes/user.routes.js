const express = require('express');
// Iniciamos el objeto router para poder definir rutas
const router = express.Router();

//..salgo 
const userController = require('../controllers/user.controllers');


// Definimos ruta obtener todos los usuario GET
router.get('/users/:id?', userController.getUsers);
// Agregamos un nuevo usuario POST
router.post('/users', userController.createUser);
// Borrar un usuario DELETE
router.delete('/users/:idUser', userController.deleteUser);
// Actualizar un usuario PUT
router.put('/users/:id', userController.updateUser);
// Obtener un usuario específico GET


// Exportamos router para poder usar rutas en app.js
module.exports = router;