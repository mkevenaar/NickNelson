import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, Permissions } from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';
import { BotColors } from '../../constants.js';

export const permission = new botPermissions()
  .setUserPerms(Permissions.FLAGS.BAN_MEMBERS)
  .setUserMessage("You don't have permission to ban members!")
  .setBotPerms(Permissions.FLAGS.BAN_MEMBERS)
  .setBotMessage("It seems that I don't have permission ban members!");

export const data = new SlashCommandBuilder()
  .setName('unban')
  .setDescription('Removes a ban from a Member in this Guild')
  .addUserOption((user) => {
    return user.setName('user').setDescription('User that needs to be unbanned').setRequired(true);
  });

export async function execute(interaction) {
  let user = interaction.options.getUser('user');

  let bans = await interaction.guild.bans.fetch().catch(() => {});
  if (!bans.map((b) => b?.user.id).includes(user.id)) {
    let errorMessage = new MessageEmbed()
      .setColor(BotColors.failed)
      .setTitle('The User with that Id is not banned in this Server!');
    return interaction.reply({ embeds: [errorMessage], ephemeral: true });
  }

  try {
    let banUser = bans.map((b) => b?.user).find((u) => u.id == user.id);
    interaction.guild.members.unban(banUser ? banUser.id : user.id);
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(BotColors.default)
          .setTitle(`Successfully Unbanned ${banUser.username}#${banUser.discriminator}`)
          .setDescription(`Use: /listbans to see all ${bans.size - 1} Bans!`),
      ],
    });
  } catch (error) {
    console.error(error);
    let errorMessage = new MessageEmbed()
      .setColor(BotColors.failed)
      .setTitle(`Could unban: ${banMember.user.tag}`)
      .setDescription(`${banMember.user}`);
    return interaction.reply({ embeds: [errorMessage], ephemeral: true });
  }
}
