global.__BASE__ = __dirname + "/";

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const upload = require("./api/upload");
const API_DOCS = require("./api/doc");
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

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.post("/api/upload", upload);
app.use("/api/doc", API_DOCS);

app.get("/", (req, res) => {
  res.send("client server alive");
});

app.listen(3500, () => {
  console.log("listening");
});
