import { clearDatabase, closeDatabase, connect } from '../db-handler.js';
import { GuildService } from '../../src/database/guild.service.js';
import mongoose from 'mongoose';

let reactionService;
let guildService;

const mockCategory = {
  _id: mongoose.Types.ObjectId(),
  guildId: '123',
  name: 'My Category',
  registeredAt: Date.now(),
};

beforeAll(async () => {
  await connect();
  guildService = GuildService;
});
afterEach(async () => {
  await clearDatabase();
});
afterAll(async () => {
  await closeDatabase();
});

describe('GuildService', function () {
  it('Must be able to fetch a guild', async function () {
    const guild = await guildService.get('234');
    expect(guild).toBeTruthy();
  });
});
