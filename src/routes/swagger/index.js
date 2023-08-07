/* eslint-disable n/no-path-concat */
const swaggerJSDocs = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'URL Monitorining', version: '1.0.0' },
    servers: [
      {
        url: 'http://localhost:3000/'
      }
    ]
  },
  apis: [`${__dirname}/*.js`]
};
const swaggerSpec = swaggerJSDocs(options);

function swaggerDocs (app, port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;
