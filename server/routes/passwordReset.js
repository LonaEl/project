import express from "express";
import mongoose from 'mongoose'
const app = express();
app.use(express.json());
import cors from "cors";
app.use(cors());
import dotenv from 'dotenv'
dotenv.config();
import bcrypt from "bcryptjs";
app.use(express.urlencoded({ extended: false })); 
const router = express.Router();

import jwt from "jsonwebtoken";
import  nodemailer from "nodemailer";

//for forgot password, we particularly need the jwt secret, connect to the database and getting the users available in the database

const JWT_SECRET = process.env.JWT


const User = mongoose.model("User");


//getting the data/email from the database

router.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
     const email = user.email;
    User.findOne({ email: email })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});


router.post("/", async (req, res) => {
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
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'witsie101@gmail.com',
        pass: 'zaftqbnuedacdirh',
      },
    });

    var mailOptions = {
      from: 'witsie101@gmail.com',
      to: email,
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


export default router;

//id and token are params, structure of the link   
router.get("/reset-password/:id/:token", async (req, res) => {
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

router.post("/reset-password/:id/:token", async (req, res) => {
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