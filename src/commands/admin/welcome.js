import {SlashCommandBuilder} from "@discordjs/builders";
import {Permissions} from "discord.js";

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
            .setDescription(
                'Enable (true) or disable (false) the welcome message, default enabled'
            )
            .setRequired(false);
    });

export async function execute(interaction, client) {
    const guildService = client.database.GuildService;

    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        await interaction.reply({
            content: "You don't have permission to do that!",
            ephemeral: true,
        });
        return;
    }

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

    if (typeof enable !== 'undefined' && enable !== null) {
        data.addons.welcome.enabled = enable;
        data.markModified('addons.welcome');
        await data.save();
    }

    if (typeof channel !== 'undefined' && channel !== null) {
        data.addons.welcome.channel = channel.id;
        data.markModified('addons.welcome');
        await data.save();
    }

    if (typeof image !== 'undefined' && image !== null) {
        data.addons.welcome.image = image;
        data.markModified('addons.welcome');
        await data.save();
    }

    if (typeof title !== 'undefined' && title !== null) {
        data.addons.welcome.title = title;
        data.markModified('addons.welcome');
        await data.save();
    }

    if (typeof message !== 'undefined' && message !== null) {
        data.addons.welcome.message = message;
        data.markModified('addons.welcome');
        await data.save();
    }

    await interaction.reply({content: 'Settings saved!', ephemeral: true});
};
