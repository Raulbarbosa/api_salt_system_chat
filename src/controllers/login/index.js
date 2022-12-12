const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../../connection');

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ "message": "Please fill all the fields." });
    }

    try {

        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(400).json({ message: "email or password invalid." })
        }

        const passwordVerified = await bcrypt.compare(password, user.password);

        if (!passwordVerified) {
            return res.status(400).json({ message: "email or password invalid." })
        }

        const { password: _, ...userLogin } = user;

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name
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