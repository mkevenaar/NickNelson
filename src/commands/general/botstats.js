import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('botstats')
	.setDescription('Information about the current statistics of the bot');

export async function execute(interaction, client) {
	try {
		let uptime = await client.tools.convertTime(client.uptime);
		const memory = process.memoryUsage();
		let ram = (memory.heapUsed / 1024 / 1024 + memory.heapTotal / 1024 / 1024).toFixed(2);

		const botStatsEmbed = new MessageEmbed()
			.setColor('#538079')
			.setTitle('Botstats')
			.setDescription('Botstats')
			.addFields(
				{ name: 'Developers', value: '```Dyrant#4095, Ludoviko#0001, davidzwa#6298```' },
				{
					name: 'Channels',
					value: `\`\`\`${client.channels.cache.size}\`\`\``,
					inline: true,
				},
				{ name: 'Users', value: `\`\`\`${client.users.cache.size}\`\`\``, inline: true },
				{ name: 'Guilds', value: `\`\`\`${client.guilds.cache.size}\`\`\``, inline: true },
				{ name: 'RAM usage', value: `\`\`\`${ram}MB\`\`\``, inline: true },
				{ name: 'API latency', value: `\`\`\`${client.ws.ping} ms\`\`\``, inline: true },
				{ name: 'Uptime', value: `\`\`\`${uptime}\`\`\`` }
			);

		await interaction.reply({ embeds: [botStatsEmbed] });
	} catch (err) {
		console.log(err);
		await interaction.reply({
			content: `An issue has occurred while running the command. If this error keeps occurring please contact our development team.`,
			ephemeral: true,
		});
	}
}
