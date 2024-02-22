const express = require("express");
// Iniciamos el objeto router para poder definir rutas
const router = express.Router();
const oderController = require("../controllers/order.controller");

router.post("/orders", oderController.createOrder);

module.exports = router;
