const express = require('express');
const app = express();

const userRoutes = require("./routes/user.routes")

//Middlewares acciones que se ejecutan en mi servidor
app.use(express.json());


//Aplicamos o Integramos las rutas a nuestro server


app.use(userRoutes)

module.exports = app;