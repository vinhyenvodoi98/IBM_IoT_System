var cfenv = require('cfenv');
var Cloudant = require('@cloudant/cloudant');
let mydb, cloudant;

//database name
dbName = 'iot';

const connectCloudant = () => {
  // load local VCAP configuration  and service credentials
  var vcapLocal;
  try {
    vcapLocal = require('../vcap-local.json');
    console.log('Loaded local VCAP', vcapLocal);
  } catch (e) {
    console.log('e', e);
  }

  const appEnvOpts = vcapLocal ? { vcap: vcapLocal } : {};

  const appEnv = cfenv.getAppEnv(appEnvOpts);

  if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/[Cc][Ll][Oo][Uu][Dd][Aa][Nn][Tt]/)) {
    // Load the Cloudant library.

    // Initialize database with credentials
    if (appEnv.services['cloudantNoSQLDB']) {
      // CF service named 'cloudantNoSQLDB'
      cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
    } else {
      // user-provided service with 'cloudant' in its name
      cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
    }
  } else if (process.env.CLOUDANT_URL) {
    cloudant = Cloudant(process.env.CLOUDANT_URL);
  }

  if (cloudant) {
    // Create a new "mydb" database.
    cloudant.db.create(dbName, function (err, data) {
      if (!err)
        //err if database doesn't already exists
        console.log('Created database: ' + dbName);
    });

    // Specify the database we are going to use (mydb)...
    mydb = cloudant.db.use(dbName);
  }
};

/// all type of query
var insertOne = {};
var getAll = {};

insertOne.cloudant = function (doc) {
  mydb.insert(doc, function (err, body, header) {
    if (err) {
      console.log('[mydb.insert] ', err.message);
      // response.send('Error');
      return;
    }
    doc._id = body.id;
    console.log('doc', doc);
  });
};

getAll.cloudant = async function () {
  var names = [];
  await mydb.list({ include_docs: true }, function (err, body) {
    if (!err) {
      body.rows.forEach(function (row) {
        console.log(row.doc);
        if (row.doc.name) names.push(row.doc.name);
      });
    }
  });
  return names;
};

module.exports = { connectCloudant, insertOne, getAll };
