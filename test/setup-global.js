import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function() {
  // Warm the MongoDB binary cache before suite hooks run. On a cold machine the
  // initial download can exceed Jest's per-hook timeout and fail otherwise.
  const mongoMemory = await MongoMemoryServer.create();
  await mongoMemory.stop();
}
