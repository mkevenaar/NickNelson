require('dotenv').config();

const { Client, Collection, Intents } = require('discord.js');
const { TOKEN } = process.env;
const fs = require('fs');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Commands Setup
client.commands = new Collection();

const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.data.name, command);
});

// Executing commands
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
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

eventFiles.forEach((file) => {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
});

// Login
client.login(TOKEN);
