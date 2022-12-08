require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const routes = require('./src/routes');

const app = express();
app.use(cors());
app.options('*', cors());
const server = http.createServer(app);
app.use(express.json());
app.use(routes);


const io = new socketIO.Server(server, {
    cors: {
        origin: "*"
    }
});



io.on('connection', socket => {
    console.log('New user connected.');

    socket.on('send_message', () => {
        socket.broadcast.emit('send_message', '');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected')
    });
})

server.listen(process.env.PORT);