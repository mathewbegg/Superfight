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
mongodb_1.MongoClient.connect(mongoConnectionString, {
    useUnifiedTopology: true,
}, (err, client) => {
    if (err)
        return console.error(err);
    console.log('mongoDB connected');
    db = client.db('superfightDB');
    io.on('connection', (socket) => {
        //   userConnect(socket);
        console.log(socket.id);
    });
});
//# sourceMappingURL=server.js.map