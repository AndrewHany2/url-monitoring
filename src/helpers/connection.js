const mongoose = require('mongoose');
const keys = require('../keys');
// connect to mongodb
const connect = async () => {
  try {
    const db = await mongoose.connect(keys.mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Successfully established connection to database');
    return db;
  } catch (err) {
    console.error('Unable to connect to database', err);
  }
};

module.exports = {
  connect
};
