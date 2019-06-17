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

// Cors to ease development
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.post("/api/upload", upload);
app.use("/api/doc", API_DOCS);

// Serve any static files
app.use(express.static(`${__BASE__}client/build`));

// Handle React routing, return all requests to React app
app.get("*", function(req, res) {
  res.sendFile(`${__BASE__}client/build/index.html`);
});

app.listen(3500, () => {
  console.log("listening");
});
