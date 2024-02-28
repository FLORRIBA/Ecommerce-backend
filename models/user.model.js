//--MODELOS son recetas donde le voy a indicar a Mongoose que colleccion tiene q leer y como debe guardar los datos cuando lo vaya a escribir.

//Libreria a partir de ella creamos un modelo
const mongoose = require("mongoose");

//receta - de mongoose traemos ese esquema
const Schema = mongoose.Schema;

const userSchema = new Schema({
  //propiedades de la collection //barreras para cargar el usuario

  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlenght: 60,
    trim: true,
    validate: {
      validator: function (name) {
        const regex = /^[a-zA-Z\s]*$/; //-Expresion regular
        return regex.test(name); //testeo de la Exprecion regular=>true / false
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, //unico usuario
    index: true, //buscar por correo que sea un valor de indice en el buscador, cuando tengo q buscar por correo
    lowercase: true, // pasar a lower cuando venga
    trim: true, //quitar espacios
    minlenght: 6,
    maxlenght: 80,
    validate: {
      validator: function (value) {
        const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,})?$/; //-Expresion regular
        return regex.test(value); //test() ejecuta una búsqueda con esta expresión regular para encontrar una coincidencia entre una expresión regular y una cadena especificada
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlenght: 4,
    maxlenght: 70,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    minlenght: 4,
    maxlenght: 70,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 12,
    max: 120,
  },
 
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: ["USER_ROLE", "CLIENT_ROLE", "ADMIN_ROLE"],
  },
});

//collection mongoDB va a guardar el valor del modelo como 'users'
//queremos exportar un modelo basado en el esquema que definimos
module.exports = mongoose.model("User", userSchema);
