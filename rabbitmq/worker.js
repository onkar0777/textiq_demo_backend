global.__BASE__ = __dirname + "/../";

const queue = "ne_processing"; // Name of rabbit queue
const docController = require("../controllers/docController");

const open = require("amqplib").connect("amqp://localhost"); // Open a connection to rabbimq
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
// Connect MongoDB at default port 27017.
mongoose.connect(
  "mongodb://localhost:27017/textIQ",
  {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  err => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);

// Consumer to consume messages from queue
open
  .then(function(conn) {
    return conn.createChannel();
  })
  .then(function(ch) {
    return ch.assertQueue(queue).then(function(ok) {
      return ch.consume(
        queue,
        function(msg) {
          if (msg !== null) {
            const { path, file } = JSON.parse(msg.content.toString());
            console.log(path, file);
            docController
              .processFile(path, file)
              .then(docs => {
                ch.ack(msg);
              })
              .catch(err => {
                console.log("failed worker- ", err.errmsg);
                // Ideally we are supposed to write a republish logic here
                ch.ack(msg);
              });
          }
        },
        {
          noAck: false
        }
      );
    });
  })
  .catch(console.warn);
