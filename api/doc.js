const express = require("express");
const router = express.Router();
const docController = require(__BASE__ + "controllers/docController");
const CONSTANTS = require(__BASE__ + "config/constants");

// Default route to get all the request. No input required
router.get("/", (req, res) => {
  docController
    .getDocuments()
    .then(x => {
      res.json(x);
    })
    .catch(e => {
      res.json({
        message: `Failed to get. ${e.message}` // Error handling can be improved as required
      });
    });
});

router.get("/file", (req, res) => {
  console.log(req.query.filename);
  if (req.query.filename) {
    res.sendFile(`${CONSTANTS.TEXT_FOLDER}${req.query.filename}`);
  } else {
    res.status(400).json("ERROR - Invalid file name"); // Error handling can be improved as required
  }
});

router.put("/update_related_entities", (req, res) => {
  console.log("Requested body- ", req.body);
  const { docId, entityId, relatedEntities } = req.body;
  if (docId && entityId && relatedEntities) {
    docController
      .updateRelatedEntities({ docId, entityId, relatedEntities })
      .then(updatedEntity => {
        console.log(updatedEntity);
        res.json(updatedEntity);
      })
      .catch(err => {
        res.json(err);
      });
  } else {
    res.status(400).json("ERROR - Invalid Inputs"); // Error handling can be improved as required
  }
});

router.put("/add_entity", (req, res) => {
  console.log("Requested body- ", req.body); // Logging can be improved as required
  const { docId, selectedText } = req.body;
  if (docId && selectedText) {
    docController
      .addEntity({ docId, selectedText })
      .then(updatedEntity => {
        console.log(updatedEntity);
        res.json(updatedEntity);
      })
      .catch(err => {
        res.json(err);
      });
  } else {
    res.status(400).json("ERROR - Invalid Inputs"); // Error handling can be improved as required
  }
});

router.delete("/entity", (req, res) => {
  console.log(req.body);
  const { docId, entity } = req.body;
  if (docId && entity) {
    docController
      .deleteEntityFromDoc({ docId, entity })
      .then(updatedDocument => {
        console.log(updatedDocument);
        res.json(updatedDocument);
      })
      .catch(err => {
        res.json(err);
      });
  } else {
    res.status(400).json("ERROR - Invalid Inputs"); // Error handling can be improved as required
  }
});

router.delete("/all_entities", (req, res) => {
  console.log(req.body);
  const { docId } = req.body;
  if (docId) {
    docController
      .deleteAllEntitiesFromDoc({ docId })
      .then(updatedDocument => {
        console.log(updatedDocument);
        res.json(updatedDocument);
      })
      .catch(err => {
        res.json(err);
      });
  } else {
    res.status(400).json("ERROR - Invalid Inputs"); // Error handling can be improved as required
  }
});

module.exports = router;
