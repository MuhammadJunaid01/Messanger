const router = require("express").Router();
const { addMessage, getMessage } = require("../controllers/messagesController");

router.post("/addmessage", addMessage);
router.post("/getMessages", getMessage);

module.exports = router;
