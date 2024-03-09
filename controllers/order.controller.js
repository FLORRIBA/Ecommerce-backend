const Order = require("../models/order.model");

async function createOrder(req, res) {
  try {
    const order = new Order(req.body);
    const orderDB = await order.save();
    return res.status(201).send({
      ok: true,
      message: "Orden creada correctamente",
      order: orderDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error al crear la orden",
    });
  }
}

async function getOrders(req, res) {
  try {
    //si es ADMIN q me traiga todas las ordenes
    if (req.user?.role === "ADMIN_ROLE") {
      const orders = await Order.find()
        .populate("userId", "name email") //modelo coleccion de usuarios
        .populate("products.producId"); //dentro del array products que traiga el ID

      return req.status(200).send({
        ok: true,
        orders,
      });
    }
    //sino un usuario cualquiera se loguea q traiga "sus ordenes "
    const orders = await Order.find({ userId: req.user._id }).populate(
      "products.producId"
    );

    return req.status(200).send({
      ok: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Error al crear la orden",
    });
  }
}

module.exports = { createOrder, getOrders };
