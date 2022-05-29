import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Constants, DefaultRestOptions } from './constants.js';
import yargs from 'yargs';
import { readdirSync } from 'fs';
import { createRequire } from 'node:module';

let envConfigured = false;
const commandsFolder = Constants.commandsFolder;
const jsExt = Constants.jsExt;
const require = createRequire(import.meta.url);

function validateEnvConfigState() {
  if (!envConfigured)
    throw new Error("Please configure the environment first using 'shared:configureEnv()'. ");

  return true;
}

export function registerRejectionHandler() {
  process.on('unhandledRejection', (err) => {
    console.log('Unknown error occurred:\n');
    console.log(err);
  });
}

export function configure() {
  dotenv.config();
  registerRejectionHandler();

  envConfigured = true;
}

export function processArgs() {
  return yargs(process.argv).argv;
}

export function getEnvConfig() {
  validateEnvConfigState();

  let { CLIENT_ID, GUILD_ID, TOKEN, MONGODB, TOPGG_TOKEN } = process.env;

  if (!MONGODB) {
    MONGODB = Constants.defaultMongoString;
  }

  // Do any validation, default correction etc here
  // ...

  return { CLIENT_ID, GUILD_ID, TOKEN, MONGODB, TOPGG_TOKEN };
}

export function getRestInstance() {
  validateEnvConfigState();

  const { TOKEN } = getEnvConfig();

  return new REST(DefaultRestOptions).setToken(TOKEN);
}

async function importFile(folder, file) {
  const importPath = `./${commandsFolder}/${folder}/${file}`;
  /**
   * Disabled this line bc every time someone uses /help the file gets dynamically imported
   * This generates a lot of noise in the logs, which I would like to prevent
   */
  // console.log(`Dynamically importing file from ${importPath}`);
  return await import(importPath);
}

export async function findCommandFiles(docs = false) {
  const commands = [];
  let folders = readdirSync(`src/${commandsFolder}/`);
  for (const folder of folders) {
    const commandFiles = readdirSync(`src/${commandsFolder}/${folder}/`).filter((file) =>
      file.endsWith(jsExt)
    );

    for (const file of commandFiles) {
      const command = await importFile(folder, file);
      let data = command.data.toJSON();
      if (docs) {
        data.group = folder;
      }
      commands.push(data);
    }
  }

  return commands;
}

export async function findCategories(selected = '') {
  const categories = [];
  let folders = readdirSync(`src/${commandsFolder}/`);
  for (const folder of folders) {
    const categoryFiles = readdirSync(`src/${commandsFolder}/${folder}/`).filter((file) =>
      file.endsWith('category.json')
    );

    for (const file of categoryFiles) {
      const importPath = `./${commandsFolder}/${folder}/${file}`;
      const category = require(importPath);
      category.default = category.value === selected;
      categories.push(category);
    }
  }

  return categories;
}
