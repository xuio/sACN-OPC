const e131 = require('e131');
const OPC  = require('./opc.js');
const argv = require('minimist')(process.argv.slice(2));

// dimensions of the Matrix
const size = [
	{
		x: 14,
		y: 80,
	},
	{
		x: 10,
		y: 75,
	}
];

const server = new e131.Server([
	// e131 universes to listen to
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,

	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
]);

//const map = [2,3,4,5,6,8,9,10,11,12 ];
const map = [0,1,2,3,4,5,6,7,8,9];

const client = [
	new OPC(argv['ip1'] || '127.0.0.1', 7891),
	new OPC(argv['ip2'] || '127.0.0.1', 7890),
];

client[0].setPixelCount(size[0].x * size[0].y);
client[1].setPixelCount(size[1].x * size[1].y);

let framebuffer = new Uint8Array(512 * 24);

server.on('listening', () => {
	console.log(`server listening on port ${server.port}, universes [${server.universes}]`);
});

// update framebuffer from e131 packet
const update = (packet) => {
	const universe = packet.getUniverse();
	const slotsData = packet.getSlotsData();

	for(let i=0; i < slotsData.length; i++){
		framebuffer[((universe - 1)*512) + i] = slotsData[i];
	}
};

server.on('packet', packet => update(packet));
server.on('packet-out-of-order', packet => update(packet));

setInterval(() => {
	for(let x = 0; x < size[0].x; x++){
		for(let y = 0; y < size[0].y; y++){
			const offset = (x) * 512 + y*3;
			client[0].setPixel(
				(x * size[0].y) + y,
				framebuffer[offset + 0],
				framebuffer[offset + 1],
				framebuffer[offset + 2]
			);
		}
	}
	client[0].writePixels();

	for(let x = 0; x < size[1].x; x++){
		for(let y = 0; y < size[1].y; y++){
			const offset = (x + 14) * 512 + y*3;
			client[1].setPixel(
				(map[x] * size[1].y) + y,
				framebuffer[offset + 0],
				framebuffer[offset + 1],
				framebuffer[offset + 2]
			);
		}
	}
	client[1].writePixels();
}, 5);
