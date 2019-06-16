const express = require("express");
const router = express.Router();
const docController = require(__BASE__ + "controllers/docController");

// Default route to get all the request. No input required
router.get("/", (req, res) => {
  docController
    .getDocuments()
    .then(x => {
      res.json(x);
    })
    .catch(e => {
      res.json({
        message: `Failed to get. ${e.message}`
      });
    });
});

router.get("/file", (req, res) => {
  console.log(req.query.filename);
  res.sendFile(`${__BASE__}TEXT/${req.query.filename}`);
});

router.put("/update_related_entities", (req, res) => {
  console.log("Requested body- ", req.body);
  docController.updateRelatedEntities(req.body).then(updatedEntity => {
    console.log(updatedEntity);
    res.json(updatedEntity);
  });
});

router.put("/add_entity", (req, res) => {
  console.log("Requested body- ", req.body);
  docController.addEntity(req.body).then(updatedEntity => {
    console.log(updatedEntity);
    res.json(updatedEntity);
  });
});

router.delete("/entity", (req, res) => {
  console.log(req.body);
  docController.deleteEntityFromDoc(req.body).then(updatedDocument => {
    console.log(updatedDocument);
    res.json(updatedDocument);
  });
});

module.exports = router;
