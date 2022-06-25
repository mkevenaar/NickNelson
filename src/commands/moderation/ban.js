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
  .setName('ban')
  .setDescription('Bans a Member from a Guild')
  .addUserOption((user) => {
    return user.setName('user').setDescription('User that needs to be banned').setRequired(true);
  })
  .addNumberOption((days) => {
    return days
      .setName('days')
      .setDescription(
        'Number of days of messages to delete, must be between 0 and 7, inclusive; default == 2'
      )
      .setRequired(false);
  })
  .addStringOption((reason) => {
    return reason.setName('reason').setDescription('The reason for the ban').setRequired(false);
  });

export async function execute(interaction) {
  let user = interaction.options.getUser('user');
  let days = interaction.options.getNumber('days');
  let reason = interaction.options.getString('reason');

  let banMember = await interaction.guild.members.fetch(user.id);

  if (isNaN(days)) {
    days = 2;
  }

  if (Number(days) >= 7) days = 7;
  if (Number(days) <= 0) days = 0;

  if (!reason) {
    reason = `NO REASON PROVIDED`;
  }

  const memberPosition = banMember.roles?.highest.rawPosition;
  const moderationPosition = interaction.member.roles?.highest.rawPosition;

  if (moderationPosition <= memberPosition) {
    let errorMessage = new MessageEmbed()
      .setColor(BotColors.failed)
      .setTitle('I cannot ban someone, who is above/equal to you');
    return interaction.reply({ embeds: [errorMessage], ephemeral: true });
  }

  if (!banMember.bannable) {
    let errorMessage = new MessageEmbed()
      .setColor(BotColors.failed)
      .setTitle('The Member is not bannable, sorry!');
    return interaction.reply({ embeds: [errorMessage], ephemeral: true });
  }

  try {
    if (!banMember.user.bot) {
      let banMessage = new MessageEmbed()
        .setColor(BotColors.default)
        .setTitle(`You got banned by ${interaction.user.tag} from ${interaction.guild.name}`)
        .setDescription(`Reason:\n> ${reason}`);
      await banMember.user.send({ embeds: [banMessage] }).catch((error) => {
        console.error(error);
        let errorMessage = new MessageEmbed()
          .setColor(BotColors.failed)
          .setTitle(`Could not DM the Reason to: ${banMember.user.tag}`)
          .setDescription(`${banMember.user}`);
        return interaction.reply({ embeds: [errorMessage], ephemeral: true });
      });
    }
  } catch (error) {
    console.error(error);
    let errorMessage = new MessageEmbed()
      .setColor(BotColors.failed)
      .setTitle(`Could not DM the Reason to: ${banMember.user.tag}`)
      .setDescription(`${banMember.user}`);
    return interaction.reply({ embeds: [errorMessage], ephemeral: true });
  }

  // Ban the member!
  try {
    banMember.ban({ days: days, reason: reason }).then(() => {
      let banResult = new MessageEmbed()
        .setColor(BotColors.default)
        .setTitle(`Banned ${banMember.user.tag} (${banMember.user.id})`)
        .setDescription(`Reason:\n> ${reason}`);

      return interaction.reply({ embeds: [banResult] }).catch((error) => {
        console.error(error);
      });
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: `An issue has occurred while running the command. If this error keeps occurring please contact our development team.`,
      ephemeral: true,
    });
  }
}
