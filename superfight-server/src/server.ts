import * as express from 'express';
import * as _ from 'lodash';
import { Server } from 'http';
import { MongoClient, Db } from 'mongodb';
import { Socket } from 'socket.io';

const mongoConnectionString = 'mongodb://localhost:27017';
var db: Db;

const server = new Server(express()).listen(3000, () => {
  console.log('Listening at :3000...');
});

const io = require('socket.io')(server);

MongoClient.connect(
  mongoConnectionString,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log('mongoDB connected');
    db = client.db('superfightDB');
    io.on('connection', (socket: Socket) => {
      //   userConnect(socket);
      console.log(socket.id);
    });
  }
);
