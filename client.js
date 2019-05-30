const ROUTERPORT = 33333;
const ROUTERHOST = "127.0.0.1";

var port = 4040;
var ip = "127.0.0.1";

var dgram = require("dgram");
var socket = dgram.createSocket("udp4");

var udphosts = [5550, 5551];

// udphosts.forEach(port => {
//   socket.bind(port, "127.0.0.1");
//   socket.on("listening", function() {
//     var address = socket.address();
//     console.log("listening" + address.address + " port::" + address.port);
//   });
//   socket.on("message", function(msg, rinfo) {
//     console.log(
//       "message received :: " +
//         msg +
//         " address::" +
//         rinfo.address +
//         "port = " +
//         rinfo.port
//     );
//   });
// });

var encodedMessage = addHeader("alo", 5551, ip);
send(encodedMessage, ROUTERPORT, ROUTERHOST);

function addHeader(message, port, destinationIp) {
  var encodedMessage = {
    destinationIp,
    originIp: "socket.address()",
    port,
    message
  };
  var msg = new Buffer(JSON.stringify(encodedMessage));
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
