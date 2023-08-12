const axios = require('axios');
const https = require('https');
const { markReport } = require('./report.service');
const net = require('net');

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
          return true;
        }
      } else {
        if (response.status !== 200) {
          // return mark ping down
          await markReport(check, false);
          return true;
        }
      }
      // return mark ping up
      await markReport(check, true);
    }).catch(async () => {
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      await markReport(check, false);
      return true;
    });
  } else {
    try {
      const isAvailable = await pingUrlWithTCP(check);
      if (isAvailable) {
        await markReport(check, true);
      } else {
        await markReport(check, false);
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  }
}

async function pingUrlWithTCP (check) {
  const { url, port, timeout } = check;
  return new Promise((resolve, reject) => {
    const startTime = new Date();
    const client = net.connect({ host: url, port }, () => {
      // If the connection is successful, the site is available
      client.end();
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      resolve(true);
    });

    client.on('error', (err) => {
      console.log(err);
      // If an error occurs, the site is not available
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      resolve(false);
    });

    // Set a custom timeout for the connection attempt
    client.setTimeout(timeout, () => {
      client.destroy(); // Close the connection
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      resolve(false);
    });
  });
}

module.exports = { pingUrl };
