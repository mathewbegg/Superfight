"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const mongodb_1 = require("mongodb");
const mongoConnectionString = 'mongodb://localhost:27017';
var db;
const server = new http_1.Server(express()).listen(3000, () => {
    console.log('Listening at :3000...');
});
const io = require('socket.io')(server);
const rooms = {};
mongodb_1.MongoClient.connect(mongoConnectionString, {
    useUnifiedTopology: true,
}, (err, client) => {
    if (err)
        return console.error(err);
    console.log('mongoDB connected');
    db = client.db('superfightDB');
    io.on('connection', (socket) => {
        userConnect(socket);
        console.log(`${socket.id} connected`);
    });
});
function userConnect(socket) {
    socket.on('joinRoom', (action) => {
        const player = action.payload.player;
        const roomName = action.payload.roomName;
        if (rooms[roomName]) {
            console.log('room found');
        }
        else {
            console.log('creating room');
            rooms[roomName] = { playerList: [player], gameState: null };
        }
        console.log('-------------');
        console.log(rooms[roomName].playerList.map((player) => player.name));
        console.log('-------------');
    });
}
//# sourceMappingURL=server.js.map