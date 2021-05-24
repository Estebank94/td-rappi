const express = require("express");
const HTTPStatus = require('http-status');
const router = express.Router();
const TN = require("../utils/tiendanube");
const Rappi = require("../utils/rappi");

router.get("/", async (req, res) => {
  try {
    const products = await TN.getProducts();
    const response = await Rappi.updateProductsDelta(products)
    return res.send(response)

  } catch (err) {
    return res.sendStatus(HTTPStatus.BAD_REQUEST)
  }
})

module.exports = router
