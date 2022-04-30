require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CLIENT_ID, TOKEN } = process.env;

const fs = require('fs');

// Command handling
const commands = [];

const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
	const command = require(`./src/commands/${file}`);
	commands.push(command.data.toJSON());
});

// Publish commands
const rest = new REST({ version: '9' }).setToken(TOKEN);

rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
	.then(() => console.log('Successfully registered global application commands.'))
	.catch(console.error);
