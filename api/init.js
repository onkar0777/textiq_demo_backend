const fs = require("fs");
const docController = require(__BASE__ + "controllers/docController");

module.exports = function initDbFromFolder(req, res) {
  fs.readdir(`${__BASE__}TEXT/`, "utf8", (err, data) => {
    console.log(err);
    if (!err) {
      data.forEach(file => {
        docController.processFile(`${__BASE__}TEXT/${file}`, file);
      });
      res.json(data);
    } else {
      res.json(err);
    }
  });
};
