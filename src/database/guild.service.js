import { GuildModel } from './models/guild.js';

export class GuildService {
	/**
	 * Get or Create a Guild entry based on its ID
	 */
	static async fetchGuild(guildId) {
		let guildEntry = await GuildModel.findOne({ id: guildId });
		if (guildEntry) {
			return guildEntry;
		}

		guildEntry = new GuildModel({
			id: guildId,
			registeredAt: Date.now(),
		});
		await guildEntry.save().catch((err) => console.log(err));
		return guildEntry;
	}
}
