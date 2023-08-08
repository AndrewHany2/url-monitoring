const cron = require('node-cron');
const Monitoring = require('../services/monitoring.service');
const taskModel = require('../models/task.model');

async function scheduleMonitoring (urlCheck, interval) {
  const task = cron.schedule(`*/${interval} * * * * *`, () => {
    // all the task details
    // send the check one time and every time it's get updated or send the id and call the db to get it in every interval
    Monitoring.pingUrl(urlCheck);
    console.log(`Monitoring ${urlCheck.url} with interval ${interval} seconds`);
  });
  // store the task in the db;
  console.log(task.options.name);
  const taskCheck = await taskModel.create({
    urlCheckId: urlCheck._id,
    taskId: task.options.name,
    interval
  });
  console.log(taskCheck);
}

// Call this when you need to start or restart monitoring with a new interval
async function startMonitoring (urlCheck) {
  try {
    const interval = urlCheck.interval;
    console.log(`Monitoring ${urlCheck.url} with interval ${interval} seconds`);
    scheduleMonitoring(urlCheck, interval);
  } catch (error) {
    console.error(`Error starting monitoring for ${urlCheck.url}: ${error.message}`);
  }
}

// Call this when you want to stop monitoring for a specific URL
function stopMonitoring (url) {
//   if (tasks[url]) {
//     tasks[url].stop();
//     delete tasks[url];
//     console.log(`Stopped monitoring ${url}`);
//   }
}

module.exports = {
  scheduleMonitoring, startMonitoring, stopMonitoring
};
