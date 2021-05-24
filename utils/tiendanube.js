const fetch = require('node-fetch');
const crypto = require("crypto");
const moment = require('moment-timezone');
moment().tz("America/Argentina/Buenos_Aires").format();

const APP_ID = 2914;
const CLIENT_SECRET = 'dgn9jk9i7eVxfKxwo5rHRaGC9bzm3PCNz2NUGLQ5Eu0bUEGq';
const CODE = '61026787b1c0ed1b4d982907204b15f18e7610ba';

async function postRequest(endpoint, body) {
    const response = await fetch(`https://api.tiendanube.com/v1/1058870/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication': 'bearer 61026787b1c0ed1b4d982907204b15f18e7610ba',
            'User-Agent': 'Integracion Rappi (estebankramer@gmail.com)'
          },
          body
        });
    const json = await response.json();
    console.log('POST RESPONSE: ', json);
    return json;
}

async function getRequest(endpoint) {
  const response = await fetch(`https://api.tiendanube.com/v1/1058870/${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authentication': 'bearer 61026787b1c0ed1b4d982907204b15f18e7610ba',
          'User-Agent': 'Integracion Rappi (estebankramer@gmail.com)'
        },
      });
  const json = await response.json();
  return json;
}

async function getProducts(delta = false) {
  try {
    let allProducts = []
    let page = 1
    let products
    const time = moment().subtract(5, 'minutes').format()
    do {
      products = await getRequest(`products?fields=name,brand,variants&per_page=200&page=${page}&published=true${delta ? `&updated_at_min=${time}` : ''}`)
      if(!products.code) {
        allProducts.push(products)
      }
      page++
    }
      while(!products.code && products.length !== 0) {
    }
    const productsFlat = allProducts.flat()
    return productsFlat.filter(product => product.variants[0].price && product.variants[0].promotional_price && parseFloat(product.variants[0].price) !== 0 && parseFloat(product.variants[0].promotional_price) !== 0)
  } catch (e) {
    console.log('Error getting updated products')
    return []
  }
}


function verifyWebhook(data, hmacHeader) {
  return hmacHeader === crypto.createHmac('sha256', CLIENT_SECRET)
                              .update(JSON.stringify(data))
                              .digest('hex');
}

module.exports = {
  verifyWebhook,
  getProducts
}
