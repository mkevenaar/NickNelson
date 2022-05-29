import { MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } from 'discord.js';
import { BotColors, HelpUrls } from '../constants.js';
import { findCategories, findCommandFiles } from '../shared.js';

export const data = { name: 'help' };

export async function execute(interaction, client) {
  await interaction.deferUpdate();

  const help = new MessageEmbed().setColor(BotColors.default);

  const categories = await findCategories(interaction.values[0]);

  let myCategory = categories.filter((category) => category.default === true);

  help.addField(myCategory[0].label, myCategory[0].description);

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
          help.addField(`/${command.name} ${option.name}`, option.description, true);
        } else if (option.type === 2) {
          option.options.forEach((subOption) => {
            help.addField(
              `/${command.name} ${option.name} ${subOption.name}`,
              subOption.description,
              true
            );
          });
        }
      });
    } else {
      help.addField(`/${command.name}`, command.description, true);
    }
  });

  const selectRow = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('help')
      .setPlaceholder('Please select a category')
      .addOptions(categories)
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
  await interaction.editReply({ embeds: [help], components: [selectRow, buttonRow] });
}
