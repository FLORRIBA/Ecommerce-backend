//CONFIGURO SUS RUTAS

const mongoose = require('mongoose');
const app = require('./app');//lo q exporta mi archivo app
const port = 3000;
// mongodb+srv://floripina209:MBbHmkxbpRrwFyrT@eit.sprurjq.mongodb.net/

//funcion asincrona
async function main(){
    try{                                                                                            //test nombre de la BD que cree en Mongoose 
        await mongoose.connect('mongodb+srv://floripina209:MBbHmkxbpRrwFyrT@eit.sprurjq.mongodb.net/test')
        console.log('\x1b[33m conexion a la db correcta \x1b[37m ')
    } catch(error){
    console.log(error)

}
}
main()

app.get('/' ,(req,res)=>{
    console.log('Endpoint llamado')
    res.send('Hello World')
})

app.listen(3000, ()=>{
    console.log('server is running at port 3000')

})