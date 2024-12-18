const mongoose = require("mongoose");
const dbConnectinStuffDirectPath = require("./foo/dbConnection.common");

const ChildSchema = new mongoose.Schema({
  someString: { type: String },
});

const MotherSchema = new mongoose.Schema({
  myChildren: {
    type: [ChildSchema],
  },
});

const uri =
  "mongodb://127.0.0.1:27017/tePreferencesTestBla00?retryWrites=false&readPreference=primaryPreferred&directConnection=true";

const DB_CLUSTER_URIS = {
  A: uri,
};

const EDatabaseCluster = {
  A: "A",
};

const getModel = (conn, schema, cluster, database) => {
  if (!conn) {
    console.error(`No connection found`);
    return;
  }
  const db = conn.useDb(database, { useCache: true });
  if (!db) {
    console.error(`Failed to connect to database ${database}`);
    return;
  }
  const collectionName = "someRandomName";
  if (!db.models[collectionName]) {
    return db.model(collectionName, schema);
  }
  return db.model(collectionName);
};

const getFormModel = async (connection, organizationId) => {
  return getModel(
    connection,
    MotherSchema,
    "A",
    "tenant-65a651f72a944b06cbc8a1fd"
  );
};

const connectOptionsMeow = {
  autoIndex: true,
  maxPoolSize: 10,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
};

const connectLeumel = async (options = connectOptionsMeow) => {
  if (Object.values(DB_CLUSTER_URIS).every((uri) => !uri)) {
    throw new Error(
      "No database connections made, all DB_CLUSTER_URIS were empty"
    );
  }
  const connectionPromises = await Promise.all(
    Object.values(EDatabaseCluster).map((cluster) => {
      const connection = dbConnectinStuffDirectPath.createConnection(
        cluster,
        options
      );
      dbConnectinStuffDirectPath.setConnection(cluster, connection);
      return connection === null || connection === void 0
        ? void 0
        : connection.asPromise();
    })
  );
  console.log("Opened all configured mongoose connections");
  return connectionPromises;
};

async function myMainFunction() {
  const connections = await connectLeumel();

  const myModel = await getFormModel(
    connections[0],
    "65a651f72a944b06cbc8a1fd"
  );
  console.log("Connected to MongoDB");

  await myModel.create({});

  console.log("Created document");

  process.exit(0);
}

myMainFunction();
