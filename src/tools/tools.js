import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import { BotColors } from '../constants.js';

export async function resolveChannel(search, guild) {
  let channel = null;
  if (!search || typeof search !== 'string') return;
  //Try to search using ID
  if (search.match(/^#&!?(\d+)$/)) {
    let id = search.match(/^#&!?(\d+)$/)[1];
    channel = guild.channels.cache.get(id);
    if (channel) return channel;
  }

  if (search.includes('<#')) {
    let firstChannel = search.replace('<#', '');
    let channelID = firstChannel.replace('>', '');
    let channel = guild.channels.cache.get(channelID);
    if (channel) return channel;
  }

  channel = guild.channels.cache.find((c) => search.toLowerCase() === c.name.toLowerCase());
  if (channel) return channel;

  channel = guild.channels.cache.get(search);
  return channel;
}

export async function convertTime(milliseconds) {
  let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
  let days = roundTowardsZero(milliseconds / 86400000),
    hours = roundTowardsZero(milliseconds / 3600000) % 24,
    mins = roundTowardsZero(milliseconds / 60000) % 60,
    secs = roundTowardsZero(milliseconds / 1000) % 60;
  if (secs === 0) {
    secs++;
  }
  let laDays = days > 0,
    laHours = hours > 0,
    laMinutes = mins > 0;
  let pattern =
    (!laDays ? '' : laMinutes || laHours ? '{days} days, ' : '{days} days & ') +
    (!laHours ? '' : laMinutes ? '{hours} hours, ' : '{hours} hours & ') +
    (!laMinutes ? '' : '{mins} mins') +
    ' {secs} seconds';
  let sentence = pattern
    .replace('{duration}', pattern)
    .replace('{days}', days)
    .replace('{hours}', hours)
    .replace('{mins}', mins)
    .replace('{secs}', secs);
  return sentence;
}

export async function swapPages(client, message, description, TITLE) {

  //has the interaction already been deferred? If not, defer the reply.
  if (message.deferred == false) {
    await message.deferReply();
  }

  let swapUser = message.member;

  let currentPage = 0;
  //GET ALL EMBEDS
  let embeds = [];
  //if input is an array
  if (Array.isArray(description)) {
    try {
      let k = 20;
      for (let i = 0; i < description.length; i += 20) {
        const current = description.slice(i, k);
        k += 20;
        const embed = new MessageEmbed()
          .setDescription(current.join('\n'))
          .setTitle(TITLE)
          .setColor(BotColors.default);
        embeds.push(embed);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      let k = 1000;
      for (let i = 0; i < description.length; i += 1000) {
        const current = description.slice(i, k);
        k += 1000;
        const embed = new MessageEmbed()
          .setDescription(current)
          .setTitle(TITLE)
          .setColor(BotColors.default);
        embeds.push(embed);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (embeds.length === 0) {
    let embed = new MessageEmbed().setTitle(`No Content`).setColor(BotColors.default);
    return message.reply({ embeds: [embed] });
  }
  if (embeds.length === 1) return message.reply({ embeds: [embeds[0]] });

  let button_back = new MessageButton()
    .setStyle('SUCCESS')
    .setCustomId('1')
    .setEmoji('⬅️')
    .setLabel('Back');
  let button_home = new MessageButton()
    .setStyle('DANGER')
    .setCustomId('2')
    .setEmoji('🏠')
    .setLabel('Home');
  let button_forward = new MessageButton()
    .setStyle('SUCCESS')
    .setCustomId('3')
    .setEmoji('➡️')
    .setLabel('Forward');
  let button_stop = new MessageButton()
    .setStyle('DANGER')
    .setCustomId('stop')
    .setEmoji('🛑')
    .setLabel('Stop');
  const allButtons = [
    new MessageActionRow().addComponents([
      button_back,
      button_home,
      button_forward,
      button_stop,
    ]),
  ];
  //Send message with buttons
  let swapMsg = await message.reply({
    content: `***Click on the __Buttons__ to swap the Pages***`,
    embeds: [embeds[0]],
    components: allButtons,
    fetchReply: true,
    ephemeral: true,
  });
  //create a collector for the thingy
  const collector = swapMsg.createMessageComponentCollector({
    filter: (i) =>
      i?.isButton() &&
      i?.user &&
      i?.user.id == swapUser.id &&
      i?.message.member.id == client.user.id,
    time: 180e3,
  }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async (b) => {
    if (b?.user.id !== message.member.id)
      return b?.reply({
        content: `**Only the one who used this command is allowed to react!**`,
        ephemeral: true,
      });
    //page forward
    if (b?.customId == '1') {
      collector.resetTimer();
      //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage !== 0) {
        currentPage -= 1;
        await swapMsg
          .edit({
            embeds: [embeds[currentPage]],
            components: getDisabledComponents[swapMsg.components],
          })
          .catch(() => {});
        await b?.deferUpdate();
      } else {
        currentPage = embeds.length - 1;
        await swapMsg
          .edit({
            embeds: [embeds[currentPage]],
            components: getDisabledComponents[swapMsg.components],
          })
          .catch(() => {});
        await b?.deferUpdate();
      }
    }
    //go home
    else if (b?.customId == '2') {
      collector.resetTimer();
      //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
      currentPage = 0;
      await swapMsg
        .edit({
          embeds: [embeds[currentPage]],
          components: getDisabledComponents[swapMsg.components],
        })
        .catch(() => {});
      await b?.deferUpdate();
    }
    //go forward
    else if (b?.customId == '3') {
      collector.resetTimer();
      //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
      if (currentPage < embeds.length - 1) {
        currentPage++;
        await swapMsg
          .edit({
            embeds: [embeds[currentPage]],
            components: getDisabledComponents[swapMsg.components],
          })
          .catch(() => {});
        await b?.deferUpdate();
      } else {
        currentPage = 0;
        await swapMsg
          .edit({
            embeds: [embeds[currentPage]],
            components: getDisabledComponents[swapMsg.components],
          })
          .catch(() => {});
        await b?.deferUpdate();
      }
    }
    //go forward
    else if (b?.customId == 'stop') {
      await swapMsg
        .edit({
          embeds: [embeds[currentPage]],
          components: getDisabledComponents(swapMsg.components),
        })
        .catch(() => {});
      await b?.deferUpdate();
      collector.stop('stopped');
    }
  });
  collector.on('end', (reason) => {
    if (reason != 'stopped') {
      swapMsg
        .edit({
          embeds: [embeds[currentPage]],
          components: getDisabledComponents(swapMsg.components),
        })
        .catch(() => {});
    }
  });
}

function getDisabledComponents(MessageComponents) {
  if (!MessageComponents) return []; // Returning so it doesn't crash
  return MessageComponents.map(({ components }) => {
    return new MessageActionRow().addComponents(components.map((c) => c.setDisabled(true)));
  });
}
