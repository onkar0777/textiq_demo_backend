const q = "ne_processing";

const open = require("amqplib").connect("amqp://localhost");

// Publisher
const publish = function(msg) {
  return open
    .then(function(conn) {
      return conn.createChannel();
    })
    .then(function(ch) {
      return ch.assertQueue(q).then(function(ok) {
        return ch.sendToQueue(q, Buffer.from(msg));
      });
    })
    .catch(console.warn);
};
module.exports = {
  publish
};
