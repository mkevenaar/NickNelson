import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions } from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';

export const permission = new botPermissions()
  .setUserPerms(Permissions.FLAGS.ADMINISTRATOR)
  .setUserMessage("You don't have permission configure the goodbye message!")
  .setBotPerms([Permissions.FLAGS.SEND_MESSAGES])
  .setBotMessage("It seems that I don't have permission to send messages!");

export const data = new SlashCommandBuilder()
  .setName('goodbye')
  .setDescription('Sets the goodbye message (admin only)')
  .addChannelOption((channel) => {
    return channel
      .setName('channel')
      .setDescription('Channel you want Nick to send the goodbye message in')
      .setRequired(false);
  })
  .addStringOption((title) => {
    return title
      .setName('title')
      .setDescription('Title of the goodbye message you want Nick to respond with')
      .setRequired(false);
  })
  .addStringOption((message) => {
    return message
      .setName('body')
      .setDescription('Body of the goodbye message you want Nick to respond with')
      .setRequired(false);
  })
  .addStringOption((url) => {
    return url
      .setName('image')
      .setDescription('Image of the goodbye message you want Nick to respond with')
      .setRequired(false);
  })
  .addBooleanOption((enable) => {
    return enable
      .setName('enable')
      .setDescription('Enable (true) or disable (false) the goodbye message, default disabled')
      .setRequired(false);
  });

export async function execute(interaction, client) {
  const guildService = client.database.GuildService;

  const channel = interaction.options.getChannel('channel');
  const title = interaction.options.getString('title');
  const message = interaction.options.getString('body');
  const image = interaction.options.getString('image');
  const enable = interaction.options.getBoolean('enable');

  let data = await guildService.fetchGuild(interaction.guild.id);

  // If addon for goodbye is missing create it
  if (!data.addons.goodbye) {
    data.addons.goodbye = {
      enabled: false,
      channel: '',
      title: '',
      message: '',
      image: false,
      embed: false,
    };
    data.markModified('addons.goodbye');
    await data.save();
  }

  if (typeof enable === 'boolean') {
    data.addons.goodbye.enabled = enable;
    data.markModified('addons.goodbye');
    await data.save();
  }

  if (!!channel?.id) {
    if (channel.type !== 'GUILD_TEXT') {
      return await interaction.reply({
        content: 'Only text channels are allowed',
        ephemeral: true,
      });
    }
    data.addons.goodbye.channel = channel.id;
    data.markModified('addons.goodbye');
    await data.save();
  }

  if (!!image?.length) {
    data.addons.goodbye.image = image;
    data.markModified('addons.goodbye');
    await data.save();
  }

  if (!!title?.length) {
    data.addons.goodbye.title = title;
    data.markModified('addons.goodbye');
    await data.save();
  }

  if (!!message?.length) {
    data.addons.goodbye.message = message;
    data.markModified('addons.goodbye');
    await data.save();
  }

  await interaction.reply({ content: 'Settings saved!', ephemeral: true });
}
