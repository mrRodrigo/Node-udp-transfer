const udphosts = require("./configHosts");
const dgram = require("dgram");
const fs = require("fs");

const ROUTERPORT = 33333;
const HOST = "127.0.0.1";

/* 
  Levanta todos os hosts nas respectivas portas do arquivo configHosts.js
  quando a porta for igual a ROUTERPORT este host será o roteador e quando receber uma mensagem
  executara a função readDestination.
*/
const setHosts = async () => {
  await udphosts.map(host => {
    let server = dgram.createSocket("udp4");
    server.bind(host.port, HOST);

    server.on("listening", function() {
      var address = server.address();
      console.log(
        "listening " +
          address.address +
          " port::" +
          address.port +
          `[${host.host}]`
      );
    });
    /* 
    Quando recebermos uma mensagem na porta destinada para o reteamento 
    chamamos a função readDestination 
   */
    if (host.port == ROUTERPORT) {
      server.on("message", function(msg, rinfo) {
        readDestination(JSON.parse(msg.toString()));
      });
    } else {
      server.on("message", async function(msg, rinfo) {
        let { message, origin } = JSON.parse(msg);
        await saveMessage(message);
        console.log(
          `[${host.host}::${server.address().port}] ` +
            '[Message received]: "' +
            message.name +
            '" From: [' +
            rinfo.address +
            "::" +
            origin +
            "]"
        );
      });
    }
  });
  console.log("\n");
};

/* 
  Quando um roteador recebe uma mensagem é executada esta função.
  abrimos a mensagem e pegamos o destino/porta real e a menssagem em si.
*/
function readDestination(msg) {
  const { destinationIp, port, message } = msg;

  if (destinationIp == HOST) {
    if (port == ROUTERPORT) {
      console.log(message);
      return;
    }
  }

  console.log(
    "[ROUTER::33333] Roteado para::" +
      " IP: " +
      destinationIp +
      " PORT: " +
      port
  );
  send(msg, port, destinationIp);
}

/* envia uma mensagem para um determinado host */
function send(message, port, destination) {
  let client = dgram.createSocket("udp4");
  let msg = Buffer.from(JSON.stringify(message));

  client.send(msg, 0, msg.length, port, destination, function(err, bytes) {
    if (err) throw err;
    client.close();
  });
}

/* Salva o arquivo recebido */
function saveMessage(msg) {
  let { name, content } = msg;
  fs.writeFile(`./recived/${name}`, content.toString("utf-8"), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(`[SYSTEM] O arquivo ${name} foi salvo na pasta /recived`);
  });
}

setHosts();
