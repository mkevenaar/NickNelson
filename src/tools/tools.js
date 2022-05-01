module.exports.resolveChannel = async function (search, guild) {
	let channel = null;
	if (!search || typeof search !== 'string') return;
	//Try to search using ID
	if (search.match(/^#&!?(\d+)$/)) {
		let id = search.match(/^#&!?(\d+)$/)[1];
		channel = guild.channels.cache.get(id);
		if (channel) return channel;
	}

	if (search.includes('<#')) {
		let firstChannel = search.replace('<#', '');
		let channelID = firstChannel.replace('>', '');
		let channel = guild.channels.cache.get(channelID);
		if (channel) return channel;
	}

	channel = guild.channels.cache.find((c) => search.toLowerCase() === c.name.toLowerCase());
	if (channel) return channel;

	channel = guild.channels.cache.get(search);
	return channel;
};
