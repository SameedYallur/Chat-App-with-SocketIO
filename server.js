const express = require('express')
const http = require('http');
const { Socket } = require('net');
const path = require('path')
const socketio = require('socket.io');

const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')


const app = express();
const server = http.createServer(app); //?app will run whenever request is sent to server
const io = socketio(server)

// setting the static folder here to use
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCort Bot';

//run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome the current user
        socket.emit('message', formatMessage(botName, 'Welcome to chat cord')) // message received only to user

        //Broadcast when user connects
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has joined the chat`)
            );
        // message receives to everyone except user ,3rd one is io.emit which will emit to everyone without exception

         // Send users and room info
    io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });

    //Listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, console.log(`Server is listening to port ${PORT}`))