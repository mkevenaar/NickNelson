import {
  SlashCommandBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  ButtonStyle,
} from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';
import { BotColors, HelpUrls } from '../../constants.js';
import { findCategories } from '../../shared.js';

export const permission = new botPermissions()
  .setBotPerms([PermissionsBitField.Flags.SendMessages])
  .setBotMessage("It seems that I don't have permission to send messages!");

export const data = new SlashCommandBuilder().setName('help').setDescription('Shows help');

export async function execute(interaction, client) {
  const help = new EmbedBuilder()
    .setColor(BotColors.default)
    .addFields([{ name: 'Help!', value: 'Please select a category below to continue' }]);

  const selectRow = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder()
      .setCustomId('help')
      .setPlaceholder('Please select a category')
      .addOptions(await findCategories())
  );
  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Support Server')
      .setEmoji('🆘')
      .setURL(HelpUrls.supportServer)
      .setStyle(ButtonStyle.Link),
    new ButtonBuilder()
      .setLabel('Online help')
      .setEmoji('🌐')
      .setURL(HelpUrls.websiteUrl)
      .setStyle(ButtonStyle.Link),
    new ButtonBuilder()
      .setLabel('Create Issue')
      .setEmoji('✍️')
      .setURL(HelpUrls.gitHubUrl)
      .setStyle(ButtonStyle.Link),
    new ButtonBuilder()
      .setLabel('Add me to your server!')
      .setEmoji('🔗')
      .setURL(HelpUrls.inviteUrl)
      .setStyle(ButtonStyle.Link)
  );
  await interaction.reply({ embeds: [help], components: [selectRow, buttonRow], ephemeral: true });
}
