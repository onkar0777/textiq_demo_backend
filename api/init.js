const fs = require("fs");
const rabbitPublisher = require(__BASE__ + "rabbitmq/publisher");
const docController = require(__BASE__ + "controllers/docController");

const FILES_FOLDER = `${__BASE__}TEXT/`;

const CALL_DELAY = 50;

const initDbFromFolderWithWorkers = function(req, res) {
  fs.readdir(FILES_FOLDER, "utf8", (err, fileNames) => {
    console.log("Err reading folder" - err);
    if (!err) {
      let promises = [];
      fileNames.forEach((file, i) => {
        promises.push(
          rabbitPublisher.publish(JSON.stringify({ path: FILES_FOLDER, file }))
        );
      });
      Promise.all(promises)
        .then(resp => {
          res.json(resp);
        })
        .catch(err => {
          console.log(err);
          res.json(err);
        });
    } else {
      res.json(err);
    }
  });
};

/*
NOTE: We are using a timeout of 50ms for every call 
because we are using a local java server to process ne extraction requests.
For obvious reasons of not hitting it 1000 simultaneously and 
to still keep the process async, I have chosen to introduce a delay.
*/

const initDbFromFolder = (req, res) => {
  fs.readdir(FILES_FOLDER, "utf8", (err, fileNames) => {
    console.log(err);
    if (!err) {
      let filePromiseArr = [];
      fileNames.forEach((file, i) => {
        const promise = new Promise((resolve, reject) => {
          setTimeout(
            file => {
              docController
                .processFile(FILES_FOLDER, file, i)
                .then(doc => {
                  resolve(doc);
                })
                .catch(err => {
                  reject(err);
                });
            },
            CALL_DELAY * i,
            file
          );
        });
        filePromiseArr.push(promise);
      });
      Promise.all(filePromiseArr)
        .then(d => {
          res.json(d);
        })
        .catch(e => {
          res.json(e);
        });
    } else {
      res.json(err);
    }
  });
};

module.exports = {
  initDbFromFolderWithWorkers,
  initDbFromFolder
};
