/*  --middlwares=>funciones intermedias que se ejecutan antes de llamar a un controller
    -router.get('/users/:id?', jwtVerify, userController.getUsers);
    --is Auth (autentification)*/

const jwt=require('jsonwebtoken');
const secret='alfabeta';

function jwtVerify(req,res,next){
    const token=req.headers.authorization;

    if (!token ){
        //Bad request, pero no me loguea
        return res.status(400)({ 
        ok:false,
        message:'No se proporciono un token'
        })
    }
    //dos podibles caminos=>error / payload:todo lo que contiene mi token
    jwt.verify(token,secret,(error,payload)=>{

        //-El token es incorrecto, cortar la req.y devolver una res.(msaje de error)
        if(error){
            return res.status(401).send({
                ok:false,
                message:'No tienes autorizacion'
            })
        }      
        //-El token sea correcto, continuar con la ejec.de la peticion y agregar el payload a mi req.
        //req.user creo una propiedad "user" dentro objeto "req"(guardo los datos del usuario y no se pueden modificar)
        req.user=payload.user;
        //Continuamos hacia el controlador (funcion)correspondiente
        next();
    })
}

module.exports=jwtVerify;