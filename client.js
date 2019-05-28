const ROUTERPORT = 33333;
const ROUTERHOST = "127.0.0.1";

var port = 4040;
var ip = "127.0.0.1";

var dgram = require("dgram");
var message = new Buffer("My KungFu is Good!");
var socket = dgram.createSocket("udp4");

var foi = false;
//Escutar pacotes
socket.on("listening", function() {
  var address = socket.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

socket.on("message", function(mes, remote) {
  const { originIp, port, message } = mes;
  console.log(originIp + ":" + port + " - " + message);
});

socket.bind(port, ip);

addHeaderAndSend("alo", 33333, ip);

function addHeaderAndSend(message, port, destinationIp) {
  var encodedMessage = {
    destinationIp,
    originIp: "socket.address()",
    port,
    message
  };
  var buffer = JSON.stringify(encodedMessage);
  if (!foi) {
    socket.send(buffer, 0, buffer.length, ROUTERPORT, ROUTERHOST, function(
      err,
      bytes
    ) {
      if (err) throw err;
      //console.log("UDP message sent to " + HOST + ":" + PORT);
      //socket.close();
      console.log("TA MANDANDO !!!!!!!!!!!!!");
    });
    foi = true;
  }
}
