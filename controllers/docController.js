const fs = require("fs");
const ner = require("ner-server");
const docOperations = require(__BASE__ + "db/operations/docOperations");
// const mongoose = require("mongoose");

const processFile = function(path, name) {
  fs.readFile(path, "utf8", function(err, data) {
    if (err) throw err;
    ner.post("localhost", 9191, data, function(err, res) {
      if (err) console.error("ERR- ", err);
      if (res && res.tags && Object.keys(res.tags).length) {
        let org = [],
          location = [],
          person = [];
        if (res.tags.ORGANIZATION) {
          org = [...new Set(res.tags.ORGANIZATION)].map(x => {
            x = { val: x };
            x.ent_type = "org";
            return x;
          });
        }
        if (res.tags.LOCATION && res.tags.LOCATION.length) {
          location = [...new Set(res.tags.LOCATION)].map(x => {
            x = { val: x };
            x.ent_type = "loc";
            return x;
          });
        }
        if (res.tags.PERSON) {
          person = [...new Set(res.tags.PERSON)].map(x => {
            x = { val: x };
            x.ent_type = "per";
            return x;
          });
        }
        const entities = [...org, ...location, ...person];
        docOperations.createDocument({ name, path, entities });
      }
    });
  });
};
const getDocuments = function(query) {
  return docOperations.getDocuments(query, undefined, {
    sort: {
      _id: -1
    }
  });
};

const updateRelatedEntities = function({ docId, entityId, relatedEntities }) {
  const query = { _id: docId, "entities._id": entityId };
  const template = {
    $addToSet: { "entities.$.linked_to": { $each: relatedEntities } }
  };
  console.log(query, template);
  return docOperations.updateDocument(query, template).then(updatedDoc => {
    console.log(updatedDoc);
    return updatedDoc.entities.filter(x => x._id == entityId)[0];
  });
};

const addEntity = function({ docId, selectedText }) {
  const newEntity = { val: selectedText };
  const query = { _id: docId, "entities.val": { $ne: selectedText } };
  const template = {
    $addToSet: { entities: newEntity }
  };
  return docOperations.updateDocument(query, template).then(updatedDoc => {
    return updatedDoc.entities.filter(x => x.val == selectedText)[0];
  });
};

const deleteEntityFromDoc = function({ docId, entity }) {
  const query = { _id: docId };
  const template = {
    $pull: { entities: { _id: entity } }
  };
  return docOperations.updateDocument(query, template);
};

module.exports = {
  processFile,
  getDocuments,
  deleteEntityFromDoc,
  updateRelatedEntities,
  addEntity
};
