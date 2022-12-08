const knex = require('../connection');
const jwt = require('jsonwebtoken');

const authenticated = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "Not authorized." })
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, process.env.PRIVATEKEY);

        const user = await knex('users').where({ id }).first();

        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        const { password: _, ...userFound } = user;

        req.user = userFound;

        next();

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = authenticated;