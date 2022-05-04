import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoMemory;

/**
 * Connect to the in-memory database.
 */
export async function connect() {
	mongoMemory = await MongoMemoryServer.create();
	const uri = mongoMemory.getUri();

	const mongooseOpts = {};
	await mongoose.connect(uri, mongooseOpts);
}

/**
 * Drop database, close the connection and stop mongoMemory.
 */
export async function closeDatabase() {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongoMemory.stop();
}

/**
 * Remove all the data for all db collections.
 */
export async function clearDatabase() {
	const collections = mongoose.connection.collections;

	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany();
	}
}
