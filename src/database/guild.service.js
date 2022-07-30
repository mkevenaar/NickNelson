import { GuildModel } from './models/guild.js';

export class GuildService {
  static async get(guildId) {
    const filter = { id: guildId };
    let guildEntry = await GuildModel.findOne(filter)

    if (!guildEntry) {
      guildEntry = await this.create(guildId);
    }
    return guildEntry;
  }

  static async create(guildId) {
    let guildEntry = new GuildModel({
      id: guildId,
      registeredAt: Date.now(),
    });
    await guildEntry.save();
    return guildEntry;
  }
}
