import { SlashCommandBuilder } from '@discordjs/builders';
import {
  Permissions,
  MessageActionRow,
  MessageEmbed,
  MessageButton,
  MessageSelectMenu,
} from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';
import { BotColors, HelpUrls } from '../../constants.js';
import { findCategories } from '../../shared.js';

export const permission = new botPermissions()
  .setBotPerms([Permissions.FLAGS.SEND_MESSAGES])
  .setBotMessage("It seems that I don't have permission to send messages!");

export const data = new SlashCommandBuilder().setName('help').setDescription('Shows help');

export async function execute(interaction, client) {
  const help = new MessageEmbed()
    .setColor(BotColors.default)
    .addField('Help!', 'Please select a category below to continue');

  const selectRow = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('help')
      .setPlaceholder('Please select a category')
      .addOptions(await findCategories())
  );
  const buttonRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel('Support Server')
      .setEmoji('🆘')
      .setURL(HelpUrls.supportServer)
      .setStyle('LINK'),
    new MessageButton()
      .setLabel('Online help')
      .setEmoji('🌐')
      .setURL(HelpUrls.websiteUrl)
      .setStyle('LINK'),
    new MessageButton()
      .setLabel('Create Issue')
      .setEmoji('✍️')
      .setURL(HelpUrls.gitHubUrl)
      .setStyle('LINK'),
    new MessageButton()
      .setLabel('Add me to your server!')
      .setEmoji('🔗')
      .setURL(HelpUrls.inviteUrl)
      .setStyle('LINK')
  );
  await interaction.reply({ embeds: [help], components: [selectRow, buttonRow], ephemeral: true });
}
