const knex = require('../../connection');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json("Please fill all the fields.");
    }

    if (password.lenght < 6) {
        return res.status(400).json("The password must be greater than five caracters.");
    }

    try {

        const id = uuidv4()

        const userAlreadyExists = await knex("users").where({ email, id }).first();

        if (userAlreadyExists) {
            return res.status(400).json({ message: "User already exists." });
        }

        const passwordEncrypted = await bcrypt.hash(password, 10);

        const user = await knex("users").insert({ name, email, id, password: passwordEncrypted })
        if (!user) {
            return res.status(400).json({ message: "Could not create user." });
        }

        return res.status(200).json("User created");

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getUser = async (req, res) => {
    const { id } = req.user;

    try {

        const userFound = await knex.select(["id", "name", "email"])
            .from("users").where({ id }).first();

        if (!userFound) {
            return res.status(400).json("Not Authorized.")
        }

        return res.status(200).json(userFound);

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const getAllUsers = async (req, res) => {
    const { id } = req.user;

    try {

        const userFound = await knex("users").where({ id }).first();

        if (!userFound) {
            return res.status(400).json("Not Authorized.")
        }

        const allUser = await knex.select(["id", "name", "email"]).from("users");

        return res.status(200).json(allUser);

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    createUser,
    getUser,
    getAllUsers
}