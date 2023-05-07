const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connection = (DB_Key) => {
  try {
    //connecting to Database
    const uri = `mongodb+srv://${DB_Key}?retryWrites=true&w=majority`;
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("MongoDB Connected…");
      });
  } catch (error) {
    console.log("Error while connecting to the data");
  }
};
module.exports = connection;
