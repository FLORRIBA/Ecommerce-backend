//npm i multer -LIBRERIA

const multer=require('multer')

const storage=multer.diskStorage({ //instancia de multer
    destination:(req,file,cb)=>{ //f destination recibe request, archivo y cb es una f de callback(q se va a ejecutar despues)
        cb(null, 'public/image/users') //cb recibe un null(por si sucede un errror )y lo vamos a guardar en una carpeta 'public'
    },
    filename:(req,file,cb)=>{ //configuro el nombre del archivo a guardar
                                                    //dejo solo la ext.del archivo.jpg
        cb(null, `${Date.now }-${file.originalname}`) //tiempo en milisegundos-nombre del archivo original. extension del archivo.
    }
})
const uploadMulter=multer({
    storage:storage,

})

const upload=uploadMulter.single('image')//que suba un archivo con el valor en el campo de la req. donde viene el archivo.

module.exports=upload;