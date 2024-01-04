

const User = require('../models/user.model')

//f asyncrona porque tengo q pedirle data externa
async function getUsers(req, res) {

    try {
 //llamo a mi modelo User (creado con moongoose lo guardo como users)busca todo lo q haya en user
        const id=req.params.id //si no viene undefined
       
        if(id){
            const user = await User.findById(id) 
            return res.send(user) //mostrar error sin return
        }
        const users = await User.find()
        
        res.send({
            users,
            mesage: 'usuarios obtenidos correctamente',
            ok:true
            })

    } catch (error) {
        console.log(error),
        res.send({
            mesage:'error al obtener el usuario',
            ok:false,
        })
    }

}

//creo el MODULO 
//-creo Nuevo Usuario - (terminar la funcion crear usuario)
async function createUser(req, res) {
    try{
        const user=new User(req.body);
        await user.save()

        console.log(user);
        res.send('POST nuevo usuario')


    }catch (error){
        res.send(error)
    }
   
}
//-borro Usuario
async function deleteUser(req, res) {

    try{
        console.log(req.params.idUser)
        const id=req.params.idUser
        const userDeleted=await User.findByIdAndDelete(id)

        res.send({
            ok:true,
            message: 'Usuario borrado correctamente',
            user:userDeleted
            })
    
        }catch(error){
        console.log(error)
        res.send('no se pudo borrar el usuario' )
        }
   
}

//-Actualizar un usuario
async function updateUser(req, res) {

    try{
    const id=req.params.id
    const nuevosValores=req.body
    
                                //me va a devolver los valores del usuario actualizado
    const userUpdated=await User.findByIdAndUpdate(id, nuevosValores, {new:true})
    res.send({
        ok:true,
        message:'el usuario fue actualizado correctamente',
        user:userUpdated
    })
    // console.log(req.query)
    // res.send('UPDATE usuario')
}catch(error){
    console.log(error)
    res.send({
        ok:false,
        message:'el usuario no se pudo actualizar'
    })


}
}
//EXPORTO las funciones
module.exports = {
    createUser,
    getUsers,
    deleteUser,
    updateUser
}