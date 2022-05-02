const guildSchema = require('./models/guild.js');

//Create/find Guilds Database
module.exports.fetchGuild = async function (key) {
	let guildDB = await guildSchema.findOne({ id: key });

	if (guildDB) {
		return guildDB;
	} else {
		guildDB = new guildSchema({
			id: key,
			registeredAt: Date.now(),
		});
		await guildDB.save().catch((err) => console.log(err));
		return guildDB;
	}
};
