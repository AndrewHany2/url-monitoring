const Report = require('../models/report.model');

async function createNewReport (params) {
  const { check, isUp } = params;
  const status = isUp ? 'UP' : 'DOWN';
  const report = await Report.create({
    urlCheck: check._id,
    status,
    availability: 0,
    outages: isUp ? 0 : 1,
    downtime: 0,
    uptime: 0,
    responseTime: 0,
    history: { timestamp: new Date(), status, responseTime: check.responseTime }
  });
  return report;
}

async function markUp (oldReport, check) {
  const uptime = oldReport.uptime + check.interval;
  const availability = (uptime / (uptime + oldReport.downtime)) * 100;
  oldReport.history.push({ timestamp: new Date(), status: 'UP', responseTime: check.responseTime });
  return {
    ...oldReport,
    urlCheck: check._id,
    status: 'UP',
    availability,
    outages: oldReport.outages,
    downtime: oldReport.downtime,
    uptime,
    responseTime: check.responseTime,
    history: oldReport.history
  };
}

async function markDown (oldReport, check) {
  const downtime = oldReport.downtime + check.interval;
  const availability = (check.uptime / (check.uptime + downtime)) * 100;
  oldReport.history.push({ timestamp: new Date(), status: 'DOWN', responseTime: check.responseTime });
  return {
    ...oldReport,
    urlCheck: check._id,
    status: 'DOWN',
    availability,
    outages: oldReport.outages + 1,
    downtime,
    uptime: oldReport.uptime,
    responseTime: check.responseTime,
    history: oldReport.history
  };
}

async function markReport (check, isUp) {
  let report = await Report.findOne({ urlCheck: check._id });
  if (!report) {
    await createNewReport({ check, isUp });
    return true;
  } else if (isUp) {
    const updatedReport = markUp(report, check);
    report = updatedReport;
    await report.save();
    return true;
  } else {
    const updatedReport = markDown(report, check);
    report = updatedReport;
    await report.save();
    return true;
  }
}
module.exports = { markReport };
