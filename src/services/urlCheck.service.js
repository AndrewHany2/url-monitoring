const axios = require('axios');
const https = require('https');
const { markReport } = require('./report.service');
const http = require('http');

function arrayToHeadersObject (arr) {
  const headersObject = {};

  arr.forEach((pair) => {
    if (pair && pair.length === 2) {
      const [key, value] = pair;
      headersObject[key] = value;
    }
  });

  return headersObject;
}

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
  const { url, port, timeout, httpHeaders, assert } = check;
  const requestOptions = {
    hostname: url,
    port,
    method: 'HEAD',
    headers: arrayToHeadersObject(httpHeaders)
  };
  return new Promise((resolve, reject) => {
    const startTime = new Date();
    const req = http.request(requestOptions, (res) => {
      if (assert && assert.statusCode) {
        if (res.status !== assert.statusCode) {
          // return mark ping down
          const endTime = new Date();
          const responseTime = endTime - startTime;
          check.responseTime = responseTime;
          resolve(false);
        }
      } else {
        if (res.status !== 200) {
          const endTime = new Date();
          const responseTime = endTime - startTime;
          check.responseTime = responseTime;
          // return mark ping down
          resolve(false);
        }
      }
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      resolve(true);
    });

    req.on('error', (err) => {
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      resolve(false);
      console.log(err);
    });

    // Set a custom timeout for the connection attempt
    req.setTimeout(timeout, () => {
      const endTime = new Date();
      const responseTime = endTime - startTime;
      check.responseTime = responseTime;
      req.abort(); // Abort the request
      resolve(false);
    });

    req.end();
  });
}

module.exports = { pingUrl };
