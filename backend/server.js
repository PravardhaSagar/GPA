const express= require('express');
const cors=require('cors');

const app= express();
const port=process.env.PORT||750;
// const FormData = require('form-data');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
app.use(cors());
const Blog =require('./Blogs.js')

//connecting to Database
const uri = `mongodb+srv://Pravardha:Sagar@gpa.kdcjtq6.mongodb.net/UserName?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected…")
})
.catch(err => console.log(err))


// create application/json parser
var jsonParser = bodyParser.json()
 
// app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('images/'))
app.post('/',jsonParser,(req,res)=>{
  console.log(req.body.username);
  //I need to check the user here;
  //Then i need to send the appropriate urls
  res.send([
    "http://localhost:750/dog/1000.jpg",
    "http://localhost:750/cow/1000.jpg",
    "http://localhost:750/horse/1000.jpg",
    "http://localhost:750/cat/1000.jpg",
    "http://localhost:750/cow/1000.jpg",
    "http://localhost:750/sheep/1000.jpg",
    "http://localhost:750/squirille/1000.jpg",
    "http://localhost:750/hen/1000.jpg",
    "http://localhost:750/spider/1000.jpg"
])})
app.get('/blog', (req,res) => {
    const blog =new Blog({
      userName:'VICKY',
      mobileNumber:9640928374,
      emailId:"vicky.u.sagar",
      objectSequence:["butterfly","cat","cow"]
    })
    blog.save().then((result)=>{
      res.send(result)
    }).catch((err)=>{
      console.log(err)
    })
    
});

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});