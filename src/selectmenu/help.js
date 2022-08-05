import {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  ButtonStyle,
} from 'discord.js';
import { BotColors, HelpUrls } from '../constants.js';
import { findCategories, findCommandFiles } from '../shared.js';

export const data = { name: 'help' };

export async function execute(interaction, client) {
  await interaction.deferUpdate();

  const help = new EmbedBuilder().setColor(BotColors.default);

  const categories = await findCategories(interaction.values[0]);

  let myCategory = categories.filter((category) => category.default === true);

  help.addFields([{ name: myCategory[0].label, value: myCategory[0].description }]);

  let commands = (await findCommandFiles(true)).filter(
    (command) => command.group === interaction.values[0]
  );

  commands.forEach((command) => {
    const filteredOptions = command.options.filter(
      (option) => option.type === 1 || option.type === 2
    );
    if (filteredOptions.length) {
      filteredOptions.forEach((option) => {
        if (option.type === 1) {
          help.addFields([
            { name: `/${command.name} ${option.name}`, value: option.description, inline: true },
          ]);
        } else if (option.type === 2) {
          option.options.forEach((subOption) => {
            help.addFields([
              {
                name: `/${command.name} ${option.name} ${subOption.name}`,
                value: subOption.description,
                inline: true,
              },
            ]);
          });
        }
      });
    } else {
      help.addFields([{ name: `/${command.name}`, value: command.description, inline: true }]);
    }
  });

  const selectRow = new ActionRowBuilder().addComponents(
    new SelectMenuBuilder()
      .setCustomId('help')
      .setPlaceholder('Please select a category')
      .addOptions(categories)
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
  await interaction.editReply({ embeds: [help], components: [selectRow, buttonRow] });
}
