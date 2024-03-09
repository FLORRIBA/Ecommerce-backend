const express = require("express");
// Iniciamos el objeto router para poder definir rutas
const router = express.Router();
const orderController = require("../controllers/order.controller");


router.post("/orders",   orderController.createOrder);// 
                //,

router.get("/orders",  orderController.getOrders);// 
               

module.exports = router;
