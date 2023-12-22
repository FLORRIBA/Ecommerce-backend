//CONFIGURO SUS RUTAS

const mongoose = require('mongoose');
const app = require('./app');//lo q exporta mi archivo app
const port = 3000;
// mongodb+srv://floripina209:MBbHmkxbpRrwFyrT@eit.sprurjq.mongodb.net/


//funcion asincrona
async function main(){
    try{
        await mongoose.connect('mongodb+srv://floripina209:MBbHmkxbpRrwFyrT@eit.sprurjq.mongodb.net/test')
        console.log('conexion a la db correcta')
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