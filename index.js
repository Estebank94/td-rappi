const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
var enforce = require('express-sslify');
const PORT = process.env.PORT || 5000;
const cron = require('node-cron');

const products = require('./utils/products')

// MIDDLEWARE
app.use(cors());
app.use(express.json()); //tengo acceso a request.body


//for testing
// app.use(express.static(path.join(__dirname, "client/build")));


if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
  //server static content
  //npm run build
  app.use(express.static(path.join(__dirname, 'client','build')))
}

// ROUTES

app.use("/products", require("./routes/product"));

cron.schedule('*/5  * * * *', () => {
  console.log('running a task every 5 minutes');
  products.updateDelta()
});

cron.schedule('00 00 00 * * *', () => {
  console.log('running a task at 00 00 00');
  products.updateAll()
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})
