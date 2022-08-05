import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { botPermissions } from '../../tools/botPermissions.js';

export const permission = new botPermissions()
  .setBotPerms([PermissionsBitField.Flags.SendMessages])
  .setBotMessage("It seems that I don't have permission to send messages!");

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export async function execute(interaction) {
  await interaction.reply('Pong!');
}
