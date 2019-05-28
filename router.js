const PORT = 33333;
const HOST = "127.0.0.1";

var dgram = require("dgram");
var server = dgram.createSocket("udp4");

server.on("listening", function() {
  var address = server.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

server.on("message", function(message, remote) {
  console.log("oi", JSON.parse(message));
  readDestinationAndSend(message);
});

server.bind(PORT, HOST);

function readDestinationAndSend(mes) {
  const { destinationIp, port, message } = JSON.parse(mes.toString("utf8"));
  let client = dgram.createSocket("udp4");

  if (destinationIp == server.address()) {
    if (port == PORT) {
      console.log(message);
      return;
    }
    client.send(mes, 0, mes.length, port, destinationIp, function(err, bytes) {
      if (err) throw err;
      client.close();
    });
  }

  client.send(mes, 0, mes.length, PORT, destinationIp, function(err, bytes) {
    if (err) throw err;
    client.close();
  });
}
