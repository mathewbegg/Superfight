import { Card, Player } from './shared-models';

export enum PlayerAction {
  JOIN_ROOM = 'JOIN_ROOM',
  NEW_GAME = 'NEW_GAME',
  FIGHTER_SELECTION = 'FIGHTER_SELECTION',
  PLAYER_VOTE = 'PLAYER_VOTE',
  START_VOTING = 'START_VOTING',
}

export interface CommandToServer {
  action: PlayerAction;
  payload: any;
}

export interface SelectionPair {
  white: Card;
  black: Card;
}

export interface RoomJoinRequest {
  player: Player;
  roomName: string;
}

export class CommandJoinRoom implements CommandToServer {
  action = PlayerAction.JOIN_ROOM;
  payload: RoomJoinRequest;

  constructor(payload: RoomJoinRequest) {
    this.payload = payload;
  }
}

export class CommandNewGame implements CommandToServer {
  action = PlayerAction.NEW_GAME;
  payload: null;
}

export class CommandFighterSelection implements CommandToServer {
  action = PlayerAction.FIGHTER_SELECTION;
  payload: SelectionPair;

  constructor(payload: SelectionPair) {
    this.payload = payload;
  }
}

export class CommandStartVoting implements CommandToServer {
  action = PlayerAction.START_VOTING;
  payload: null;
}

export class CommandVote implements CommandToServer {
  action = PlayerAction.PLAYER_VOTE;
  payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }
}
