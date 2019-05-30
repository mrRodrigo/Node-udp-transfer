const ROUTERPORT = 33333;
const HOST = "192.168.1.165";

var dgram = require("dgram");

var udphosts = [5550, 5551, 33333];

udphosts.forEach(port => {
  let server = dgram.createSocket("udp4");
  server.bind(port, HOST);
  server.on("listening", function() {
    var address = server.address();
    console.log("listening " + address.address + " port::" + address.port);
  });
  /* 
    Quando recebermos uma mensagem na porta destinada para o reteamento 
    chamamos a função readDestination 
  */
  if (port == ROUTERPORT) {
    server.on("message", function(msg, rinfo) {
      readDestination(msg);
    });
  } else {
    server.on("message", function(msg, rinfo) {
      console.log(
        "message received :: " +
          msg +
          " address::" +
          rinfo.address +
          " port = " +
          rinfo.port
      );
    });
  }
});

function readDestination(msg) {
  const { destinationIp, port, message } = JSON.parse(msg.toString());

  if (destinationIp == HOST) {
    if (port == ROUTERPORT) {
      console.log(message);
      return;
    }
  }
  send(message, port, destinationIp);
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
