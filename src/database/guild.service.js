import {GuildModel} from "./models/guild.js";

/**
 * Get or Create a Guild entry based on its ID
 */
export async function fetchGuild(guildId) {
    let guildEntry = await GuildModel.findOne({id: guildId});
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
