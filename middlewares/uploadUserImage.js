//npm i multer -LIBRERIA-toma los archivos de un formData(formulario de datos)

//IMAGENES GUARDADDAS EN EL SERVIDOR
const multer=require('multer')

const storage=multer.diskStorage({ //instancia de multer
    destination:(req,file,cb)=>{ //f destination recibe request, archivo y cb es una f de callback(q se va a ejecutar despues)
        cb(null, 'public/images/users') //cb recibe un null(por si sucede un errror )y lo vamos a guardar en una carpeta 'public'
    },
    filename:(req,file,cb)=>{ //configuro el nombre del archivo a guardar
                                                    //dejo solo la ext.del archivo.jpg
        cb(null, `${Date.now() }-${file.originalname}`) //tiempo en milisegundos al momento de subirla-nombre del archivo original. extension del archivo.
    }
})
const uploadMulter=multer({
    storage:storage, //configuro su storage, puedo configurar por ej limite del peso de la img

})

const upload=uploadMulter.single('image')//que suba un archivo con el valor en el campo ("image") de la req.(Mongoose) donde viene el archivo.

module.exports=upload;