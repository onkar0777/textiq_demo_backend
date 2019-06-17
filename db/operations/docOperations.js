// Db accessor for Documents Model. All db operations for document should be done here
var Document = require(__BASE__ + "db/models/doc");
// var Promise = require("bluebird");

// Returns a default template depending on parameters for document creation
const getCreateTemplate = function(parameters) {
  var template = {};
  for (var key in parameters) {
    switch (key) {
      case "name":
      case "entities":
      case "path":
        template[key] = parameters[key];
        break;
    }
  }
  return template;
};

// get documents from db
const getDocuments = function(rule, fields, options) {
  return new Promise(function(resolve, reject) {
    Document.find(rule, fields, options)
      .lean()
      .exec(function(err, data) {
        if (!err) {
          resolve(data);
        } else {
          console.error("GetDocuments", err, rule);
          reject(err);
        }
      });
  });
};

// create document in db
const createDocument = function(parameters) {
  return new Promise(function(resolve, reject) {
    var template = getCreateTemplate(parameters);
    var record = new Document(template);
    record.save(function(err, data) {
      if (!err) {
        resolve(data);
      } else {
        console.error("CreateDocument", err.errmsg);
        reject(err);
      }
    });
  });
};

// update single entries in db according to the rule passed. updates are provided in template
const updateDocument = function(rule, template) {
  console.log(rule, template);
  return new Promise(function(resolve, reject) {
    Document.findOneAndUpdate(
      rule,
      template,
      {
        upsert: false,
        new: true
      },
      function(err, data) {
        // multi is false by default
        if (!err) {
          resolve(data);
        } else {
          console.error("updateDocument", err, rule, template);
          reject(err);
        }
      }
    );
  });
};

// update multiple entries in db according to the rule passed. updates are provided in template
const updateManyDocuments = function(rule, template) {
  return new Promise(function(resolve, reject) {
    Document.updateMany(
      rule,
      {
        $set: template
      },
      {
        upsert: false,
        runValidators: true
      },
      function(err, data) {
        // multi is false by default
        if (!err) {
          resolve(data);
        } else {
          console.error("updateManyDocuments", err, rule, template);
          reject(err);
        }
      }
    );
  });
};

module.exports = {
  getDocuments: getDocuments,
  createDocument: createDocument,
  updateDocument: updateDocument,
  updateManyDocuments: updateManyDocuments
};
