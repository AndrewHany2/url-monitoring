const { default: mongoose } = require('mongoose');
const taskModel = require('../models/task.model');
const checkService = require('./urlCheck.service');
const cron = require('node-cron');

class NamedTask {
  constructor (name, intervalSchedule, callback) {
    this.name = name;
    this.intervalSchedule = intervalSchedule;
    this.callback = callback;
    this.task = null;
  }

  schedule () {
    this.task = cron.schedule(this.intervalSchedule, this.callback);
    if (!this.name) {
      this.name = this.task.options.name;
    }
  }

  start () {
    this.task.start();
  }

  stop () {
    this.task.stop();
  }
}

class Monitor {
  constructor (tasks) {
    this.tasks = tasks || [];
  }

  async scheduleTask (params) {
    const { urlCheck, task, isNew } = params;
    const taskName = task ? task.taskId : null;
    const cronTask = new NamedTask(taskName, `*/${urlCheck.interval} * * * * *`, () => {
      checkService.pingUrl(urlCheck);
      console.log(`Monitoring ${urlCheck.url} with interval ${urlCheck.interval} seconds`);
    });
    cronTask.schedule();
    // store the task in the db;
    if (isNew) {
      await taskModel.create({
        urlCheckId: urlCheck._id,
        taskId: cronTask.name,
        interval: urlCheck.interval,
        isActive: true
      });
    }
    this.tasks.push(cronTask);
  }

  // Call this when you need to start or restart monitoring with a new interval
  async startMonitoring () {
    const tasks = await taskModel.find({ isActive: true }).populate('urlCheckId');
    for (let i = 0; i < tasks.length; i++) {
      this.scheduleTask({ urlCheck: tasks[i].urlCheckId, task: tasks[i], isNew: false });
    }
  }

  async rescheduleTask (urlCheck) {
    // await this.deleteTask(urlCheck);
    const task = await taskModel.findOne({ urlCheckId: urlCheck._id });
    if (!task) await this.scheduleTask({ urlCheck, task, isNew: true });
    if (task.isActive) {
      const index = this.tasks.findIndex(t => t.name === task.taskId);
      if (index !== -1) {
        this.tasks[index].stop();
        this.tasks.splice(index, 1);
      }
    }
    await this.scheduleTask({ urlCheck, task, isNew: false });
  }

  async deleteTask (urlCheckId) {
    try {
      const task = await taskModel.findOne({ urlCheckId: new mongoose.Types.ObjectId(urlCheckId) });
      if (task && task.isActive) {
        task.isActive = false;
        await task.save();
        const index = this.tasks.findIndex(t => t.name === task.taskId);
        if (index !== -1) {
          this.tasks[index].stop();
          this.tasks.splice(index, 1);
          return true;
        }
      }
      return false;
    } catch (error) {
      return new Error(error);
    }
  }
}
module.exports = { Monitor };
