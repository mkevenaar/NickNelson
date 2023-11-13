import { EmbedBuilder } from 'discord.js';
import { BotColors, Constants } from '../constants.js';

export const name = 'guildMemberAdd';
export const once = false;

export async function execute(member, client) {
  const guildService = client.database.GuildService;
  try {
    let guild = member.guild;
    let guildData = await guildService.get(guild.id); // Get guild document from database

    // Ensure welcome messages enabled
    const welcomeProp = guildData?.addons?.welcome;
    if (!welcomeProp?.enabled) return;

    // Gather the data
    const channelId = welcomeProp.channel;
    const welcomeTitleProp = welcomeProp.title;
    const welcomeMessageProp = welcomeProp.message;
    const welcomeImage = welcomeProp.image;

    // Try find the welcome channel
    let welcomeChannel = await client.tools.resolveChannel(channelId, guild);
    if (!welcomeChannel) return; // Unable to find channel in guild

    // Get the custom title or use default
    let welcomeTitle = !welcomeTitleProp?.trim()?.length
      ? Constants.defaultWelcomeTitle
      : welcomeTitleProp.trim();
    // Get the custom message or use default
    let welcomeMsg = !welcomeMessageProp?.trim()?.length
      ? Constants.defaultWelcomeMessage
      : welcomeMessageProp.trim();

    // Replace all valid tags using regex
    let finalTitle = welcomeTitle
      .replace(/{user.ping}/g, `${member.user}`)
      .replace(/{user.name}/g, `${member.user.username}`)
      .replace(/{user.id}/g, `${member.user.id}`)
      .replace(/{user.tag}/g, `${member.user.tag}`)
      .replace(/{guild.name}/g, `${guild.name}`)
      .replace(/{guild.id}/g, `${guild.id}`)
      .replace(/{guild.totalUser}/g, `${guild.memberCount}`);

    let finalMsg = welcomeMsg
      .replace(/{user.ping}/g, `${member.user}`)
      .replace(/{user.name}/g, `${member.user.username}`)
      .replace(/{user.id}/g, `${member.user.id}`)
      .replace(/{user.tag}/g, `${member.user.tag}`)
      .replace(/{guild.name}/g, `${guild.name}`)
      .replace(/{guild.id}/g, `${guild.id}`)
      .replace(/{guild.totalUser}/g, `${guild.memberCount}`);

    const welcomeEmbed = new EmbedBuilder().setColor(BotColors.default).setTitle(finalTitle);
    // .setDescription(finalMsg);

    const trimmedImagePath = welcomeImage?.trim();
    if (!!trimmedImagePath?.length) {
      welcomeEmbed.setImage(trimmedImagePath);
    }

    return welcomeChannel.send({
      content: finalMsg,
      embeds: [welcomeEmbed],
      // allowedMentions: { users: [`${member.user}`] },
    });
  } catch (e) {
    console.log(e);
  }
}
