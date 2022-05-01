module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log('Logged as:', client.user.tag);
		client.user.setPresence({ activities: [{ name: 'I like Charlie Spring! In a romantic way not just a friend way!', type: 'WATCHING' }], status: 'online' });
	},
};
