let firstTime = true;
let layer = 0;
const { getAllUsers } = require('../users/index');

const attendant = async (req, res) => {
    const { content } = req.body;
    const greetings = "Olá tudo bom?     Estou aqui para lhe ajudar. | Digite 1 para listar todos os usuários do sistema. | Digite 2 para ver as horas. | Digite 3 para encerrar.";

    if (firstTime) {
        firstTime = false;
        return res.status(200).json(greetings);
    }

    switch (content) {
        case "1":
            try {
                await getAllUsers(req, res);
            } catch (error) {
                return res.status(400).json(error.message)
            }
            break;
        case "2":
            return res.status(200).json(new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }));
        case "3":
            firstTime = true;
            return res.status(200).json("Encerrando.");
        default:
            return res.status(400).json(greetings);
    }
}

module.exports = {

}