const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

var separateUsers = require('./shared/globals').separateUsers;
var app = express();

require("dotenv").config();

// MIDDLEWARES
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:'+ (process.env.PORT || 3000),
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// DATABASE
mongoose.connect(
    process.env.MONGO_URL + 'mychats'
).then(() => {
    console.log('Connected to MongoDB');
}).catch(
    e => {console.log(e.message);}
);

// ROUTERS
const userRouter = require('./routes/user');
const messageRouter = require('./routes/messages');
const imageRouter = require('./routes/image');


// ROUTES
app.use('/user', userRouter);
app.use('/message', messageRouter);
app.use('/image', imageRouter);

// SERVER CONNECTION
const server = app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + (process.env.PORT || 3000));
});

// SOCKET CONNECTION
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(socket.id + ' has connected');

    socket.on('joinRoom', (data) => {
        socket.join(data.roomId);
        
        console.log(socket.id + ' joined the room ' + data.roomId);
        socket.to(data.roomId).emit(socket.id + ' joined');
    });

    socket.on('leaveRoom', (data) => {
        socket.leave(data.roomId);
        
        console.log(socket.id + ' left the room ' + data.roomId);
        socket.to(data.roomId).emit(socket.id + ' left');
    });

    socket.on('disconnectSocket', (data) => {
        socket.disconnect();
        console.log(socket.id + ' disconnected from socket');
    });

    socket.on('findClientsInRoom', async(data) => {
        await findClients(data.roomId);
    });

    socket.on('typing', (data) => {
        socket.broadcast.to(data.roomId).emit('typing');
    })

    socket.on('sendMessage', (data) => {
        const msg = {
            body: data.body,
            sendingTime: data.sendingTime,
            isFile: data.isFile,
            sentBy: data.sentBy
        }

        io.to(data.roomId).emit('sentMessage', msg);
    });

    socket.on('refreshView', (data) => {
        const usersPhoneNumbers = separateUsers(data.roomId);
        console.log(usersPhoneNumbers[0]);
        console.log(usersPhoneNumbers[1]);

        io.to(usersPhoneNumbers[0]).emit('refreshView');
        io.to(usersPhoneNumbers[1]).emit('refreshView');
    })

    socket.on('dataSavedOnCloud', (data) => {

        io.to(data.roomId).emit('dataSaved', {});
    });
});

async function findClients(roomId){
    var sockets = [];
    sockets = await io.in(roomId).fetchSockets();

    const clients = {
        clientList: sockets.length
    };

    io.to(roomId).emit('clientsInRoom', clients);
}