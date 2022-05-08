export const AppModes = {
  dev: 'dev',
  purgeCommands: 'purgeCommands',
  purgeGlobalCommands: 'purgeGlobalCommands',
  global: 'global',
  guild: 'guild',
};

const defaultDatabase = 'NickNelson';

export const Constants = {
  defaultMongoString: `mongodb://localhost:27017/${defaultDatabase}`,
  sourceFolder: 'src',
  commandsFolder: 'commands',
  eventsFolder: 'events',
  jsExt: '.js',
  defaultWelcomeTitle:
    '** {user.name} ** is now a HeartStopper and member number **{guild.totalUser}**',
  defaultWelcomeMessage: 'Welcome {user.ping} to {guild.name}!',
};

export const DefaultRestOptions = { version: '9' };
