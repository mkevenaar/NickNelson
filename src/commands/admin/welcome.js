import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions } from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';

export const permission = new botPermissions()
  .setUserPerms(Permissions.FLAGS.ADMINISTRATOR)
  .setUserMessage("You don't have permission configure the welcome message!")
  .setBotPerms([Permissions.FLAGS.SEND_MESSAGES])
  .setBotMessage("It seems that I don't have permission to send messages!");

export const data = new SlashCommandBuilder()
  .setName('welcome')
  .setDescription('Sets the welcome message (admin only)')
  .addChannelOption((channel) => {
    return channel
      .setName('channel')
      .setDescription('Channel you want Nick to send the welcome message in')
      .setRequired(false);
  })
  .addStringOption((title) => {
    return title
      .setName('title')
      .setDescription('Title of the welcome message you want Nick to respond with')
      .setRequired(false);
  })
  .addStringOption((message) => {
    return message
      .setName('body')
      .setDescription('Body of the welcome message you want Nick to respond with')
      .setRequired(false);
  })
  .addStringOption((url) => {
    return url
      .setName('image')
      .setDescription('Image of the welcome message you want Nick to respond with')
      .setRequired(false);
  })
  .addBooleanOption((enable) => {
    return enable
      .setName('enable')
      .setDescription('Enable (true) or disable (false) the welcome message, default disabled')
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

  // If addon for welcome is missing create it
  if (!data.addons.welcome) {
    data.addons.welcome = {
      enabled: true,
      channel: '',
      title: '',
      message: '',
      image: false,
      embed: false,
    };
    data.markModified('addons.welcome');
    await data.save();
  }

  if (typeof enable === 'boolean') {
    data.addons.welcome.enabled = enable;
    data.markModified('addons.welcome');
    await data.save();
  }

  if (!!channel?.id) {
    if (channel.type !== 'GUILD_TEXT') {
      return await interaction.reply({
        content: 'Only text channels are allowed',
        ephemeral: true,
      });
    }
    data.addons.welcome.channel = channel.id;
    data.markModified('addons.welcome');
    await data.save();
  }

  if (!!image?.length) {
    data.addons.welcome.image = image;
    data.markModified('addons.welcome');
    await data.save();
  }

  if (!!title?.length) {
    data.addons.welcome.title = title;
    data.markModified('addons.welcome');
    await data.save();
  }

  if (!!message?.length) {
    data.addons.welcome.message = message;
    data.markModified('addons.welcome');
    await data.save();
  }

  await interaction.reply({ content: 'Settings saved!', ephemeral: true });
}
