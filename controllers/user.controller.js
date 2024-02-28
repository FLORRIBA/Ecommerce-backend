//-- FUNCIONES referidas a las distintas RUTAS que manejemos
//a partir de un Schema lo exporto
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10; //dictan cuántas veces realizamos el proceso de hash (encriptar contraseña)
const jwt = require("jsonwebtoken");
const secret = "alfabeta"; //FIRMA-palabra secreta(debe ser compleja)

//f asyncrona porque tengo q pedir data externa
//--GET -Obtener Usuario
async function getUsers(req, res) {
  try {
    //llamo a mi modelo User (creado con moongoose lo guardo como users)busca todo lo q haya en user
    const id = req.params.id; // id sale de la ruta!-si no viene va a ser undefined
    const user=req.body

    if (req.file?.filename) {
      user.image = req.file.filename;
      }
    if (id) {
      //solo si viene el id
      const user = await User.findById(id); // { name: 1, email: 1 } ); // que no me devuelva el password y que solo me devuelva por ej nombre y el mail

      if (!user) {
        //sino encontro el usuario != al catch no se pudo resolver la peticion
        return res.status(404).send({
          //enviamos codigo 404 a la respuesta
          ok: false,
          mesage: "No se encontro el usuario",
        });
      }

      return res.send(user); //return para que la res de abajo no se ejecute=> me va a dar error por la doble respuesta
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

//--POST -Crear Nuevo Usuario - Postman Body-raw-JSON---objeto JSON "",
async function createUser(req, res) {
  try {
    //creamos una nueva instancia de un usuario a partir del modelo User que defini
    const user = new User(req.body);

    if (req.file?.filename) {
      user.image == req.file.filename;
  
    }

    //-Encriptar la contraseña (libreria-bcrypt)
    user.password = bcrypt.hashSync(user.password, saltRounds);
    //-Guardamos el usuario
    const userSaved = await user.save(); //MongoDB Compass
    //-Borramos la propiedad password del objeto
    //delete userSaved.password
    // userSaved.password = undefined;
    res.status(201).send({
      //201 Status Created
      ok: true,
      message: "Usuario creado correctamente",
      user: userSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

//--DELETE -Borrar  Usuario
async function deleteUser(req, res) {
  try {
    //-Comprobar que la persona q desea borrar es un ADMIN_ROLE
    //req.user=payload.user -isAuth
    if (req.user.role !== "ADMIN_ROLE") {
      return res.status(403).send({
        //codigo 403-Prohibido
        ok: false,
        message: "No tienes permisos para borrar usuarios",
      });
    }

    const id = req.params.idUser; //idUser sale de la ruta!
    //Peticion async              User modelo collection de mongoose .findByIdAndDelete(metodo)
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
    res.send("No se pudo borrar el usuario");
  }
}

//--PUT -Actualizar(Editar) un Usuario
async function updateUser(req, res) {
  try {
    if (req.user.role !== "ADMIN_ROLE") {
      return res.status(403).send({
        //codigo 403-Prohibido
        ok: false,
        message: "No tienes permisos para borrar usuarios",
      });
    }
    const id = req.params.id; 
    const nuevosValores = req.body; //body - Postman
     
    //---------VER SI VA ACA-----------
    if (req.file?.filename) {
      nuevosValores.image = req.file.filename;
     
    }

    //Peticion async - {new: true,} me va a devolver los valores del usuario actualizado
    const userUpdated = await User.findByIdAndUpdate(id, nuevosValores, {
      new: true,
    });
    res.send({
      ok: true,
      message: "El usuario fue actualizado correctamente",
      user: userUpdated,
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
    //req     dataBase(hash)
    const verifiedUser = await bcrypt.compare(password, user?.password); //?Operador de encaden.opcional - exite user?sino existe=undefinid y no null
    //-Si la contraseña no es correcta
    if (!verifiedUser) {
      //=null - no puedo acceder a sus propiedades
      return res.status(404).send({
        ok: false,
        message: "Datos incorrectos",
      });
    }
    //Realizar login y devolver respuesta correcta
    // user.password = undefined; //para que no aparezca la prop

    //-Generar un token(cadena de caracteres)ante de devolver la peticion para el usuario de tal modo que sus datos no puedan ser manipulados
    const token = jwt.sign({ user }, secret, { expiresIn: "1h" }); //lo devolvemos al front

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

      //$and: que se cumplan las dos condiciones
      // $and: [
      //   { age: { $gte: 18 } }, //1ro - que sea mayor o igual que 18

      //   {
      //        //$or: que se cumpla una u otra-alguna de los dos
      //         $or: [

      //           { name: search }, //2do-que tenga en su nombre o email el "string" del search
      //           { email: search },
      //         ],
      //   },
      // ],
    });
    return res.send({
      ok: true,
      message: "Ususario encontrado",
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
