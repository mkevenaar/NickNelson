import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Constants, DefaultRestOptions } from './constants.js';
import yargs from 'yargs';
import { readdirSync } from 'fs';

let envConfigured = false;
const commandsFolder = Constants.commandsFolder;
const jsExt = Constants.jsExt;

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
	console.log(`Dynamically importing file from ${importPath}`);
	return await import(importPath);
}

export async function findCommandFiles() {
	const commands = [];
	let folders = readdirSync(`src/${commandsFolder}/`);
	for (const folder of folders) {
		const commandFiles = readdirSync(`src/${commandsFolder}/${folder}/`).filter((file) =>
			file.endsWith(jsExt)
		);

		for (const file of commandFiles) {
			const command = await importFile(folder, file);
			commands.push(command.data.toJSON());
		}
	}

	return commands;
}
