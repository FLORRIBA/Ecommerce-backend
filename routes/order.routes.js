const express = require("express");
// Iniciamos el objeto router para poder definir rutas
const router = express.Router();
const orderController = require("../controllers/order.controller");
const jwtVerify = require("../middlewares/isAuth"); //para asegurar(con el token) que la persona este logueada

router.post("/orders", orderController.createOrder);
                //, jwtVerify,

router.get("/orders", orderController.getOrders);
                //jwtVerify,

module.exports = router;
