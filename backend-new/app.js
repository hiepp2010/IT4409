const express = require('express');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require('cors')

const app = express();
// set security HTTP headers
// app.use(helmet());
// // sanitize request data
// app.use(xss());

app.use(cors())
app.use(express.json());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/subcategories', subcategoryRoutes);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
