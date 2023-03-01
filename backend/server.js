const express= require('express');
const cors=require('cors');
const connection=require('./connection.js');
// const shuffle=require('./shuffle')
const app= express();
const dotevn = require('dotenv');
const port=process.env.PORT||750;

const authEntry =require('./authEntry.js')
app.use(express.json())
dotevn.config()
const DB_Key=process.env.DB_Key;
//connecting to Database
connection(DB_Key)
const animals=[ "dog","cow","horse","cat","elephant","sheep","squirille","hen","spider"]

app.use(cors());
app.use(express.static('Images/'))
app.listen(port,()=>{
  console.log(`Server is running on port: ${port}`);
});


//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/',(req,res)=>{
  const grid=[]
  var totp=0;
  console.log(req.body.username);
  //shuffle the object and then randomize the images
  shuffle(animals)
  console.log(animals)
   authEntry.findOne({userName:req.body.username}).then((result)=>{
    const sequence=result.objectSequence;
    console.log(sequence)
    for(x in sequence){
      const pos=animals.indexOf(sequence[x])+1
      totp=totp*10+pos
    }
    // console.log(totp)
    authEntry.findOneAndUpdate({userName: req.body.username}, {totp:totp}, {upsert: true}, function(err, doc) {
      if (err){console.log('errorr'+err)}
      else{
        console.log('totp sucessfully updated'+totp)
      }
  });
  })
  //Update the TOTP to the document
  console.log(totp)
  
  for(let i=0;i<9;i++){
    const ranomImageNumber=Math.floor(Math.random() * (1500 - 1000 + 1) + 1000);
    grid[i]="http://localhost:750/"+animals[i]+"/"+ranomImageNumber+".jpg"
  }
  console.log(grid)
  //Calculating a temporary password and SaveBack to into the Database
  res.send(grid)
}
)

app.post('/verifyPin',(req,res)=>{
  console.log("Recieved Pin and UserName"+req.body.pin+""+req.body.userName)
  //Compare the pin with TOTP
  authEntry.findOne({userName:req.body.userName}).then((result)=>{
    console.log(result)

    if(result){
      console.log("sucessfully loged IN")
      res.redirect("www.google.com")
    }
    else{
      res.send(false)
    }
})
  res.send(req.body.pinNum)
})

app.post('/verifyUsername',(req,res)=>{
  //1. We verify if the userName exists or not
  authEntry.findOne({userName:req.body.userName}).then((result)=>{
    if(result){
      res.send(true)
    }
    else{
      res.send(false)
    }
})})


//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/register',(req,res)=>{//This route stores the other information of the user
  console.log("Recieved a register request with UserName: "+req.body.userName+" EmailAddress"+req.body.emailAddress+"Password"+req.body.password)
  //CHECK WITH THE DATABASE IS THE USERNAME EXISTS
  authEntry.findOne({userName:req.body.userName}).then((result)=>{
    if(result){
      res.send(false)
    }
    else{
      //As the Username does Not Exists i will make an entry of other object properties.
      const auth =new authEntry({
        userName:req.body.userName,
        emailId:req.body.emailAddress,
        password:req.body.password,  
      })
      console.log(auth)
      auth.save().then((result)=>{
        console.log("Sucessfully saved "+result)
      }).catch((err)=>{
        console.log("error while saving new reult"+err)
      })
      res.send(true)
    }
  });
})

app.post('/makePassword',(req,res)=>{//This route stores the choosen object sequence as password
  var query = {userName: req.body.userName};
  console.log(query)
  var newData=req.body.ojectSequence;
  console.log(newData)
  authEntry.findOneAndUpdate(query, {objectSequence:newData}, {upsert: true}, function(err, doc) {
      if (err){console.log('errorr'+err)}
      else{
        console.log('sucessfully updated')
      }
  });
})
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

function shuffle(array){
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}


//this is for testing as we push it into the mongodb database
//When we recieve the makePassword sequence of objects we update the already made entry
app.get('/a', (req,res) => {
  var query = {userName:'t'};
  var newData=["hhh","hhhh"]
  authEntry.findOneAndUpdate(query, {objectSequence:newData}, {upsert: true}, function(err, doc) {
      if (err){console.log('errorr'+err)}
      else{
        console.log('sucessfully updated')
      }
  });
  res.send('updated one');
})
//this logic will also be used to calculate the totp before serving the gridimage while login