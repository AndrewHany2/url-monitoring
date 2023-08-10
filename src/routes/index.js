const userRouter = require('./user.router.js');
const checkRouter = require('./check.router.js');
const authRouter = require('./auth.router.js');
const reportRouter = require('./reports.router.js');
const { ErrorHandler } = require('../middlewares');
const swaggerDocs = require('./swagger');

const addRoutes = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/url/check', checkRouter);
  app.use('/api/report', reportRouter);
  swaggerDocs(app);
  app.use(ErrorHandler);
};

module.exports = addRoutes;
