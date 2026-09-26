import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, Permissions } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warns a user.')
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to warn.').setRequired(true)
  );

export async function execute(interaction, client) {
  const userService = client.database.UserService;

  if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    await interaction.reply({
      content: "You don't have permission to do that!",
      ephemeral: true,
    });
    return;
  }

  let data = await userService.fetchUser(interaction.user.id);
  if (!data.reputation) {
    data.reputation = -1;
  } else {
    data.reputation--;
  }

  await data.save();

  const user = interaction.options.getUser('user');
  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Warn!')
    .setDescription(`User warned: ${user.username}`);
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
