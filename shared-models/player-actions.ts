import { Card, Player } from './shared-models';

export enum PlayerAction {
  JOIN_ROOM = 'JOIN_ROOM',
  FIGHTER_SELECTION = 'FIGHTER_SELECTION',
  PLAYER_VOTE = 'PLAYER_VOTE',
  START_VOTING = 'START_VOTING',
}

export interface packageToServer {
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

export class PackageJoinRoom implements packageToServer {
  action = PlayerAction.JOIN_ROOM;
  payload: RoomJoinRequest;

  constructor(payload: RoomJoinRequest) {
    this.payload = payload;
  }
}

export class packageFighterSelection implements packageToServer {
  action = PlayerAction.FIGHTER_SELECTION;
  payload: SelectionPair;

  constructor(payload: SelectionPair) {
    this.payload = payload;
  }
}

export class packageStartVoting implements packageToServer {
  action = PlayerAction.START_VOTING;
  payload: null;
}

export class packageVote implements packageToServer {
  action = PlayerAction.PLAYER_VOTE;
  payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }
}
