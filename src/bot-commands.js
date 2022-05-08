import { findCommandFiles, getRestInstance } from './shared.js';
import { Routes } from 'discord-api-types/v9';

/**
 * Purge all guild specific commands
 * @param {string} clientId provide the clientId to purge commands for
 * @param {string} guildId filter on specifically a guild with its ID
 * @returns {Promise<void>}
 */
export async function purgeCommands(clientId, guildId = null) {
  const restClient = getRestInstance();
  if (!guildId) {
    restClient
      .get(Routes.applicationCommands(clientId))
      .then(function (result) {
        console.log(result);
        result.forEach((command) => {
          restClient.delete(Routes.applicationCommand(clientId, command.id));
        });
      })
      .catch(console.error);
  } else {
    restClient
      .get(Routes.applicationGuildCommands(clientId, guildId))
      .then(function (result) {
        console.log(result);
        result.forEach((command) => {
          restClient.delete(Routes.applicationGuildCommand(clientId, guildId, command.id));
        });
      })
      .catch(console.error);
  }
}

/**
 * Deploy the commands globally for all guilds or a specific guild ID
 * @param clientId specify the client to identify with
 * @param guildId filter on a specific guildId
 * @returns {Promise<void>}
 */
export async function deployCommands(clientId, guildId = null) {
  const commands = await findCommandFiles();

  // Publish commands
  const restClient = getRestInstance();
  if (!guildId) {
    await restClient
      .put(Routes.applicationCommands(clientId), { body: commands })
      .then(() => console.log('Successfully registered global application commands.'))
      .catch(console.error);
  } else {
    await restClient
      .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error);
  }
}
