const dgram = require("dgram");
const fs = require('fs');

// Porta para o roteador da máquina esta enviando a mensagem
const ROUTERPORT = 33333;
// Ip para o roteador da máquina esta enviando a mensagem
const ROUTERHOST = "10.32.143.70";

// Porta do host que quero enviar a mensagem
var SENDPORT = process.argv[3];
// ip do host que quero enviar a mensagem
var SENDHOST = process.argv[2];
// Mensagem a ser enviada
var MESSAGE = process.argv[4];

/*
 * node client.js 127.0.0.1 5551 "hello from hell" 3399
 */

var encodedMessage = addHeader(MESSAGE, SENDPORT, SENDHOST);
send(encodedMessage, ROUTERPORT, ROUTERHOST);


function getByteArray(filePath){
    let fileData = fs.readFileSync(filePath).toString('hex');
    let result = []
    for (var i = 0; i < fileData.length; i+=2)
      result.push('0x'+fileData[i]+''+fileData[i+1])
    return result;
}

//result = getByteArray('./teste.txt')
//console.log(result)

function addHeader(message, port, destinationIp) {
  var encodedMessage = {
    destinationIp,
    origin: process.argv[5],
    port,
    message:getByteArray(`./${process.argv[4]}`)
  };
  return Buffer.from(JSON.stringify(encodedMessage));
}

function send(message, port, destination) {
  let client = dgram.createSocket("udp4");
  if (SENDHOST === ROUTERHOST) {
    client.send(message, 0, message.length, SENDPORT, SENDHOST, function (
      err,
      bytes
    ) {
      if (err) throw err;
      client.close();
    });
  } else {
    client.send(message, 0, message.length, port, destination, function (
      err,
      bytes
    ) {
      if (err) throw err;
      client.close();
    });
  }
}
