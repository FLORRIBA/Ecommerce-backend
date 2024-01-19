//--MODELOS son recetas donde le voy a indicar a Mongoose que colleccion tiene q leer y como debe guardar los datos cuando lo vaya a escribir.

//Libreria a partir de ella creamos un modelo
const mongoose = require("mongoose");

//receta - de mongoose traemos ese esquema
const Schema = mongoose.Schema;

const productSchema = new Schema({
  //propiedades de la collection //barreras para cargar el usuario
  producto: {
    type: String,
    required: true,
    minlength: 4,
    maxlenght: 60,
    trim: true,    
  },
  precio: {
    type: Number,
    required: true,
    min: 1,
    max: 10000000,
  },
  active:{
    type: String,
    required:true,
  },
  descripcion: {
    type: String,
    required: true,
    minlength: 4,
    maxlenght: 60,
    trim: true,
  },
  fecha: {
    type: Date,
    required: false,
  },
  image: {
    type: String,
    required: false,
    trim: true,
  },

});

//collection mongoDB va a guardar el valor del modelo como 'users'
//queremos exportar un modelo basado en el esquema que definimos

module.exports = mongoose.model("Product", productSchema);
