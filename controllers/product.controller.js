const Product = require("../models/product.model");

//--GET -Obtener producto
async function getProducts(req, res) {
  try {
    //llamo a mi modelo Product (creado con moongoose lo guardo como products)busca todo lo q haya en product
    const id = req.params.id; // id sale de la ruta!-si no viene va a ser undefined
    if (id) {
      //solo si viene el id
      const product = await Product.findById(id).populate("category");//me traiga los datos de la categoria
      if (!product) {
        //sino encontro el producto != al catch no se pudo resolver la peticion
        return res.status(404).send({
          ok: false,
          mesage: "No se encontro el producto",
        });
      }

      return res.send(product); //return para que la res de abajo no se ejecute=> me va a dar error por la doble respuesta
    }
    const products = await Product.find(); //busca en colection de mi BD llamada "products"
    res.send({
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
    //creamos una nueva Instancia de un producto a partir del Modelo Product que definimos
    const product = new Product(req.body);
    //-Guardamos el producto
    const productSaved = await product.save(); //MongoDB Compass
    res.status(201).send({
      ok: true,
      message: "Producto creado correctamente",
      product: productSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({});
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
    res.send({
      ok: true,
      message: "Producto borrado correctamente",
      product: productDeleted,
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      message: "No se pudo borrar el product",
    });
  }
}
//--PUT -Actualizar un producto
async function updateProduct(req, res) {
  try { //Obtenemos el id para saber a quien actualizar
    const id = req.params.id; //id sale de la ruta!
    const nuevosValores = req.body; //body - Postman

    const product= await Product.findById(id); //busco por id

    if(!product){
      return res.status(404).send({
        ok:false,
        message:'Producto no encontrado'
      })
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

//--EXPORTO  las funciones
module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
};
