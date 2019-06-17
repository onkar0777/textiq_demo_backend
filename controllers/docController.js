const fs = require("fs");
const ner = require("ner-server");
const docOperations = require(__BASE__ + "db/operations/docOperations");

const processFile = function(folder, name) {
  return new Promise(function(resolve, reject) {
    const path = `${folder}${name}`;
    fs.readFile(path, "utf8", function(err, fileContent) {
      if (err) reject(err);
      console.log("Processing file - ");
      // From ner-server npm docs
      // If this server is not local and duplicate requests can come then we should
      // do this step only after checking if the db entry will be done or not.
      ner.post("localhost", 9191, fileContent, function(err, res) {
        if (err) console.log(`ERR- ${name}, err- ${JSON.stringify(err)}`);
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
          console.log("Creating doc");
          docOperations
            .createDocument({ name, path, entities })
            .then(doc => {
              console.log("Created doc- ");
              resolve(doc);
            })
            .catch(err => {
              console.log("Docs Creation Failed- ", err.errmsg);
              reject(err);
            });
        } else {
          const entities = [];
          console.log("Creating doc without entities");
          docOperations
            .createDocument({ name, path, entities })
            .then(doc => {
              console.log("Created doc without entities- ");
              resolve(doc);
            })
            .catch(err => {
              console.log("Docs Creation Failed- ", err.errmsg);
              reject(err);
            });
        }
      });
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
  return docOperations
    .updateDocument(query, template)
    .then(updatedDoc => {
      console.log(updatedDoc);
      return updatedDoc.entities.filter(x => x._id == entityId)[0];
    })
    .catch(err => {
      console.log("updateRelatedEntities- ", err);
      return {};
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

  return docOperations.updateDocument(query, template).then(doc => {
    const secQuery = {
      _id: docId
    };
    return docOperations.getDocuments(secQuery).then(docs => {
      console.log(docs, docs[0]);
      console.log(docs[0].entities.length);
      let filteredEntities = docs[0].entities.map(item => {
        item.linked_to = item.linked_to.filter(item2 => item2._id !== entity);
        return item;
      });
      console.log(filteredEntities, filteredEntities.length);
      const secTemplate = { $set: { entities: filteredEntities } };
      return docOperations.updateDocument(secQuery, secTemplate);
    });
  });
};

const deleteAllEntitiesFromDoc = function({ docId }) {
  const query = { _id: docId };
  const template = {
    entities: []
  };
  return docOperations.updateDocument(query, template);
};

module.exports = {
  processFile,
  getDocuments,
  deleteEntityFromDoc,
  updateRelatedEntities,
  addEntity,
  deleteAllEntitiesFromDoc
};
