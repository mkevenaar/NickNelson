import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';
import { BotColors } from '../../constants.js';

export const permission = new botPermissions()
  .setBotPerms([
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.EmbedLinks,
    PermissionsBitField.Flags.BanMembers,
  ])
  .setBotMessage(
    "It seems that I don't have permission to send messages, embed links or ban members!\nThese are required for this function to work"
  );

export const data = new SlashCommandBuilder()
  .setName('guildstats')
  .setDescription('Information about the current guild (server)');

export async function execute(interaction, client) {
  try {
    let createDate = Math.floor(interaction.guild.createdTimestamp / 1000);

    let owner = await interaction.guild.fetchOwner();

    // Get the amount of text and voice channels
    let textChannels = await interaction.guild.channels.cache.filter(
      (x) => x.type === ChannelType.GuildText
    ).size;
    let voiceChannels = await interaction.guild.channels.cache.filter(
      (x) => x.type === ChannelType.GuildVoice
    ).size;
    // Get the amount of categories
    let catCount = await interaction.guild.channels.cache.filter(
      (x) => x.type === ChannelType.GuildCategory
    ).size;
    // Get the amount of role
    let roleCount = await interaction.guild.roles.cache.size;

    // Get server verification level
    let verifyLevel = await interaction.guild.verificationLevel.toString().toLowerCase();
    verifyLevel = verifyLevel.charAt(0).toUpperCase() + verifyLevel.slice(1);
    // Get the amount of banned users
    let banCount = await interaction.guild.bans.fetch();

    let humanCount = interaction.guild.members.cache.filter((member) => !member.user.bot).size;
    let botCount = interaction.guild.members.cache.filter((member) => member.user.bot).size;

    const guildStatsEmbed = new EmbedBuilder()
      .setColor(BotColors.default)
      .setTitle('Guild Stats')
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .addFields(
        { name: `Server ID`, value: `${interaction.guild.id}`, inline: true },
        {
          name: `Server logo`,
          value: `[Click here!](${interaction.guild.iconURL({ dynamic: true })}?size=1024)`,
          inline: true,
        },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: `Verification Level`, value: `${verifyLevel}`, inline: true },
        {
          name: `Members`,
          value: `Total: ${interaction.guild.memberCount}\nHumans: ${humanCount}\nBots: ${botCount}`,
          inline: true,
        },
        {
          name: `Server Owner`,
          value: `${owner.user} [${owner.user.id}]`,
          inline: true,
        },
        { name: `Guild Created`, value: `<t:${createDate}:F>`, inline: false },
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
