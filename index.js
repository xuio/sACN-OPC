const e131 = require('e131');
const OPC  = require('./opc.js');
const argv = require('minimist')(process.argv.slice(2));

// dimensions of the Matrix
const size = {
	x: 40,
	y: 27,
};

const server = new e131.Server([
	// e131 universes to listen to
	0x0001,
	0x0002,
	0x0003,
	0x0004,
	0x0005,
	0x0006,
	0x0007,
	0x0008,
	0x0009,
	0x000A,
	0x000B,
	0x000C,
	0x000D,
	0x000E
]);

const client = new OPC(argv['ip'] || '127.0.0.1', 7890);

// initialize framebuffer; 3 bytes per pixel
let framebuffer = new Uint8Array(size.x*size.y*3);

server.on('listening', () => {
	console.log(`server listening on port ${server.port}, universes [${server.universes}]`);
});

// update framebuffer from e131 packet
const update = (packet) => {
	const universe = packet.getUniverse();
	const slotsData = packet.getSlotsData();

	for(let i=0; i < 80*3; i++){
		framebuffer[(universe-1)*80*3 + i] = slotsData[i];
	}
};

server.on('packet', packet => update(packet));
server.on('packet-out-of-order', packet => update(packet));

// update OPC client from framebuffer
setInterval(() => {
	for(let i=0; i<1080; i++){
		client.setPixel(i,
			framebuffer[i*3 + 0],
			framebuffer[i*3 + 1],
			framebuffer[i*3 + 2]
		);
	}
	client.writePixels();
}, 1.0 / argv['hz'] * 1000.0 || 5);

