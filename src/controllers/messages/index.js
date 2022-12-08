const knex = require('../../connection');
const { v4: uuidv4 } = require('uuid');

const createMessage = async (req, res) => {
    const { target, content } = req.body;
    const { username } = req.user;

    if (!target || !content || !username) {
        return res.status(400).json("Please fill all the fields.");
    }

    try {

        const sender = await knex('users').where({ username }).first();

        if (!sender) {
            return res.stats(400).json("Onwer of the message not found.");
        }

        const recipient = await knex('users').where({ username: target }).first();

        if (!recipient) {
            return res.status(400).json("Receiver of the message not found.")
        }

        const message = await knex("messages").insert({ recipient_id: recipient.id, content, sender_id: sender.id, id: uuidv4() });

        if (!message) {
            return res.status(500).json("The message can not be sent.")
        }

        return res.status(200).json("The message has been sent.")

    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const getAllMessages = async (req, res) => {
    const { username, id } = req.user;

    try {

        const user = await knex('users').where({ username }).first();

        if (!user) {
            return res.status(400).json({ message: "User not found." })
        }

        const messages = await knex('messages').where('sender_id', id);

        if (!messages) {
            return res.status(400).json({ message: "Task not found." })
        }

        return res.status(200).json(messages)

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const getDirectMessage = async (req, res) => {
    const { username, id } = req.user;
    const { username: target } = req.params;

    try {

        const user = await knex('users').where({ username }).first();

        if (!user) {
            return res.status(400).json({ message: "User not found." })
        }

        const targetFound = await knex('users').where({ username: target }).first();

        if (!user) {
            return res.status(400).json({ message: "User not found." })
        }

        let allMessages = [];

        // const messages = await knex('messages').where('sender_id', id).where('recipient_id', targetFound.id).debug();
        const messagesFromSender = await knex('messages').where('sender_id', id).where('recipient_id', targetFound.id);
        const messagesFromRecipient = await knex('messages').where('sender_id', targetFound.id).where('recipient_id', id);

        for (item of messagesFromSender) {
            allMessages.push(item)
        }
        for (item of messagesFromRecipient) {
            allMessages.push(item)
        }

        allMessages.sort(function (x, y) {
            return x.create_at - y.create_at;
        })

        return res.status(200).json(allMessages);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

module.exports = {
    createMessage,
    getAllMessages,
    getDirectMessage
}