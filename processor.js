global.__BASE__ = __dirname + "/";

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const initApis = require("./api/init");
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

// Cors to ease development
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get("/api/init", initApis.initDbFromFolder);
app.get("/api/init_with_workers", initApis.initDbFromFolderWithWorkers);

app.get("/", (req, res) => {
  res.send(
    "Processing Server Alive. Hit Appropriate route to start processing"
  );
});

app.listen(4500, () => {
  console.log("listening");
});
