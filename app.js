const express = require('express');
const bodyParser = require('body-parser');
const dbMongo = require('./src/helpers/connection');
const addRoutes = require('./src/routes');

require('dotenv').config();
dbMongo.connect();
const app = express();
app.use(bodyParser.json());
addRoutes(app);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
