var Client = require('ibmiotf');
const { insertOne } = require('./database');

const connectIoTF = () => {
  var appClientConfig = {
    org: 'ORG_NAME',
    id: 'NAME_OF_IOTF',
    'auth-key': 'AUTH_KEY',
    'auth-token': 'AUTH_TOKEN',
    type: 'shared',
  };
  console.log('config', appClientConfig);

  var appClient = new Client.IotfApplication(appClientConfig);

  appClient.connect();

  appClient.on('connect', function () {
    appClient.subscribeToDeviceEvents();
    //Add your code here
  });

  appClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
    console.log(
      'Device Event from :: ' +
        deviceType +
        ' : ' +
        deviceId +
        ' of event ' +
        eventType +
        ' with payload : ' +
        payload
    );
    payload = '' + payload;
    payload = JSON.parse(payload);

    //insert to database
    insertOne['cloudant'](payload);
  });
};

module.exports = { connectIoTF };
