const e131 = require('e131');
const OPC  = require('./opc.js');
const argv = require('minimist')(process.argv.slice(2));

const server = new e131.Server();
const client = new OPC(argv['ip'], 7890);

let framebuffer = new Uint8Array(27*40*3);

server.on('listening', () => {
	console.log('server listening on port %d, universes %j', server.port, server.universes);
});

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

let universe_ = 0;

server.on('packet', function(packet) {
	const universe = packet.getUniverse();
	const slotsData = packet.getSlotsData();

	//if(universe == 10) console.log('10!');

	for(let i=0; i < 80*3; i++){
		//console.log(slotsData[i]);
		framebuffer[(universe-1)*80*3 + i] = slotsData[i];
	}
});

setInterval(() => {
	for(let i=0; i<1080; i++){
		client.setPixel(i,
			framebuffer[i*3 + 0],
			framebuffer[i*3 + 1],
			framebuffer[i*3 + 2]
		);
	}
	client.writePixels();
}, 5);

