const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
import dotenv from 'dotenv'
dotenv.config();
const bcrypt = require("bcryptjs");
//app.set("view engine", "ejs"); //shows the html and javascript in node, instead of connecting to the UI
app.use(express.urlencoded({ extended: false })); //passing data from backend to react

const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

//for forgot password, we particularly need the jwt secret, connect to the database and getting the users available in the database

const JWT_SECRET = process.env.JWT

const mongoUrl = process.env.DB

  //connected to database or not
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));


//import the schema UuserDetails
require("./userDetails");


//Register or sign up 
/* const User = mongoose.model("UserInfo");
app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
}); */


//sign in or login
/* app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "Invalid email or password" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid email or password" });
}); */


//getting the data/email from the database
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log(user);

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});


app.listen(5000, () => {
  console.log("Server Started");
});




app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "Email does not exist!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`; //email sent to the user. Upon clicking, it redirects to reset-password 
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ME,
        pass: process.env.PASS,
      },
    });

    var mailOptions = {
      from: process.env.ME,
      to: process.env.USER,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) {}
});

//id and token are params, structure of the link   
app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params; //is the token and id of the user the same? 
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body; //I can add an option to see if "Confirm Password" is same as password

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User does not exist" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});