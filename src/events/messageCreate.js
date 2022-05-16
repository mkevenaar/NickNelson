import { DevBots, DevEmoji, ProdEmoji } from '../constants.js';

export const name = 'messageCreate';
export const once = false;

export async function execute(message, client) {
  if (message.mentions.has(client.user, { ignoreRoles: true, ignoreEveryone: true })) {
    let emoji = ProdEmoji;
    if (DevBots.includes(client.user.id)) {
      emoji = DevEmoji;
    }
    message.react(emoji);
  }
}
