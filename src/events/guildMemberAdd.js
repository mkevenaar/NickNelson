const Discord = require('discord.js');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async execute(member, client) {
		try {
			let guild = member.guild;
			let guildData = await client.database.fetchGuild(guild.id); // Get guild document from database
			if (!guildData.addons.welcome.enabled) return; // Welcome messages aren't enabled

			let welcomeChannel = await client.tools.resolveChannel(guildData.addons.welcome.channel, guild); // Try find the welcome channel

			let welcomeTitle =
				guildData.addons.welcome.tite === null || guildData.addons.welcome.message === '' || guildData.addons.welcome.title === ' '
					? '** {user.name} ** is now a HeartStopper and member number **{guild.totalUser}**'
					: guildData.addons.welcome.title; // Get the custom title or use the preset one
			let welcomeMsg =
				guildData.addons.welcome.message === null || guildData.addons.welcome.message === '' || guildData.addons.welcome.message === ' '
					? 'Welcome {user.ping} to {guild.name}!'
					: guildData.addons.welcome.message; // Get the custom message or use the preset one

			// Replace all valid tags
			let finalTitle = await welcomeTitle
				.replace(/{user.ping}/g, `${member.user}`)
				.replace(/{user.name}/g, `${member.user.username}`)
				.replace(/{user.id}/g, `${member.user.id}`)
				.replace(/{user.tag}/g, `${member.user.tag}`)
				.replace(/{guild.name}/g, `${guild.name}`)
				.replace(/{guild.id}/g, `${guild.id}`)
				.replace(/{guild.totalUser}/g, `${guild.memberCount}`);

			let finalMsg = await welcomeMsg
				.replace(/{user.ping}/g, `${member.user}`)
				.replace(/{user.name}/g, `${member.user.username}`)
				.replace(/{user.id}/g, `${member.user.id}`)
				.replace(/{user.tag}/g, `${member.user.tag}`)
				.replace(/{guild.name}/g, `${guild.name}`)
				.replace(/{guild.id}/g, `${guild.id}`)
				.replace(/{guild.totalUser}/g, `${guild.memberCount}`);

			const welcomeEmbed = new Discord.MessageEmbed().setColor('#538079').setTitle(finalTitle).setDescription(finalMsg);

			if (!(guildData.addons.welcome.image === null || guildData.addons.welcome.image === '' || guildData.addons.welcome.image === ' ')) {
				welcomeEmbed.setImage(guildData.addons.welcome.image);
			}

			return welcomeChannel.send({ embeds: [welcomeEmbed] });
		} catch (e) {
			console.log(e);
		}
	},
};
