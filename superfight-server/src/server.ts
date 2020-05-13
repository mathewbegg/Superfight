import * as express from 'express';
import * as _ from 'lodash';
import { Server } from 'http';
import { MongoClient, Db } from 'mongodb';
import { Socket } from 'socket.io';
import { RoomList } from './server-models';
import { GameRoom, PackageJoinRoom } from '../../shared-models';

const mongoConnectionString = 'mongodb://localhost:27017';
var db: Db;

const server = new Server(express()).listen(3000, () => {
  console.log('Listening at :3000...');
});

const io = require('socket.io')(server);

const rooms: RoomList = {};

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
      userConnect(socket);
      console.log(`${socket.id} connected`);
    });
  }
);

function userConnect(socket: Socket) {
  socket.on('joinRoom', (action: PackageJoinRoom) => {
    const player = action.payload.player;
    const roomName = action.payload.roomName;
    if (rooms[roomName]) {
      console.log('room found');
    } else {
      console.log('creating room');
      rooms[roomName] = { playerList: [player], gameState: null };
    }
    console.log('-------------');
    console.log(rooms[roomName].playerList.map((player) => player.name));
    console.log('-------------');
  });
}
