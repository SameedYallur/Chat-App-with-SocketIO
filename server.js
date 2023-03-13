const express = require('express')
const http = require('http');
const { Socket } = require('net');
const path = require('path')
const socketio = require('socket.io');

const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

// setting the static folder here to use
app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatCort Bot'; 

//run when client connects
io.on('connection',socket => {
    //Welcome the current user
    socket.emit('mesage' , formatMessage(botName , 'Welcome to chat cord')) // message received only to user

    //Broadcast when user connects
    socket.broadcast.emit('message','A user has joined the chat') // message receives to everyone except user

    //Runs when client disconnects
    socket.on('disconnect',() => 
    {
        io.emit('message',formatMessage(botName,'A user has left the chat'))
    });

    //Listen for chat message
    socket.on('chatMessage',msg =>{
        io.emit('message',formatMessage('USER',msg))
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT,console.log(`Server is listening to port ${PORT}`))