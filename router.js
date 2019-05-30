const ROUTERPORT = 33333;
const HOST = "127.0.0.1";

var dgram = require("dgram");

var udphosts = [
  { host: " HOST 1 ", port: 5550 },
  { host: " HOST 2 ", port: 5551 },
  { host: " HOST 3 ", port: 5552 },
  { host: " ROTEADOR ", port: 33333 }
];

const setHosts = async () => {
  await udphosts.map(host => {
    let server = dgram.createSocket("udp4");
    server.bind(host.port, HOST);
    server.on("listening", function() {
      var address = server.address();
      console.log(
        "listening " + address.address + " port::" + address.port + host.host
      );
    });
    /* 
    Quando recebermos uma mensagem na porta destinada para o reteamento 
    chamamos a função readDestination 
  */
    if (host.port == ROUTERPORT) {
      server.on("message", function(msg, rinfo) {
        readDestination(msg);
      });
    } else {
      server.on("message", function(msg, rinfo) {
        console.log(
          `[${server.address().port}] ` +
            " message received :: " +
            msg +
            " address:: " +
            rinfo.address +
            " port = " +
            rinfo.port
        );
      });
    }
  });
  console.log("####################\n");
};

function readDestination(msg) {
  const { destinationIp, port, message } = JSON.parse(msg.toString());

  if (destinationIp == HOST) {
    if (port == ROUTERPORT) {
      console.log(message);
      return;
    }
  }
  console.log("[ROUTER::33333] Roteado para::" + port);
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

setHosts();
