//Libreria a partir de ella creamos un modelo
const mongoose = require('mongoose');

//receta
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: String,
    email: String,
})

            //collection mongoDB va a guardar el valor del modelo como 'users'
module.exports = mongoose.model('User', userSchema)