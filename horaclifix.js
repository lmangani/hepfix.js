/* *****************************
	HORACLIFIX.JS
	(C) QXIP BV 2017
	Based on negbie/horaclifix
   *****************************
*/

// Proto Buffers
var Protocol = require('binary-protocol');
var protocol = new Protocol();
var net = require('net');
var sipfix = require('./sipfix.js')

// TEST:
// echo -ne '\x00\x0A\x00\x30\x59\x41\x37\x38\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x20\x00\x01\x00\x02\x00\xFC\x77\x31\x00\x00\x00\x1E\x00\x00\x00\x00\x43\x5A\x07\x03\x00\x06\x65\x63\x7A\x37\x33\x30' | nc localhost 4739

// SIPFIX server
var server = net.createServer(function (socket) {
    // socket.setEncoding(null);
    socket.on('data', function (data) {
	var result = sipfix.readHandshake(data);
	console.log('GOT FIX: ',result);
	if (result.setId == 256) {
		result.setId++
		console.log('Replying with ID: '+result.setId);
		socket.write(sipfix.writeHandshake(result) );
	}
    });
})
.listen(4739);

console.log('HORACLIFIX Starting...');
