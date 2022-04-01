const {
  register,
  allUsers,
  userLogin,
} = require("../controllers/userControllers");
const upload = require("../middleware/fileUpload");

const router = require("express").Router();

//file multer
router.post("/singel", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("reqbody", req.body);
      console.log("file", req.file);
    }
  });
  console.log("name hitted");
  res.send("single file upload success");
});
router.post("/register", register);
router.get("/allusers", allUsers);
router.post("/userLogin", userLogin);
module.exports = router;
