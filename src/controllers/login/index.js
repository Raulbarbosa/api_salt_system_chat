const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../../connection');

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ "message": "Please fill all the fields." });
    }

    try {

        const user = await knex('users').where({ username }).first();

        if (!user) {
            return res.status(400).json({ message: "Username or password invalid." })
        }

        const passwordVerified = await bcrypt.compare(password, user.password);

        if (!passwordVerified) {
            return res.status(400).json({ message: "Username or password invalid." })
        }

        const { password: _, ...userLogin } = user;

        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, process.env.PRIVATEKEY)

        return res.status(200).json({
            user: userLogin,
            token
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = login;