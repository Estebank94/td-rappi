const fetch = require('node-fetch');

const RAPPI_STORE_ID = '1000'
const API_KEY_DEMO = '6bc37261-7615-47c0-b6d8-91c23b747cea';
const API_KEY_PROD = 'db76ae12-d7e8-46c1-96ac-953c149a8b85';

async function postRequest(body) {
  const response = await fetch(`https://services.grability.rappi.com/api/cpgs-integration/datasets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY_PROD,
        },
        body: JSON.stringify(body)
      });
  const json = await response.json();
  return json;
}

async function updateProducts(products, delta = false) {
  try {
    if(products && products.length === 0) {
      return
    }
    let formattedProducts = []
    products.forEach(product => {
      formattedProducts.push({
        store_id: RAPPI_STORE_ID,
        id: product.variants[0].id,
        ean: product.variants[0].sku,
        stock: product.variants[0].stock,
        price: parseFloat(product.variants[0].price),
        discount_price: parseFloat(product.variants[0].promotional_price),
        name: product.name.es,
        trademark: product.brand,
        is_available: true,
        sale_type: "U",
      })
    })

    let body =  {
      records: formattedProducts
    }

    if(delta) {
      body.type = 'delta'
    }

    const response = await postRequest(body)
    return response
  } catch(e) {
    console.log('error', e)
  }
}

module.exports = {
  updateProducts
}


