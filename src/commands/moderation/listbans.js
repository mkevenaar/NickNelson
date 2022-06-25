import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions } from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';

export const permission = new botPermissions()
  .setUserPerms(Permissions.FLAGS.BAN_MEMBERS)
  .setUserMessage("You don't have permission to ban members!")
  .setBotPerms(Permissions.FLAGS.BAN_MEMBERS)
  .setBotMessage("It seems that I don't have permission ban members!");

export const data = new SlashCommandBuilder()
  .setName('listbans')
  .setDescription('Shows all Bans of the Guild');

export async function execute(interaction, client) {
  let allBans = await interaction.guild.bans
    .fetch()
    .then((bans) =>
      bans.map(
        (ban) =>
          `**${ban.user.username}**#${ban.user.discriminator} (\`${
            ban.user.id
          }\`)\n**Reason**:\n> ${ban.reason ? ban.reason : 'No Reason'}\n`
      )
    );
  client.tools.swapPages(client, interaction, allBans, `All Bans of **${interaction.guild.name}**`);
}
