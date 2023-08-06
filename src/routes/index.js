const userRouter = require('./user.router.js');
const { ErrorHandler } = require('../middlewares');
const swaggerDocs = require('./swagger.js');

const addRoutes = (app) => {
  app.use('/api/user', userRouter);
  swaggerDocs(app);
  app.use(ErrorHandler);
};

module.exports = addRoutes;
