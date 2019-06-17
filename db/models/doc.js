const mongoose = require("mongoose");

var documentSchema = new mongoose.Schema({
  // Name of the file
  name: {
    type: String,
    index: true
  },
  // Path / Url of the file
  path: {
    type: String,
    required: true,
    unique: true
  },
  // Named Entitites in a file
  entities: [
    {
      val: String,
      ent_type: String, // Being provided by ne-server. Storing for future ref.
      linked_to: []
    }
  ]
});

//Export the model
module.exports = mongoose.model("Document", documentSchema);
