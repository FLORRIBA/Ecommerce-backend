const Product = require("../models/product.model");

//--GET -Obtener producto
async function getProducts(req, res) {
  try {
    //llamo a mi modelo Product (creado con moongoose lo guardo como products)busca todo lo q haya en product
    const id = req.params.id; // id sale de la ruta!-si no viene va a ser undefined
    //-Busco por id si lo recibo
    if (id) {
      //solo si viene el id
      const product = await Product.findById(id) //me traiga los datos de la categoria
                                    .populate('category');

      if (!product) {
        //sino encontro el producto != al catch no se pudo resolver la peticion
        return res.status(404).send({
          ok: false,
          mesage: "No se encontro el producto",
        });
      }
      return res.send({
        ok: true,
        product,
        message:'Producto encontrado'}); //return para que la res de abajo no se ejecute=> me va a dar error por la doble respuesta
    }
    // -- PAGINACION hecha por el usuario de la pg con batones
    const limit = parseInt(req.query.limit) || 0;
    const page = parseInt(req.query.page) || 0;
    //--f Promise.all()Llamamos a un conjunto de promesas, dispara los await a la vez (demora lo q demora la mas larga)
    const [total, products] = await Promise.all([
      Product.countDocuments(),
      Product.find() //busca en colection de mi BD llamada "products"
        .populate("category")
        .limit(limit) //cantidad de productos que quiero q me traiga...
        .skip(page * limit) //cantidad de productos que va a ir salteando
        .collation({ locale: "es" })
        .sort({ producto: 1 }), //-Ordenamiento  :1 ascendente :-1 descendente * producto
    ]);
    return res.status(200).send({
      products,
      ok: true,
      mesage: "Productos obtenidos correctamente",
      total,
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
    //creamos una nueva Instancia de un producto a partir del Modelo Product que definimos
    const product = new Product(req.body);
    if (req.file?.filename) {
      product.image = req.file.filename;
    }

    //-Guardamos el producto
    const productSaved = await product.save(); //MongoDB Compass
    res.status(201).send({
      ok: true,
      message: "Producto creado correctamente",
      product: productSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error al crear los productos"});
  }
}
//--DELETE -Borrar  producto
async function deleteProduct(req, res) {
  try {
    const id = req.params.id; //idProduct sale de la ruta!
    //Peticion async        modelo collection de mongoose .findByIdAndDelete(metodo)
    const productDeleted = await Product.findByIdAndDelete(id);
    if (!productDeleted) {
      return res.status(404).send({
        ok: false,
        message: "No se encontro el producto",
      });
    }
    return res.status(200).send({
      ok: true,
      message: "Producto borrado correctamente",
      product: productDeleted,
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "No se pudo borrar el producto",
    });
  }
}
//--PUT -Actualizar un producto
async function updateProduct(req, res) {
  try {
    //Obtenemos el id para saber a quien actualizar
    const id = req.params.id; //id sale de la ruta!
    const nuevosValores = req.body; //body - Postman
    //------------VER SI VA ACA file de imagen----------------
    if (req.file?.filename) {
      nuevosValores.image = req.file.filename;
    }
    //---------------------------------------
    const product = await Product.findById(id); //busco por id

    if (!product) {
      return res.status(404).send({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    //Peticion async - {new: true,} me va a devolver los valores del producto actualizado
    const productUpdated = await Product.findByIdAndUpdate(id, nuevosValores, {
      new: true, //para que me vuelva el elemento actualizado
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

async function searchProduct(req, res) {
  try {
    const search = new RegExp(req.params.search, "i"); //nueva Expresion Regular a partir de la string de busqueda, 'i' que la busqueda no sea sensitiva a las may. y minus.

    const products = await Product.find({
      producto: search,
      // precio:search,
      //nombre de un producto
      // $or: [{ producto: search },
      //       { precio: search }],
    });
    // .populate("category");
    return res.send({
      ok: true,
      message: "Producto encontrado",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "No se encontro el producto",
    });
  }
}

//--EXPORTO  las funciones
module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  searchProduct,
};
