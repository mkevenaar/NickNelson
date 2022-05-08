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
