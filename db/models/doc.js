const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var documentSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  path: {
    type: String,
    required: true,
    unique: true
  },
  entities: [
    {
      val: String,
      ent_type: String,
      linked_to: []
    }
  ]
});

//Export the model
module.exports = mongoose.model("Document", documentSchema);
