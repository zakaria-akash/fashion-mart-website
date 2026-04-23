import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { assertServerEnv, serverEnv } from "@/lib/env";

const globalForMongoose = globalThis;

if (!globalForMongoose.__fashionMartMongoose) {
  globalForMongoose.__fashionMartMongoose = {
    connection: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  assertServerEnv();

  if (globalForMongoose.__fashionMartMongoose.connection) {
    return globalForMongoose.__fashionMartMongoose.connection;
  }

  if (!globalForMongoose.__fashionMartMongoose.promise) {
    globalForMongoose.__fashionMartMongoose.promise = mongoose.connect(serverEnv.mongodbUri, {
      dbName: serverEnv.mongodbDbName,
      bufferCommands: false,
    });
  }

  globalForMongoose.__fashionMartMongoose.connection =
    await globalForMongoose.__fashionMartMongoose.promise;

  return globalForMongoose.__fashionMartMongoose.connection;
}

export async function getMongoDatabase() {
  const connection = await connectToDatabase();
  return connection.connection.db;
}

export async function getGridFSBucket(bucketName = serverEnv.gridfsProductBucket) {
  const database = await getMongoDatabase();
  return new GridFSBucket(database, { bucketName });
}
