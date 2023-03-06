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

app.post('/verifyUsername',async (req,res)=>{
  //1. We verify if the userName exists or not
  result=await checkUserName(req.body.userName)
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

app.post('/register',async (req,res)=>{//This route stores the other information of the user
  console.log("Recieved a register request with UserName: "+req.body.userName+" EmailAddress"+req.body.emailAddress+"Password"+req.body.password)
  //CHECK WITH THE DATABASE IS THE USERNAME EXISTS
    result= await checkUserName(req.body.userName)
    console.log(result)
    if(result){
      res.send(false)
    }
    else{
      const hashPassword = bcrypt.hashSync(req.body.password, 12);
      //As the Username does Not Exists i will make an entry of other object properties.
      const token = jwt.sign(
        {
          userName:req.body.userName,
          emailId:req.body.emailAddress,
          password:hashPassword,  
          quote:""
        },
        'secret123',
        { expiresIn: 50000 }
      )
      res.send({status:'ok', user:token})
      // const auth =new authEntry({
      //   userName:req.body.userName,
      //   emailId:req.body.emailAddress,
      //   password:hashPassword,  
      //   quote:""
      // })
      //Instead of saving it I can just pass it to make password
      // console.log(auth)
      // auth.save().then((result)=>{
      //   console.log("Sucessfully saved "+result)
      // }).catch((err)=>{
      //   console.log("error while saving new reult"+err)
      // })
      // res.send(auth)
    }
  }
  );


app.post('/makePassword',authenticateToken,async(req,res)=>{//This route stores the choosen object sequence as password
  //recieve the token and derive the contents
 //jwt verification
  var newData=req.body.ojectSequence;
  console.log("insid ethe makepassword route"+newData)
  newData=newData.toString();
  const hashSequence = bcrypt.hashSync(newData, 12);
  checkUser=await checkUserName(req.body.userName)
  if(checkUser){
    //update the 
    authEntry.findOneAndUpdate({userName:req.body.userName}, {objectSequence:hashSequence}, {upsert: true}, function(err, doc) {
          if (err){console.log('errorr'+err)}
          else{
            res.send({status:"updated"})
          }
      });
  }
  else{
    const auth =new authEntry({
      userName:req.body.userName,
      emailId:req.body.emailId,
      password:req.body.password,  
      quote:"",
      objectSequence:hashSequence
    })
    auth.save().then((result)=>{
      console.log("Sucessfully saved "+result)
      res.send({status:"created"})
    }).catch((err)=>{
      console.log("error while saving new reult"+err)
      res.send(err)
    })
  }
  
  // res.send(auth
  // console.log(newData)
  // authEntry.findOneAndUpdate(query, {objectSequence:hashSequence}, {upsert: true}, function(err, doc) {
  //     if (err){console.log('errorr'+err)}
  //     else{
  //       res.send('sucessfully updated')
      // }
  // });
})
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------




//this logic will also be used to calculate the totp before serving the gridimage while login

app.get('/dashboard',authenticateToken,async (req, res) => {
	try {
		const email = req.user.email
		const user = await authEntry.findOne({ emailId: email })
    console.log(user)
		res.send({ status: 'ok', quote: user.quote })
	} catch (error) {
		console.log(error)
		res.send({ status: 'error', error: 'invalid token' })
	}
})

app.post('/dashboard',authenticateToken,async (req, res) => {
 
  const quote=req.body.quote
  console.log(quote)
	try {
		const email = req.user.email
		const user = await authEntry.findOneAndUpdate({ emailId: email },{quote:quote})
    console.log(user)
		res.send({ status: 'ok', quote: user.quote })
	} catch (error) {
		console.log(error)
		res.send({ status: 'error', error: 'invalid token' })
	}
})
//The next Feature is for forgot Password 
//Check is the username exists
//If the emailID and Password Matches
//send it to Make Password
app.post('/forgotPassword',async(req,res)=>{
  console.log('Inside forgotpassword route'+req.body.userName)
  u= await checkUserName(req.body.userName)
  if(u){
    console.log(u)
    cred= await checkCredentials(req.body.userName,req.body.password)
    console.log("after i"+cred)
    if(cred){
      const token = jwt.sign(
        {
          userName:req.body.userName,
          emailId:req.body.emailAddress, 
        },
        'secret123',
        { expiresIn: 5000 }
      )
      res.send({status:'ok', user:token})
    }
    else{
      res.send(false)
    }
  }
})



//__________
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

async function checkUserName(x){
  console.log("inside checkusername "+x)
  result = await authEntry.findOne({userName:x})
  console.log(result)
  if(result){
      return(true)
  }
  else{
    return(false)
  }
}
async function  checkCredentials(x,y){
  result =await authEntry.findOne({ userName: x})
  console.log(result.password)
  res=bcrypt.compare(y, result.password)
    if (res) {
      console.log("inside checkCredentials"+x)
      return(true)
    }
    else{
      return(false)
    }
    }

function authenticateToken(req, res, next) {
	const token = req.headers['x-access-token']
  console.log(token)
  if (token == null) return res.sendStatus(401)
  try{
    user= jwt.verify(token, 'secret123')
    console.log(user)
    if(res){
      req.user=user
      console.log(req)
      next()
    }
  }
  catch{
    return res.sendStatus(403)
  }
}