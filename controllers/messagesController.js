const Messages = require("../model/messageModel");

const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.status(200).json({ msg: " Message Added Successfully" });
    } else {
      return res
        .status(400)
        .json({ msg: " Failed to add message to the database!" });
    }
  } catch (error) {
    next(error);
  }
};
const getMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updateAt: 1 });
    const projectedMessages = messages.map((message) => {
      return {
        fromSelf: message.sender.toString() === to,
        message: message.message.text,
      };
    });
    res.status(200).json({ msg: projectedMessages });
  } catch (error) {}
};
module.exports = {
  addMessage,
  getMessage,
};
