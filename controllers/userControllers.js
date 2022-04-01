const User = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const upload = require("../middleware/fileUpload");

//USER REGISTER

const register = async (req, res, next) => {
  upload(req, res, async (err) => {
    try {
      const { name, email, password } = req.body;
      const Checkuser = await User.findOne({ email: email });
      const CheckUsername = await User.findOne({ username: name });
      if (err) {
        res.status(400).json({ message: err });
        next(err);
        return;
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: name,
        email: email,
        password: hashPassword,
        image: req.file.filename,
      });
      const user = await newUser.save();
      res
        .status(200)
        .json({ message: "user succesfully register", user: user });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  });
};
//USER LOGIN
const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email: email });

    if (!checkUser) {
      res.json({ message: "incorrect Email", status: false });
      return;
    }
    const matchPassword = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!matchPassword) {
      return res.json({ message: "wrong password", status: false });
    }
    const token = jwt.sign(
      {
        id: checkUser._id,
        name: checkUser.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const { password, ...info } = checkUser._doc;
    const user = {
      ...info,
      token,
    };
    res.status(200).json({ message: "user successfully login", user });
  } catch (error) {
    next(error);
  }
};

//GET ALL USER
const allUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users: users });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  allUsers,
  userLogin,
};
