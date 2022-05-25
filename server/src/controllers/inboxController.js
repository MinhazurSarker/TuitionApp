const User = require('./../models/User');
const Message = require('./../models/Message');
const Chat = require('../models/Chat');

//-------------------------------
const comeToInbox = async (req, res) => {
    if(req.body.userId.toString()!== req.body.chatWith.toString()){
        try {
            const chat = await Chat.findOne({
                members: { $all: [req.body.userId.toString(), req.body.chatWith.toString()] },
            });
            res.status(200).json({ chatId: chat._id })
        } catch {
            try {
                const newChat = new Chat({
                    members: [req.body.userId.toString(), req.body.chatWith.toString()],
                });
                newChat.save();
                res.status(200).json({ chatId: newChat._id });
            } catch {
                res.status(500).json({ msg: 'Oops! something went wrong' });
            }
        }
    }else{
        res.status(400).json({ msg: 'You can not chat with yourself' });
    }
}
const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ members: { $in: [req.body.userId.toString()] } })
        res.status(200).send({ chats: chats, currentUser: req.body.userId.toString() })
    } catch {
        res.status(200).send({ msg: 'You do not have any conversation' })
    }

}


const newMessage = async (req, res) => {
    try {
        const newMsg = await new Message({
            sender: req.body.userId.toString(),
            chatId: req.body.chatId,
            text: req.body.text,
            image: req.body.image,
        });
        newMsg.save();
        res.status(200).json('success')
    } catch (error) {
        res.status(400).json(error)
    }
}
const getMessage = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.chatId.toString() });
        const friendId = chat.members.find((m) => m !== req.body.userId.toString())
        const messages = await Message.find({chatId: req.params.chatId});
        res.status(200).json({ messages: messages, currentUser: req.body.userId.toString(), friendId: friendId });
    } catch (err) {
        res.status(200).json({ messages: [], currentUser: null, friendId: null });
    }
}

module.exports = {
    comeToInbox,
    getChats,
    newMessage,
    getMessage,
}