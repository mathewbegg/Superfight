import * as express from 'express';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { RoomList, AllPlayersList, CatalogueConnection } from './server-models';
import {
  CommandJoinRoom,
  Card,
  CommandToServer,
  PrivateState,
  GameState,
  EventName,
} from '../../shared-models';
import { SuperfightGame } from './server-models/game';
import { DynamoCatalogue } from './catalogue-connections/dynamoCatalogue';

var whiteCatalogue: Card[];
var blackCatalogue: Card[];

const server = new Server(express()).listen(3000, () => {
  console.log('Listening at :3000...');
});

const io = require('socket.io')(server);

const catalogueConnection: CatalogueConnection = new DynamoCatalogue();
const rooms: RoomList = {};
const allPlayers: AllPlayersList = {};

Promise.all([
  catalogueConnection.getWhiteCatalogue(),
  catalogueConnection.getBlackCatalogue(),
]).then((decks) => {
  whiteCatalogue = decks[0];
  blackCatalogue = decks[1];
  io.on('connection', (socket: Socket) => {
    userConnect(socket);
    console.log(`${socket.id} connected`);
  });
});

function userConnect(socket: Socket) {
  socket.on(EventName.JOIN_ROOM, (action: CommandJoinRoom) => {
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
        io.to(roomName).emit(EventName.UPDATE_PUBLIC_STATE, gameState);
      });
      rooms[roomName].privateState.subscribe((privateState: PrivateState) => {
        if (privateState?.playerId) {
          io.to(privateState.playerId).emit(
            EventName.UPDATE_PRIVATE_STATE,
            privateState.payload
          );
        }
      });
    }
    socket.emit(EventName.CONFIRM_GAME_CONNECTION);
    socket.on(EventName.COMMAND_TO_SERVER, (command: CommandToServer) => {
      rooms[roomName].parseCommand(player.id, command);
    });
    socket.on(EventName.LEAVE_ROOM, () => {
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
