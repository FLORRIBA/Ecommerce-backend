const express = require("express");
// Iniciamos el objeto router para poder definir rutas
const router = express.Router();
const {jwtVerify} = require("../middlewares/isAuth");
const productController = require("../controllers/product.controller");
const{ isAdmin} = require("../middlewares/isAdmin");
const uploadImage = require("../middlewares/uploadProductImage"); //IMAGEN guardada en el servidor..

// Definimos ruta obtener todos los productos GET
router.get("/products/:id?:page?", productController.getProducts); //:parametro
// Agregamos un nuevo producto POST
router.post("/products",  uploadImage, productController.createProduct);

// Borrar un producto DELETE
//verificamos que esta logueado - jwtVerify y es ADMIN-ROLE - isAdmin
router.delete(
  "/products/:id",
  [jwtVerify, isAdmin],
  productController.deleteProduct
);
// Actualizar un producto PUT
router.put("/products/:id", uploadImage, productController.updateProduct);

//-Busqueda de productos
router.get("/products/search/:search", productController.searchProduct);

// Exportamos router para poder usar rutas en app.js
module.exports = router;
