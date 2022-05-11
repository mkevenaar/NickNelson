import { configure, getEnvConfig, processArgs } from './shared.js';
import { deployCommands, purgeCommands } from './bot-commands.js';
import { AppModes } from './constants.js';
import { initBot } from './bot.js';

// Command-line processing
const argv = processArgs();
console.log('Starting in mode:', argv.mode);
// Configure environment
configure();

const { CLIENT_ID, GUILD_ID } = getEnvConfig();
if (!CLIENT_ID) throw new Error('Please specify a valid CLIENT_ID');

switch (argv.mode) {
  case AppModes.guild:
    if (!GUILD_ID) throw new Error('Please specify a valid guildId to purge with GUILD_ID');

    await deployCommands(CLIENT_ID, GUILD_ID);
    break;
  case AppModes.purgeCommands:
    if (!GUILD_ID) throw new Error('Please specify a guildId to purge with GUILD_ID');

    await purgeCommands(CLIENT_ID, GUILD_ID);
    break;
  case AppModes.purgeGlobalCommands:
    await purgeCommands(CLIENT_ID);
    break;
  case AppModes.global:
    await deployCommands(CLIENT_ID);
    break;
  case AppModes.dev:
  default:
    // do not await here, just start the bot, sometimes it takes a while...
    deployCommands(CLIENT_ID);
    // Only here do we init the bot
    await initBot();
    break;
}
