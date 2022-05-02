require('dotenv').config();

// Deploy commands on startup
require('./deploy-commands.js');

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { TOKEN, MONGODB } = process.env;
const util = require('util');
const readdir = util.promisify(fs.readdir);
const mongoose = require('mongoose');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});
client.commands = new Collection();
client.database = require('./database/mongoose.js');
client.tools = require('./tools/tools.js');

async function init() {
	// Commands Setup
	let folders = await readdir('./src/commands/');
	folders.forEach((direct) => {
		const commandFiles = fs
			.readdirSync('./src/commands/' + direct + '/')
			.filter((file) => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./commands/${direct}/${file}`);
			client.commands.set(command.data.name, command);
		}
	});

	// Executing commands
	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction, client);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	});

	// Events setup
	const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));

	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}

	// Connect to the database
	mongoose
		.connect(MONGODB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('Connected to MongoDB');
		})
		.catch((err) => {
			console.log('Unable to connect to MongoDB Database.\nError: ' + err);
		});

	// Login
	await client.login(TOKEN);
}

init();

process.on('unhandledRejection', (err) => {
	console.log('Unknown error occurred:\n');
	console.log(err);
});
