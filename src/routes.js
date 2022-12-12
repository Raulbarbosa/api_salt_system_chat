const express = require('express');
const login = require('./controllers/login');
const { createMessage, getAllMessages, getDirectMessage } = require('./controllers/messages');
const { createUser, getUser, getAllUsers } = require('./controllers/users');
const authenticated = require('./utils/authenticated');

const routes = express();

routes.post('/users', createUser);
routes.post('/login', login);

routes.use(authenticated);

routes.get("/user", getUser);
routes.get("/users", getAllUsers);

routes.post('/messages', createMessage);
routes.get('/messages', getAllMessages);
routes.get('/messages/:email', getDirectMessage);


module.exports = routes;