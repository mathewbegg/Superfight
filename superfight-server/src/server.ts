import * as express from 'express';
import { Server } from 'http';
import { MongoClient, Db } from 'mongodb';
import { Socket } from 'socket.io';
import { RoomList, AllPlayersList } from './server-models';
import {
  CommandJoinRoom,
  Card,
  CommandToServer,
  PrivateState,
  GameState,
} from '../../shared-models';
import { SuperfightGame } from './server-models/game';

const mongoConnectionString = 'mongodb://localhost:27017';
var db: Db;
var whiteCatalogue: Card[];
var blackCatalogue: Card[];

const server = new Server(express()).listen(3000, () => {
  console.log('Listening at :3000...');
});

const io = require('socket.io')(server);

const rooms: RoomList = {};
const allPlayers: AllPlayersList = {};

MongoClient.connect(
  mongoConnectionString,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log('mongoDB connected');
    db = client.db('superfightDB');
    fetchWhiteCatalogue();
    fetchBlackCatalogue();
    io.on('connection', (socket: Socket) => {
      userConnect(socket);
      console.log(`${socket.id} connected`);
    });
  }
);

function userConnect(socket: Socket) {
  socket.on('joinRoom', (action: CommandJoinRoom) => {
    const player = action.payload.player;
    const roomName = action.payload.roomName;
    socket.join(roomName);
    if (rooms[roomName]) {
      rooms[roomName].addPlayer(player);
      allPlayers[player.id] = roomName;
      console.log(`${player.name}-${player.id} joining room: ${roomName}`);
    } else {
      rooms[roomName] = new SuperfightGame(
        roomName,
        whiteCatalogue,
        blackCatalogue
      );
      rooms[roomName].addPlayer(player);
      allPlayers[player.id] = roomName;
      console.log(`${player.name}-${player.id} created room: ${roomName}`);
      rooms[roomName].gameState.subscribe((gameState: GameState) => {
        io.to(roomName).emit('updatePublicState', gameState);
      });
      rooms[roomName].privateState.subscribe((privateState: PrivateState) => {
        if (privateState?.playerId) {
          io.to(privateState.playerId).emit(
            'updatePrivateState',
            privateState.payload
          );
        }
      });
    }
    socket.on('commandToServer', (command: CommandToServer) => {
      rooms[roomName].parseCommand(player.id, command);
    });
    socket.on('leaveRoom', () => {
      if (rooms[roomName]) {
        rooms[roomName].removePlayer(player);
        console.log(`${player.name}-${player.id} left room: ${roomName}`);
      }
      if (!rooms[roomName]?.getPlayerList().length) {
        delete rooms[roomName];
        console.log(`deleting empty room: ${roomName}`);
      }
      socket.leave(roomName);
    });
  });
}

async function fetchWhiteCatalogue() {
  whiteCatalogue = await db
    .collection('testWhiteSpecialsCollection')
    .find()
    .toArray();
}

async function fetchBlackCatalogue() {
  blackCatalogue = await db.collection('blackCatalogue').find().toArray();
}
