
const Product = require("../models/product.model");
const bcrypt = require("bcrypt");
const saltRounds = 10; //dictan cuántas veces realizamos el proceso de hash (encriptar contraseña)
const jwt = require("jsonwebtoken");
const secret = "alfabeta"; //FIRMA-palabra secreta(debe ser compleja)

//f asyncrona porque tengo q pedir data externa
//--GET -Obtener producto
async function getProduct(req, res) {
  try {
    //llamo a mi modelo Product (creado con moongoose lo guardo como products)busca todo lo q haya en product
    const id = req.params.id; // id sale de la ruta!-si no viene va a ser undefined
    if (id) {
      //solo si viene el id
      const product = await Product.findById(id ); 
        // { image: 0 },
        // { producto: 1, descripcion: 1, precio:1}
     

      if (!product) {
        //sino encontro el producto != al catch no se pudo resolver la peticion
        return res.status(404).send({
          //enviamos codigo 404 a la respuesta
          ok: false,
          mesage: "No se encontro el producto",
        });
      }

      //   product.password=undefined //me trae trdas las prop. del producto pero no la propiedad password

      return res.send(product); //return para que la res de abajo no se ejecute=> me va a dar error por la doble respuesta
    }
    const products = await Product.find(); //busca en colection de mi BD llamada "products"
    res.send({
      // Internal Server Error
      //-Devolvemos los productos encontrados
      products,
      ok: true,
      mesage: "Productos obtenidos correctamente",
    });
  } catch (error) {
      res.status(500).send({
      ok: false,
      mesage: "Error al obtener el producto",
    });
  }
}

//--POST -Crear Nuevo producto - Postman Body-raw-JSON---objeto JSON "",
async function createProduct(req, res) {
  try {
    //creamos una nueva instancia de un producto a partir del modelo Product que defini
    const product = new Product(req.body);
    //-Encriptar la contraseña (libreria-bcrypt)
    // product.password = bcrypt.hashSync(product.password, saltRounds);
    //-Guardamos el producto
    const productSaved = await product.save(); //MongoDB Compass
    //-Borramos la propiedad password del objeto
    //delete productSaved.password
    productSaved.password = undefined;
    res.status(201).send({
      ok: true,
      message: "Producto creado correctamente",
      product: productSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

//--DELETE -Borrar  producto
async function deleteProduct(req, res) {
  try {
    //-Comprobar que la persona q desea borrar es un ADMIN_ROLE
    //req.product=payload.product -isAuth
    // if (req.product.role !== "ADMIN_ROLE") {
    //   return res.status(401).send({
    //     ok: false,
    //     message: "No tienes permisos para realizar esta accion",
    //   });
    // }

    const id = req.params.id; //idProduct sale de la ruta!
    //Peticion async              CSSMathProduct modelo collection de mongoose .findByIdAndDelete(metodo)
    const productDeleted = await Product.findByIdAndDelete(id);

    if (!productDeleted) {
      return res.status(404).send({
        ok: false,
        message: "No se encontro producto",
      });
    }
    res.send({
      ok: true,
      message: "Producto borrado correctamente",
      product: productDeleted,
    });
  } catch (error) {
    res.status(500).send({
        ok: false,
        message: "No se pudo borrar el product"
});
}
}

//--PUT -Actualizar un producto
async function updateProduct(req, res) {
  try {
    const id = req.params.id; //id sale de la ruta!
    const nuevosValores = req.body; //body - Postman
    //Peticion async - {new: true,} me va a devolver los valores del producto actualizado
    const productUpdated = await Product.findByIdAndUpdate(id, nuevosValores, {
      new: true,
    });
    res.send({
      ok: true,
      message: "El producto fue actualizado correctamente",
      product: productUpdated,
    });
  } catch (error) {
      res.send({
      ok: false,
      message: "El producto no se pudo actualizar",
    });
  }
}



//--EXPORTO  las funciones
module.exports = {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
 
};
