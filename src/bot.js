import { getEnvConfig } from './shared.js';
import { Client, Collection, Intents } from 'discord.js';
import mongoose from 'mongoose';
import { AutoPoster } from 'topgg-autoposter';
import { resolveChannel, convertTime } from './tools/tools.js';
import { Constants } from './constants.js';
import { readdirSync } from 'fs';
import { GuildService } from './database/guild.service.js';

const sourceFolder = Constants.sourceFolder;
const eventsFolder = Constants.eventsFolder;
const commandsFolder = Constants.commandsFolder;
const jsExt = Constants.jsExt;

/**
 * Creates the discord client with interface hooks
 * @returns {Client<boolean>}
 */
export function createDiscordClient() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MEMBERS,
    ],
  });
  client.commands = new Collection();
  client.database = {
    GuildService: GuildService,
  };
  client.tools = {
    convertTime,
    resolveChannel,
  };

  return client;
}

/**
 * Initiate the bot with hooks configured
 * @returns {Promise<void>}
 */
export async function initBot() {
  const { TOKEN, MONGODB, TOPGG_TOKEN } = getEnvConfig();
  const client = createDiscordClient();

  // Commands Setup
  let folders = readdirSync(`./${sourceFolder}/${commandsFolder}/`);
  for (const folder of folders) {
    const commandFiles = readdirSync(`${sourceFolder}/${commandsFolder}/${folder}/`).filter(
      (file) => file.endsWith(jsExt)
    );

    for (const file of commandFiles) {
      const command = await import(`./${commandsFolder}/${folder}/${file}`);
      await client.commands.set(command.data.name, command);
    }
  }

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
  const eventFiles = readdirSync(`./${sourceFolder}/${eventsFolder}`).filter((file) =>
    file.endsWith(jsExt)
  );

  for (const file of eventFiles) {
    const event = await import(`./${eventsFolder}/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  connectWithRetry(MONGODB);

  // Login
  await client.login(TOKEN);

  // Top.gg AutoPoster; only do this when we have a token setup
  if (TOPGG_TOKEN) {
    const poster = AutoPoster(TOPGG_TOKEN, client); // your discord.js or eris client

    // optional
    poster.on('posted', (stats) => {
      // ran when successfully posted
      console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
    });
  }
}

// Connect to the database
async function connectWithRetry(MONGODB) {
  return mongoose
    .connect(MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.log('Unable to connect to MongoDB Database.\nError: ' + err);
      setTimeout(connectWithRetry, 5000, MONGODB);
    });
}
