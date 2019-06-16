const IncomingForm = require("formidable").IncomingForm;
const docController = require(__BASE__ + "controllers/docController");

module.exports = function upload(req, res) {
  var form = new IncomingForm();

  form.on("file", (field, file) => {
    docController.processFile(file.path, file.name);
  });
  form.on("end", () => {
    res.json();
  });
  form.parse(req);
};
