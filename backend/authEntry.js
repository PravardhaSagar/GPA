var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StudentSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    password: {
      //hashed password
      type: String,
      required: true,
    },
    objectSequence: {
      //hashed sequence
      type: String,
    },
    quote: {
      type: String,
    },
    loginObjectSequence: {
      type: String,
    }, //encrypted sequence - This should be decrypted
  },
  {
    timestamps: true,
  }
);

const authEntry = mongoose.model("authEntry", StudentSchema);
module.exports = authEntry;
