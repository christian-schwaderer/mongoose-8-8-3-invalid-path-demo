"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const mongoose_1 = __importDefault(require("mongoose"));

const connectOptions = {
    autoIndex: true,
    maxPoolSize: 10,
    // If not connected, return errors immediately rather than waiting for reconnect
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
};
exports.connectOptions = connectOptions;

const databaseCluster_enum_1 = { EDatabaseCluster: { A: 'A', B: 'B', C: 'C', D: 'D' } }

const DB_CLUSTER_URIS = {
    A: 'mongodb://127.0.0.1:27017/tePreferencesTestBla00?retryWrites=false&readPreference=primaryPreferred&directConnection=true',
    B: undefined,
    C: undefined,
    D: undefined
  }


const connections = {
    [databaseCluster_enum_1.EDatabaseCluster.A]: null,
    [databaseCluster_enum_1.EDatabaseCluster.B]: null,
    [databaseCluster_enum_1.EDatabaseCluster.C]: null,
    [databaseCluster_enum_1.EDatabaseCluster.D]: null,
};
const createConnection = (cluster, options) => {
    const uri = DB_CLUSTER_URIS[cluster];
    if (!uri) {
        // No connection uri configured, skip this cluster connection
        return null;
    }
    if (connections[cluster]) {
        // Already connected
        return connections[cluster];
    }
    const connection = mongoose_1.default.createConnection(uri, options);
    connection
        .asPromise()
        .then(() => {
        // When successfully connected
        console.info(`Mongoose connection ${cluster} done to host ${connection.host}`);
    })
        .catch((error) => {
        // When failed attempt to connect
        console.error(`Mongoose connection ${cluster} error`, { error });
    });
    // If the connection throws an error
    connection.on('error', (error) => {
        console.error(`Mongoose connection ${cluster} error`, { error });
    });
    // When the connection is disconnected
    connection.on('disconnected', () => {
        console.info(`Mongoose connection ${cluster} disconnected`);
    });
    return connection;
};
exports.createConnection = createConnection

const getConnection = (cluster) => connections[cluster];
const setConnection = (cluster, connection) => (connections[cluster] = connection);

exports.getConnection = getConnection;
exports.setConnection = setConnection;
