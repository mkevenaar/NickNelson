require('dotenv').config();

const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, TOKEN } = process.env;
const util = require('util');
const readdir = util.promisify(fs.readdir);


async function init_commands(){
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

	rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
		.then(() => console.log('Successfully registered global application commands.'))
		.catch(console.error);
};

init_commands();

process.on('unhandledRejection', err =>{
    console.log('Unknown error occured:\n')
    console.log(err)
})