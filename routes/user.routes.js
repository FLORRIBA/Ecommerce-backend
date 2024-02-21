const express = require('express');
// Iniciamos el objeto router para poder definir rutas
const router = express.Router();
const jwtVerify=require('../middlewares/isAuth') //para asegurar(con el token) que la persona este logueada
// USO a traves de una variable las funciones exportadas de controllers 
const userController = require('../controllers/user.controller');
const uploadImage=require('../middlewares/uploadUserImage')


// Definimos rutas: 

// -GET Obtener todos los usuarios - un usuario específico :id? param opcional
            //ruta                  variable      funciones
router.get('/users/:id?', userController.getUsers); //si me envian usuario entra al if
// -POST Crear un nuevo usuario 
router.post('/users',uploadImage, userController.createUser);
//-POST Login usuario
router.post('/login', userController.login )
// -DELETE Borrar un usuario  -req.params.idUser / active?no es necesario definirlo, es opcional
router.delete('/users/:idUser', jwtVerify, userController.deleteUser);
// -PUT Actualizar(Editar) un usuario 
router.put('/users/:id',  [jwtVerify , uploadImage],  userController.updateUser);

//-Busqueda de usuario
router.get('/users/search/:search', userController.searchUser);


// Exportamos router para poder usar rutas en app.js
module.exports = router; 