

function isAdmin(req,res,next) {

    //isAuth - req.user creo una propiedad "user" dentro objeto "req"(guardo los datos del usuario y no se pueden modificar)
//  req.user=payload.user;=> payload (data base del token )
if(req.user.role !== 'ADMIN_ROLE'){
return res.status(403).send({
ok:false,
message:'No esta autorizado para realizar esta accion '
})
}
next();

}

module.exports = isAdmin