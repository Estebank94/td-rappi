const TN = require("../utils/tiendanube");
const Rappi = require("../utils/rappi");

async function updateDelta() {
  try {
    const products = await TN.getProducts(true);
    const response = await Rappi.updateProducts(products, true);
    return response;
  } catch (err) {
    console.log('ERROR', err);
  }
}

async function updateAll() {
  try {
    const products = await TN.getProducts();
    const response = await Rappi.updateProducts(products);
    return response;
  } catch (err) {
    console.log('ERROR', err);
  }
}

module.exports = {
  updateDelta,
  updateAll
}
