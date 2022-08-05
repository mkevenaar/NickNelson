export const AppModes = {
  dev: 'dev',
  global: 'global',
  guild: 'guild',
  purgeCommands: 'purgeCommands',
  purgeGlobalCommands: 'purgeGlobalCommands',
};

const defaultDatabase = 'NickNelson';

export const Constants = {
  defaultMongoString: `mongodb://localhost:27017/${defaultDatabase}`,
  sourceFolder: 'src',
  commandsFolder: 'commands',
  selectMenuFolder: 'selectmenu',
  eventsFolder: 'events',
  jsExt: '.js',
  defaultWelcomeTitle:
    '** {user.name} ** is now a HeartStopper and member number **{guild.totalUser}**',
  defaultWelcomeMessage: 'Welcome {user.ping} to {guild.name}!',
  defaultGoodbyeTitle:
    '** {user.name} ** has left the guild, we now have **{guild.totalUser}** members',
  defaultGoodbyeMessage: 'Goodbye {user.name}!',
};

export const DefaultRestOptions = { version: '10' };

export const DevBots = [
  '970254018268004403',
  '970253083718344704',
  '980926350057672735',
  '980925033599889470',
];

export const DevEmoji = '975854179073556500';

export const ProdEmoji = '975854074836701204';

export const BotColors = {
  default: '#2d4d58',
  failed: '#e01e01',
};

export const HelpUrls = {
  supportServer: 'https://nickandcharliebots.net/support/',
  gitHubUrl: 'https://github.com/mkevenaar/NickNelson/issues',
  websiteUrl: 'https://nickandcharliebots.net/nick-nelson/',
  inviteUrl: 'https://nickandcharliebots.net/nick/',
};
