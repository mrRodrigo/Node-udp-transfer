const dgram = require("dgram");

const ROUTERPORT = 33333;
const ROUTERHOST = "127.0.0.1";

var SENDPORT = process.argv[3];
var SENDHOST = process.argv[2];
var MESSAGE = process.argv[4];

/*
 * node client.js 127.0.0.1 5551 "hello from hell" 3399
 */

var encodedMessage = addHeader(MESSAGE, SENDPORT, SENDHOST);
send(encodedMessage, ROUTERPORT, ROUTERHOST);

function addHeader(message, port, destinationIp) {
  var encodedMessage = {
    destinationIp,
    origin: process.argv[5],
    port,
    message
  };
  var msg = Buffer.from(JSON.stringify(encodedMessage));
  return msg;
}

function send(message, port, destination) {
  let client = dgram.createSocket("udp4");
  client.send(message, 0, message.length, port, destination, function(
    err,
    bytes
  ) {
    if (err) throw err;
    client.close();
  });
}
