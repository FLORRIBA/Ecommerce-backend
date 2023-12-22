

const User = require('../models/user.model')

//f asyncrona porque tengo q pedirle data externa
async function getUsers(req, res) {

    try {
        //llamo a mi modelo User (creado con moongoose lo guardo como users)busca todo lo q haya en user
        const users = await User.find()

        res.send(users)

    } catch (error) {
        console.log(error)
    }

}

//creo el MODULO
function createUser(req, res) {
    res.send('POST nuevo usuario')
}

function deleteUser(req, res) {
    res.send('DELETE usuario')
}
function updateUser(req, res) {
    res.send('UPDATE usuario')
}

//EXPORTO las funciones
module.exports = {
    createUser,
    getUsers,
    deleteUser,
    updateUser
}