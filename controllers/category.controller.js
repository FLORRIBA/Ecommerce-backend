const Category = require("../models/category.model");

//-Obtener Categoria
async function getCategories(req, res) {
  try {
    const id = req.params.id; 
    if (id) {
      const categories = await Category.find(); 
      if (!categories) {
        return res.status(404).send({
          ok: false,
          mesage: "No se encontro categorias",
        });
      }

      return res.send(categories);
    }
    const categories = await Category.find().sort({ name: 1 });
    res.send({
      categories,
      ok: true,
      mesage: "Categorias obtenidos correctamente",
    });
  } catch (error) {
    res.status(500).send({
      ok: false,
      mesage: "Error al obtener categoria",
    });
  }
}
//-Crear nueva Categoria
async function postCategory(req, res) {
  //Se va a encargar de crear las categorias
  try {
    //Tenemos que obtener los datos que me mandan de la Nueva Categoria
    const category = new Category(req.body); //nueva instancia de mi modelo Categoria a partir de mi variable new Category
    const categoryDB = await category.save(); 

    return res.status(201).send({
      ok: true,
      category: categoryDB,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ ok: false, message: "No se pudo crear la categoria" });
  }
}
module.exports = {
  getCategories,
  postCategory,
};
