import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { Permissions } from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';
import moment from 'moment';


export const permission = new botPermissions()
  .setBotPerms([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS])
  .setBotMessage("It seems that I don't have permission to send messages or embed links!");

export const data = new SlashCommandBuilder()
  .setName('guildstats')
  .setDescription('Information about the current guild (server)');

export async function execute(interaction, client) {
  try {
    let createDate = await moment(interaction.guild.createdAt).format('MMMM Do YYYY, HH:mm:ss');

    let owner = await interaction.guild.fetchOwner();

    // Get the amount of text and voice channels
    let textChannels = await interaction.guild.channels.cache.filter((x) => x.type === 'GUILD_TEXT').size;
    let voiceChannels = await interaction.guild.channels.cache.filter((x) => x.type === 'GUILD_VOICE')
      .size;
    // Get the amount of categories
    let catCount = await interaction.guild.channels.cache.filter((x) => x.type === 'GUILD_CATEGORY').size;
    // Get the amount of role
    let roleCount = await interaction.guild.roles.cache.size;

    // Get server verification level
    let verifyLevel = await interaction.guild.verificationLevel.toLowerCase();
    verifyLevel = verifyLevel.charAt(0).toUpperCase() + verifyLevel.slice(1);
    // Get the amount of banned users
    let banCount = await interaction.guild.bans.fetch();

    const guildStatsEmbed = new MessageEmbed()
      .setColor('#2d4d58')
      .setTitle('Guild Stats')
      .setAuthor({
        name: interaction.guild.name,
        icon_url: interaction.guild.iconURL({ dynamic: true }),
      })
      .addFields(
        { name: `Server ID`, value: `${interaction.guild.id}`, inline: false },
        { name: `Verification Level`, value: `${verifyLevel}`, inline: true },
        { name: `Members`, value: `${interaction.guild.memberCount}`, inline: true },
        {
          name: `Server Owner`,
          value: `${owner.user} [${owner.user.id}]`,
          inline: true,
        },
        { name: `Guild Created`, value: `${createDate}`, inline: false },
        {
          name: `Channels [${textChannels + voiceChannels + catCount}]`,
          value: `Category: ${catCount}\nText: ${textChannels}\nVoice: ${voiceChannels}`,
          inline: true,
        },
        {
          name: `Roles`,
          value: `${roleCount}`,
          inline: true,
        },
        { name: `Bans`, value: `${banCount.size}`, inline: true },
        {
          name: `Server Boosts`,
          value: `Level: ${interaction.guild.premiumTier}\nAmount: ${
            interaction.guild.premiumSubscriptionCount || 0
          }`,
          inline: false,
        }
      );

    await interaction.reply({ embeds: [guildStatsEmbed] });
  } catch (err) {
    console.log(err);
    await interaction.reply({
      content: `An issue has occurred while running the command. If this error keeps occurring please contact our development team.`,
      ephemeral: true,
    });
  }
}
