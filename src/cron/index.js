const { Monitor } = require('../services/monitor.service');

const monitor = new Monitor();
monitor.startMonitoring();

module.exports = {
  monitor
};
