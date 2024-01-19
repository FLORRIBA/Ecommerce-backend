const express = require('express');
// Iniciamos el objeto router para poder definir rutas
const router = express.Router();
const jwtVerify=require('../middlewares/isAuth')

const productController = require('../controllers/product.controller');


// Definimos ruta obtener todos los productos GET
router.get('/products/:id?', productController.getProduct);
// Agregamos un nuevo producto POST
router.post('/products', productController.createProduct);
//-POST Login usuario
router.post('/login', productController.login )
// Borrar un producto DELETE
router.delete('/products/:idProduct', jwtVerify, productController.deleteProduct);
// Actualizar un producto PUT
router.put('/products/:id', productController.updateProduct);
// Obtener un producto específico GET


// Exportamos router para poder usar rutas en app.js
module.exports = router;