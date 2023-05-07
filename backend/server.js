const express = require("express");
const cors = require("cors");
const connection = require("./connection.js");
const func = require("./routes/functions.js");
const app = express();
const dotevn = require("dotenv");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 750;
const jwt = require("jsonwebtoken");

const authEntry = require("./authEntry.js");
app.use(express.json());
dotevn.config();
const DB_Key = process.env.DB_Key;
//connecting to Database
connection(DB_Key);
const animals = [
  "dog",
  "cow",
  "horse",
  "cat",
  "elephant",
  "sheep",
  "squirille",
  "hen",
  "spider",
];

app.use(cors());
app.use(express.static("Images/"));
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/", async (req, res) => {
  const grid = [];

  console.log("Username for Grid" + req.body.username);
  //shuffle the object and then randomize the images
  shuffle(animals);
  const loginObjectSequence = animals.toString(); //This should be encrypted string
  try {
    authEntry
      .findOneAndUpdate(
        { userName: req.body.username },
        { loginObjectSequence: loginObjectSequence },
        { upsert: true }
      )
      .then(() => {
        console.log(
          "Shuffled Animals Updated :{" + animals + "}Now sending it to user"
        );
        for (let i = 0; i < 9; i++) {
          const ranomImageNumber = Math.floor(
            Math.random() * (1500 - 1000 + 1) + 1000
          );
          grid[i] =
            "http://localhost:750/" +
            animals[i] +
            "/" +
            ranomImageNumber +
            ".jpg";
        }
        console.log(grid);
        // res.send(loginObjectSequence)
        res.send(grid);
      });
  } catch (err) {
    res.send({ status: "error" });
  }
});

app.post("/verifyPin", async (req, res) => {
  //recieve the loginObjectSequence
  var loginObjectSequence = "";
  var loginEnteredSequence = [];
  var pin_index;
  var hashedPasswordSequence = "";
  var loggedIn;
  var userName;
  var email;
  console.log(req.body);
  await authEntry.findOne({ userName: req.body.userName }).then((result) => {
    userName = result.userName;
    email = result.emailId;
    //decrypt the loginObjectSequence
    loginObjectSequence = result.loginObjectSequence;
    loginObjectSequence = loginObjectSequence.split(",");
    console.log(loginObjectSequence);
    hashedPasswordSequence = result.objectSequence;
  });
  console.log(hashedPasswordSequence);
  //deconstructing the pin object sequence
  if (req.body.pin > 9) {
    pin_index = req.body.pin.split("");
  } else {
    pin_index = [req.body.pin];
  }
  // console.log(pin_index)
  for (i in pin_index) {
    c = parseInt(pin_index[i]) - 1;
    loginEnteredSequence.push(loginObjectSequence[c]);
    // console.log("c"+c+"Entered"+loginEnteredSequence)
  }
  loginEnteredSequence = loginEnteredSequence.toString();
  //comparing with DB
  loggedIn = bcrypt.compareSync(loginEnteredSequence, hashedPasswordSequence);

  if (loggedIn) {
    const token = jwt.sign(
      {
        name: userName,
        email: email,
      },
      "secret123",
      { expiresIn: 50000 }
    );
    res.send({ status: "ok", user: token });
  } else {
    res.send({ status: "error", user: false });
  }
});

app.post("/verifyUsername", async (req, res) => {
  //1. We verify if the userName exists or not
  result = await func.checkUserName(req.body.userName);
  authEntry.findOne({ userName: req.body.userName }).then((result) => {
    if (result) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/register", async (req, res) => {
  //This route stores the other information of the user
  console.log(
    "Recieved a register_request with UserName:" +
      req.body.userName +
      ", EmailAddress:" +
      req.body.emailAddress +
      ", Password:" +
      req.body.password
  );
  //CHECK WITH THE DATABASE IS THE USERNAME EXISTS
  result = await func.checkUserName(req.body.userName);
  console.log(result);
  if (result) {
    res.send(false);
  } else {
    const hashPassword = bcrypt.hashSync(req.body.password, 12);
    //As the Username does Not Exists i will make an entry of other object properties.
    const token = jwt.sign(
      {
        userName: req.body.userName,
        emailId: req.body.emailAddress,
        password: hashPassword,
        quote: "",
      },
      "secret123",
      { expiresIn: 50000 }
    );
    res.send({ status: "ok", user: token });
  }
});

app.post("/makePassword", func.authenticateToken, async (req, res) => {
  //This route stores the choosen object sequence as password
  //recieve the token and derive the contents
  //jwt verification
  var newData = req.body.ojectSequence;
  console.log("Sequence Password recieved:" + newData);
  newData = newData.toString();
  const hashSequence = bcrypt.hashSync(newData, 12);
  checkUser = await func.checkUserName(req.body.userName);

  if (checkUser) {
    //update the
    console.log("Inside Updated section");
    authEntry.findOneAndUpdate(
      { userName: req.body.userName },
      { objectSequence: hashSequence },
      { upsert: true },
      function (err, doc) {
        if (err) {
          console.log("errorr" + err);
        } else {
          console.log();
          res.send("updated");
        }
      }
    );
  } else {
    const auth = new authEntry({
      userName: req.body.userName,
      emailId: req.body.emailId,
      password: req.body.password,
      quote: "",
      objectSequence: hashSequence,
    });
    auth
      .save()
      .then((result) => {
        console.log("Sucessfully saved " + result);
        res.send("created");
      })
      .catch((err) => {
        console.log("error while saving new reult" + err);
        res.status(500).send("An unknown error occurred.");
      });
  }
});
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

//this logic will also be used to calculate the totp before serving the gridimage while login

app.get("/dashboard", func.authenticateToken, async (req, res) => {
  try {
    const name = req.user.name;
    const user = await authEntry.findOne({ userName: name });
    console.log(user);
    res.send({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", error: "invalid token" });
  }
});

app.post("/dashboard", func.authenticateToken, async (req, res) => {
  const quote = req.body.quote;
  console.log(quote);
  try {
    const name = req.user.name;
    const user = await authEntry.findOneAndUpdate(
      { userName: name },
      { quote: quote }
    );
    console.log(user);
    res.send({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});
//The next Feature is for forgot Password
//Check is the username exists
//If the emailID and Password Matches
//send it to Make Password
app.post("/forgotPassword", async (req, res) => {
  console.log("Inside forgotpassword route" + req.body.userName);
  u = await func.checkUserName(req.body.userName);
  console.log(u);
  if (!u) {
    res.send({ status: "username", data: false });
  }
  if (u) {
    console.log(req.body.userName + "and" + req.body.password);
    cred = await func.checkCredentials(req.body.userName, req.body.password);
    console.log("Credentials " + cred);
    if (cred) {
      const token = jwt.sign(
        {
          userName: req.body.userName,
          emailId: req.body.emailAddress,
        },
        "secret123",
        { expiresIn: 50 }
      );
      res.send({ status: "ok", user: token });
    } else {
      res.send({ status: "password", data: false });
    }
  }
});

//__________
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
