require('dotenv').config();

const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;
const util = require('util');
const readdir = util.promisify(fs.readdir);

async function init_commands() {
	// Command handling
	const commands = [];

	let folders = await readdir('./src/commands/');
	folders.forEach((direct) => {
		const commandFiles = fs.readdirSync('./src/commands/' + direct + '/').filter((file) => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./src/commands/${direct}/${file}`);
			commands.push(command.data.toJSON());
		}
	});
	// Publish commands
	const rest = new REST({ version: '9' }).setToken(TOKEN);

	// rest.get(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID))
	// 	.then(function(result) {
	// 		console.log(result);
	// 		result.forEach(command => {
	// 			rest.delete(Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, command.id))
	// 		});
	// 	})
	// 	.catch(console.error);

	// console.log(commands);

	rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);

	// rest.get(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID))
	// 	.then(function(result) {
	// 		console.log(result)
	// 	})
	// 	.catch(console.error);
}

init_commands();

process.on('unhandledRejection', (err) => {
	console.log('Unknown error occured:\n');
	console.log(err);
});
