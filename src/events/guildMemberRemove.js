import { EmbedBuilder } from 'discord.js';
import { BotColors, Constants } from '../constants.js';

export const name = 'guildMemberRemove';
export const once = false;

export async function execute(member, client) {
  const guildService = client.database.GuildService;
  try {
    let guild = member.guild;
    let guildData = await guildService.get(guild.id); // Get guild document from database

    // Ensure goodbye messages enabled
    const goodbyeProp = guildData?.addons?.goodbye;
    if (!goodbyeProp?.enabled) return;

    // Gather the data
    const channelId = goodbyeProp.channel;
    const goodbyeTitleProp = goodbyeProp.title;
    const goodbyeMessageProp = goodbyeProp.message;
    const goodbyeImage = goodbyeProp.image;

    // Try find the goodbye channel
    let goodbyeChannel = await client.tools.resolveChannel(channelId, guild);
    if (!goodbyeChannel) return; // Unable to find channel in guild

    // Get the custom title or use default
    let goodbyeTitle = !goodbyeTitleProp?.trim()?.length
      ? Constants.defaultGoodbyeTitle
      : goodbyeTitleProp.trim();
    // Get the custom message or use default
    let goodbyeMsg = !goodbyeMessageProp?.trim()?.length
      ? Constants.defaultGoodbyeMessage
      : goodbyeMessageProp.trim();

    // Replace all valid tags using regex
    let finalTitle = goodbyeTitle
      .replace(/{user.ping}/g, `${member.user}`)
      .replace(/{user.name}/g, `${member.user.username}`)
      .replace(/{user.id}/g, `${member.user.id}`)
      .replace(/{user.tag}/g, `${member.user.tag}`)
      .replace(/{guild.name}/g, `${guild.name}`)
      .replace(/{guild.id}/g, `${guild.id}`)
      .replace(/{guild.totalUser}/g, `${guild.memberCount}`);

    let finalMsg = goodbyeMsg
      .replace(/{user.ping}/g, `${member.user}`)
      .replace(/{user.name}/g, `${member.user.username}`)
      .replace(/{user.id}/g, `${member.user.id}`)
      .replace(/{user.tag}/g, `${member.user.tag}`)
      .replace(/{guild.name}/g, `${guild.name}`)
      .replace(/{guild.id}/g, `${guild.id}`)
      .replace(/{guild.totalUser}/g, `${guild.memberCount}`);

    const goodbyeEmbed = new EmbedBuilder()
      .setColor(BotColors.default)
      .setTitle(finalTitle)
      .setDescription(finalMsg);

    const trimmedImagePath = goodbyeImage?.trim();
    if (!!trimmedImagePath?.length) {
      goodbyeEmbed.setImage(trimmedImagePath);
    }

    return goodbyeChannel.send({ embeds: [goodbyeEmbed] });
  } catch (e) {
    console.log(e);
  }
}
