const express= require('express');
const cors=require('cors');
const connection=require('./connection.js');
// const shuffle=require('./shuffle')
const app= express();
const dotevn = require('dotenv');
const bcrypt=require('bcrypt')
const port=process.env.PORT||750;
const jwt = require('jsonwebtoken')

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
  const loginObjectSequence=animals.toString()//This should be encrypted string
  // console.log(totp)
  authEntry.findOneAndUpdate({userName: req.body.username}, {loginObjectSequence:loginObjectSequence}, {upsert: true}, function(err, doc) {
      if (err){console.log('errorr'+err)}
  });
  for(let i=0;i<9;i++){
    const ranomImageNumber=Math.floor(Math.random() * (1500 - 1000 + 1) + 1000);
    grid[i]="http://localhost:750/"+animals[i]+"/"+ranomImageNumber+".jpg"
  }
  console.log(grid)
  // res.send(loginObjectSequence)
  res.send(grid)

}
)

app.post('/verifyPin',async (req,res)=>{
  //recieve the loginObjectSequence
  var loginObjectSequence=""
  var loginEnteredSequence=[]
  var pin_index
  var hashedPasswordSequence=""
  var loggedIn
  var userName
  var email
  await authEntry.findOne({userName:req.body.userName}).then((result)=>{
    userName=result.userName
    email=result.emailId
    //decrypt the loginObjectSequence
    loginObjectSequence=result.loginObjectSequence
    loginObjectSequence=loginObjectSequence.split(",")
    console.log(loginObjectSequence)
    hashedPasswordSequence=result.objectSequence
  })
  console.log(hashedPasswordSequence)
  //deconstructing the pin object sequence
  if(req.body.pin>9){
    pin_index=req.body.pin.split("")
  }
  else{ pin_index=[req.body.pin]}
  // console.log(pin_index)
  for(i in pin_index){
    c=parseInt(pin_index[i])-1
    loginEnteredSequence.push(loginObjectSequence[c])
    // console.log("c"+c+"Entered"+loginEnteredSequence)
  }
  loginEnteredSequence=loginEnteredSequence.toString()
  //comparing with DB
  loggedIn=bcrypt.compareSync(loginEnteredSequence, hashedPasswordSequence); 

  if(loggedIn){
    const token = jwt.sign(
			{
				name: userName,
				email: email,
			},
			'secret123',
      { expiresIn: 50000 }
		)
    res.send({status:'ok', user:token})
  }
  else{
    res.send({status:'error', user:false})
  }
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
      const hashPassword = bcrypt.hashSync(req.body.password, 12);
      //As the Username does Not Exists i will make an entry of other object properties.
      const auth =new authEntry({
        userName:req.body.userName,
        emailId:req.body.emailAddress,
        password:hashPassword,  
        quote:""
      })
      console.log(auth)
      auth.save().then((result)=>{
        console.log("Sucessfully saved "+result)
      }).catch((err)=>{
        console.log("error while saving new reult"+err)
      })
      res.send(auth)
    }
  });
})

app.post('/makePassword',(req,res)=>{//This route stores the choosen object sequence as password
  var query = {userName: req.body.userName};
  console.log(query)
  var newData=req.body.ojectSequence;
  newData=newData.toString();
  const hashSequence = bcrypt.hashSync(newData, 12);
  console.log(newData)
  authEntry.findOneAndUpdate(query, {objectSequence:hashSequence}, {upsert: true}, function(err, doc) {
      if (err){console.log('errorr'+err)}
      else{
        res.send('sucessfully updated')
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

app.get('/dashboard', async (req, res) => {
	const token = req.headers['x-access-token']
  console.log("Recieved get token"+token)

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await authEntry.findOne({ emailId: email })
    console.log(user)
		res.send({ status: 'ok', quote: user.quote })
	} catch (error) {
		console.log(error)
		res.send({ status: 'error', error: 'invalid token' })
	}
})

app.post('/dashboard', async (req, res) => {
  const token = req.headers['x-access-token']
  console.log("Recieved get token"+token)
  const quote=req.body.quote
  console.log(quote)
	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await authEntry.findOneAndUpdate({ emailId: email },{quote:quote})
    console.log(user)
		res.send({ status: 'ok', quote: user.quote })
	} catch (error) {
		console.log(error)
		res.send({ status: 'error', error: 'invalid token' })
	}
})
