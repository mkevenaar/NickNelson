export const AppModes = {
    dev: "dev",
    purgeCommands: "purgeCommands",
    global: "global",
    guild: "guild"
};

const defaultDatabase = "NickNelson";

export const Constants = {
    defaultMongoString: `mongodb://localhost:27017/${defaultDatabase}`,
    sourceFolder: "src",
    commandsFolder: "commands",
    eventsFolder: "events",
    jsExt: ".js",
}

export const DefaultRestOptions = {version: '9'};
