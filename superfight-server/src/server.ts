import * as express from 'express';
import { Server } from 'https';
import { Socket } from 'socket.io';
import { RoomList, AllPlayersList, CatalogueConnection } from './server-models';
import {
  CommandJoinRoom,
  Card,
  Player,
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
  socket.on(EventName.CREATE_ROOM, (answer) => {
    const roomCode = genRoomCode(4);
    rooms[roomCode] = new SuperfightGame(
      roomCode,
      whiteCatalogue,
      blackCatalogue
    );
    console.log(`created room: ${roomCode}`);
    rooms[roomCode].gameState.subscribe((gameState: GameState) => {
      io.to(roomCode).emit(EventName.UPDATE_PUBLIC_STATE, gameState);
    });
    rooms[roomCode].privateState.subscribe((privateState: PrivateState) => {
      if (privateState?.playerId) {
        io.to(privateState.playerId).emit(
          EventName.UPDATE_PRIVATE_STATE,
          privateState.payload
        );
      }
    });
    socket.emit(EventName.CREATE_ROOM_SUCCESS, roomCode);
  });

  socket.on(EventName.JOIN_ROOM, (action: CommandJoinRoom) => {
    const player: Player = action.payload.player;
    const roomName: string = action.payload.roomName;
    socket.join(roomName);

    if (rooms[roomName]) {
      rooms[roomName].addPlayer(player);
      allPlayers[player.id] = roomName;
      console.log(`${player.name}-${player.id} joining room: ${roomName}`);
      socket.emit(EventName.JOIN_ROOM_SUCCESS);
    } else {
      console.error(
        `${player.name}-${player.id} tried joining a room that doesn't exist: ${roomName}`
      );
    }

    socket.on(EventName.COMMAND_TO_SERVER, (command: CommandToServer) => {
      rooms[roomName].parseCommand(player.id, command);
    });

    socket.once(EventName.LEAVE_ROOM, () => {
      removePlayerAndDeleteIfEmpty(player, roomName);
      socket.removeAllListeners(EventName.COMMAND_TO_SERVER);
      socket.leave(roomName);
    });

    socket.once('disconnect', (reason) => {
      console.log(
        `${player.name}-${player.id} disconnected. Reason: ${reason}`
      );
      removePlayerAndDeleteIfEmpty(player, roomName);
      socket.removeAllListeners(EventName.COMMAND_TO_SERVER);
    });
  });
}

function removePlayerAndDeleteIfEmpty(player: Player, roomCode: string) {
  if (rooms[roomCode]) {
    rooms[roomCode].removePlayer(player);
    console.log(`${player.name}-${player.id} left room: ${roomCode}`);
  }
  if (!rooms[roomCode]?.getPlayerList().length) {
    delete rooms[roomCode];
    console.log(`deleting empty room: ${roomCode}`);
  }
}

/**
 * Generates a random room code of given length
 * @param length length of the room code
 */
function genRoomCode(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
