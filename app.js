const path = require("path");

const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const router = express.Router();
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const app = express();  
const server = require('http').Server(app)
const io = socketio(server);
  
app.use(cors()); 
app.use(router); 
 
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));
}

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }  
  });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

io.on('connect', (socket) => {  
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);
    
    socket.join(user.room);

    socket.emit('message', { user: 'AutoModerator', text: `Welcome to room #${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'AutoModerator', text: `${(user.name.charAt(0).toUpperCase() + user.name.slice(1))} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
 
    callback();
  }); 

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
 
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'AutoModerator', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  }) 
});  

 
server.listen(PORT, () => console.log(`Server running at port ${PORT}.`)); 