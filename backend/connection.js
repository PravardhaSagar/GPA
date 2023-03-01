const mongoose = require( "mongoose");
mongoose.set('strictQuery', false);
const connection=async (DB_Key) =>{
    try{
        //connecting to Database
        const uri = `mongodb+srv://${DB_Key}?retryWrites=true&w=majority`;

        await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        })
        console.log("MongoDB Connected…")
    }catch(error){
        console.log('Error while connecting to the data');
    }
}
module.exports = connection;