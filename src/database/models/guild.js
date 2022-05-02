const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    id: {type: String}, //ID of the guild
    registeredAt: {type: Number, default: Date.now()},

    addons: {
        type: Object,
        default: {
            // Extra features data
            welcome: {
                enabled: true, // Welcome features are enabled
                channel: null, // ID for the channel to send messages to
                title: null, // Custom title
                message: null, // Custom message
                image: null, // URL of image
            },
            goodbye: {
                enabled: true, // Goodbye features are enabled
                channel: null, // ID for channel to send messages to
                title: null, // Custom title
                message: null, // Custom message
                image: null, // URL of image
            },
        },
    },
});

export const GuildModel = mongoose.model('guild', GuildSchema);
