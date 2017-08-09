const e131   = require('e131');
const server = new e131.Server([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [5568]);

server.on('listening', () => {
	console.log('server listening on port %d, universes %j', server.port, server.universes);
});

server.on('packet', (packet) => {
	const sourceName = packet.getSourceName();
	const sequenceNumber = packet.getSequenceNumber();
	const universe = packet.getUniverse();
	const slotsData = packet.getSlotsData();

	console.log('source="%s", seq=%d, universe=%d, slots=%d',
	sourceName, sequenceNumber, universe, slotsData.length);
	console.log('slots data = %s', slotsData);

});
