const express = require('express');
const app = express();

const userRoutes = require("./routes/user.routes")

//Middlewares(aplicaciones intermedias) acciones que se ejecutan en mi servidor antes de llamara a cualquier ruta
app.use(express.json());//cuando venga un req.body poder leerlo


//Aplicamos o Integramos las rutas a nuestro server
app.use(userRoutes) //que app use las rutas definidas en userRoutes

module.exports = app;