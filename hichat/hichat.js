const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io').listen(server);

app.use("/",express.static(__dirname + "/public"));

server.listen(3300);
console.log('running!');

var onlineUsers = [];

io.on('connection',function(socket){
    socket.on('login',function(data){
        io.sockets.emit("system",data+" 加入聊天");
        console.log(data+"connect");
    })
    socket.on('exit',function(data){
        io.sockets.emit("system",data+"exit");
        console.log(data+"exit");
    })
    socket.on('postNewMsg',function(data){
        console.log(data)
        socket.emit('newMsgBySelf',data);
        socket.broadcast.emit('newMsg',data);
    })
    socket.on('disconnect',function(){
        console.log('lose one user!');
    })
})

