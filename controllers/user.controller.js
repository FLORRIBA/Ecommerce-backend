//-- FUNCIONES referidas a las distintas RUTAS que manejemos

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10; //dictan cuántas veces realizamos el proceso de hash (encriptar contraseña)
const jwt = require("jsonwebtoken");
const secret = "alfabeta"; //FIRMA-palabra secreta(debe ser compleja)

//--GET -Obtener Usuario
async function getUsers(req, res) {
  try {
    //llamo a mi modelo User
    const id = req.params.id;

    if (id) {
      //solo si viene el id
      const user = await User.findById(id);

      if (!user) {
        //sino encontro el usuario != al catch no se pudo resolver la peticion
        return res.status(404).send({
          ok: false,
          mesage: "No se encontro el usuario",
        });
      }

      return res.send(user);
    }

    const users = await User.find()
      .select({ password: 0, __v: 0 }) //busca en colection de mi BD llamada "users"
      .collation({ locale: "es" })
      .sort({ name: 1 });

    const total = await User.countDocuments(); //contar ctos usuarios tengo en la BD

    //-Devolvemos los usuarios encontrados
    res.send({
      users,
      ok: true,
      mesage: "Usuarios obtenidos correctamente",
      total,
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      mesage: "Error al obtener el usuario",
    });
  }
}

//--POST -Crear Nuevo Usuario 
async function createUser(req, res) {
  try {
    //creamos una nueva instancia de un usuario a partir del modelo User que definimos
    const user = new User(req.body);

    if (req.file?.filename) {
      user.image == req.file.filename;
    }

    //-Encriptar la contraseña (libreria-bcrypt)

    user.password = await bcrypt.hash(user.password, saltRounds); 
    const userSaved = await user.save();
    userSaved.password = "********";


    res.status(201).send({
      ok: true,
      message: "Usuario creado correctamente",
      user: userSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "No se pudo crear el usuario",
      error: error,
    });
  }
}
//--DELETE -Borrar  Usuario
async function deleteUser(req, res) {
  try {
    //-Comprobar que la persona q desea borrar es un ADMIN_ROLE

    if (req.user.role !== "ADMIN_ROLE") {
      return res.status(403).send({
        //codigo 403-Prohibido
        ok: false,
        message: "No tienes permisos para borrar usuarios",
      });
    }

    const id = req.params.id; 
    console.log(req.params.id);

    const userDeleted = await User.findByIdAndDelete(id);

    if (!userDeleted) {
      return res.status(404).send({
        ok: false,
        message: "No se encontro usuario",
      });
    }
    res.send({
      ok: true,
      message: "Usuario borrado correctamente",
      user: userDeleted,
    });
  } catch (error) {
    res.send(error);
  }
}

async function updateUser(req, res) {
  try {
    if (req.user.role !== "ADMIN_ROLE") {
      return res.status(403).send({
        ok: false,
        message: "No tienes permisos para realizar esta acción No es Admin",
      });
    }

    const id = req.params.idUser;
    const nuevosValores = req.body;

    if (req.file?.filename) {
      nuevosValores.image = req.file.filename;
    }
    const userUpdater = await User.findByIdAndUpdate(id, nuevosValores, {
      new: true,
    });

    res.send({
      ok: true,
      message: "Usuario fue actualizado Correctamente",
      user: userUpdater,
    });
  } catch (error) {
    res.send({
      ok: false,
      message: "El usuario no se pudo actualizar",
    });
  }
}

//--LOGIN
async function login(req, res) {
  try {
    //Obtenemos del body email y password
    const { password, email } = req.body;
    if (!password || !email) {
      return res.status(400).send({
        ok: false,
        message: "Faltan datos",
      });
    }
    //-Buscamos el usuario
    const user = await User.findOne({ email: email.toLowerCase() }); //busque Uno por la propiedad email donde su valor sea email
    //-Si no existe el usuario
    if (!user) {
      //=undefinid
      return res.status(404).send({
        ok: false,
        message: "Datos incorrectos",
      });
    }
    //-Si existe el usuario, comparamos la contraseña-bycrypt.compare() libreria
  
    const verifiedUser = await bcrypt.compare(password, user?.password); //?Operador de encaden.opcional - exite user?sino existe=undefinid y no null
    //-Si la contraseña no es correcta
    if (!verifiedUser) {
      //=null - no puedo acceder a sus propiedades
      return res.status(404).send({
        ok: false,
        message: "Datos incorrectos",
      });
    }
    //-Generar un token(cadena de caracteres)ante de devolver la peticion para el usuario de tal modo que sus datos no puedan ser manipulados
    const token = jwt.sign({ user }, secret); //lo devolvemos al front

    res.send({
      ok: true,
      message: "Login correcto",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "No se pudo hacer el login",
    });
  }
}

//--Busqueda
async function searchUser(req, res) {
  try {
    const search = new RegExp(req.params.search, "i"); //nueva Expresion Regular a partir de la string de busqueda, 'i' que la busqueda no sea sensitiva a las may. y minus.

    const users = await User.find({
      $or: [{ name: search }, { email: search }],

    });
    return res.send({
      ok: true,
      message: "Usuario encontrado",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "No se encontro el usuario",
    });
  }
}

//--EXPORTO  las funciones
module.exports = {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  login,
  searchUser,
};
