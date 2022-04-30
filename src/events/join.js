const Discord = require('discord.js');

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async execute(member) {
		const welcomeEmbed = new Discord.MessageEmbed()
			.setColor('#538079')
			.setTitle('**' + member.user.username + '** is now a HeartStopper together with **' + member.guild.memberCount + '** other fans')
			.setDescription('Some description here')
			.setImage('https://aliceoseman.com/wp-content/uploads/2022/04/HEARTSTOPPER-A.jpg');

		member.guild.channels.cache.find((i) => i.name === 'general').send({ embeds: [welcomeEmbed] });
	},
};
