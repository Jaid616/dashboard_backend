const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const registerUser = async (req, res) => {
  const { name, email, number, password, confirmpassword } = req.body;

  const user =
    (await userModel.findOne({ email: email })) ||
    (await userModel.findOne({ number: number }));
  if (user) {
    res
      .status(400)
      .json({ message: "Email Address or Mobile Number is already Register" });
  } else {
    if (name && email && number && password && confirmpassword) {
      if (password === confirmpassword) {
        try {
          const salt = await bcrypt.genSalt();
          const hashpasword = await bcrypt.hash(password, salt);
          const data = new userModel({
            name: name,
            email: email,
            number: number,
            password: hashpasword,
          });

          await data.save();
          res.status(201).json({ message: "User Registration Succefully" });
        } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
        }
      } else {
        res.status(400).json({ message: "Password and Match" });
      }
    } else {
      res.status(400).json({ message: "All field are required" });
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (email) {
    if (password) {
      const user = await userModel.findOne({ email: email });
      if (user) {
        try {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            const token = jwt.sign(
              { userID: user.id },
              process.env.SECRET_KEY,
              { expiresIn: "1d" }
            );
            res.cookie(String(user.id), token, {
              path: "/",
              expires: new Date(Date.now() + 1000 * 90000),
              httpOnly: true,
              sameSite:"none",
              Secure
             
            });

            res.status(200).json({ status: "Login Succesfully" });
          } else {
            res.status(400).json({ message: "Email or Pasword is incorrect" });
          }
        } catch (error) {
          res.send(error);
        }
      } else {
        res.status(400).json({ message: "Email or Pasword is incorrect" });
      }
    } else {
      res.status(400).json({ message: "Pasword is Required" });
    }
  } else {
    res.status(400).json({ message: "Email Address is Required" });
  }
};

const userData = (req, res) => {
  res.status(200).json(req.User);
};

const changePassword = async (req, res) => {
  const { oldpassword, newpassword, confirmnewpassword } = req.body;

  if (oldpassword && newpassword && confirmnewpassword) {
    try {
      if (newpassword === confirmnewpassword) {
        let user = await userModel.findById(req.User.id);
        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (isMatch) {
          const checkOldNewMatch = await bcrypt.compare(
            newpassword,
            user.password
          );
          if (!checkOldNewMatch) {
            const salt = await bcrypt.genSalt();
            const newhashpassword = await bcrypt.hash(newpassword, salt);

            await userModel.findByIdAndUpdate(req.User.id, {
              $set: { password: newhashpassword },
            });
            res.status(201).json({ message: "Password Change Successfully" });
          } else {
            res
              .status(400)
              .json({ message: "old Password new Password Cannot be same" });
          }
        } else {
          res.status(400).json({ message: "Old Password not Match" });
        }
      } else {
        res.status(400).json({ message: "Confirm Password not match" });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({ message: "All Field are Required ! " });
  }
};

const auth = (req, res) => {
  res.status(200).json({ status: "Login Succesfully" });
};
const logout = (req, res) => {
  let user = req.User;
  try {
    res.clearCookie(user.id, {
      sameSite: "none",
      secure: true,
    });
    res.json({ status: "Logout Succesfully" });
  } catch (error) {
    res.status(404).json({ message: "Unable to Logout" });
  }
};

const sendmail = async (req, res) => {
  let { name, email, msg } = req.body;
  if(name && email && msg ){

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
    Port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD, 
    },
  });
  try {
    let info = await transporter.sendMail({
      from: `${name} <foo@example.com>`, // sender address
      to: process.env.SMTP_USERNAME, // list of receivers
      subject: "PortFolio website ✔", // Subject line
      html: `<b>Name : ${name}</b> <br><b>Email : ${email}</b> <br><b>Message : ${msg}</b>`,
    });
    res.status(201).json({ message: "Message Send Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to send message try again " });
  }
}
else{
  res.status(400).json({message:"All Field are required"})
}
}


module.exports = {
  registerUser,
  loginUser,
  userData,
  changePassword,
  auth,
  logout,
  sendmail,
};
