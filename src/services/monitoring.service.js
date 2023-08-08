const axios = require('axios');
const https = require('https');
const { markReport } = require('./report.service');

async function pingUrl (check) {
  const { url, protocol, path, port, timeout, ignoreSSL, authentication, httpHeaders, assert } = check;

  if (protocol === 'HTTP' || protocol === 'HTTPS') {
    let axiosConfig = {
      method: 'get',
      url: `${protocol.toLowerCase()}://${url}${port ? ':' + port : ''}${path ? '/' + path : ''}`,
      timeout,
      httpsAgent: ignoreSSL ? new https.Agent({ rejectUnauthorized: false }) : undefined,
      headers: { ...httpHeaders }
    };
    if (authentication) {
      axiosConfig = {
        ...axiosConfig,
        auth: {
          username: authentication.username,
          password: authentication.password
        }
      };
    }
    const startTime = new Date();
    axios(axiosConfig).then(async response => {
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      if (assert && assert.statusCode) {
        if (response.status !== assert.statusCode) {
          // return mark ping down
          await markReport(check, false);
        }
      } else {
        if (response.status !== 200) {
          // return mark ping down
          await markReport(check, false);
        }
      }
      // return mark ping up
      await markReport(check, true);
    }).catch(async error => {
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      await markReport(check, false);
      console.log(error);
    });
  }
}

module.exports = { pingUrl };
