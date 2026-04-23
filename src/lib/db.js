import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { assertServerEnv, serverEnv } from "@/lib/env";

/**
 * Database connection state management for serverless environments.
 * Prevents multiple concurrent connections in Next.js dev/production.
 */
const globalForMongoose = globalThis;

if (!globalForMongoose.__fashionMartMongoose) {
  globalForMongoose.__fashionMartMongoose = {
    connection: null,
    promise: null,
  };
}

/**
 * Establishes or retrieves the Mongoose connection to MongoDB.
 * Ensures environment variables are validated before connecting.
 */
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

/**
 * Retrieves the raw MongoDB database instance for direct operations.
 */
export async function getMongoDatabase() {
  const connection = await connectToDatabase();
  return connection.connection.db;
}

/**
 * Retrieves a GridFS bucket for streaming file storage.
 * Defaults to the configured product image bucket.
 */
export async function getGridFSBucket(bucketName = serverEnv.gridfsProductBucket) {
  const database = await getMongoDatabase();
  return new GridFSBucket(database, { bucketName });
}
