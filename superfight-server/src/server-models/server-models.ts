import {
  GameState,
  PlayerScore,
  Card,
  GamePhase,
} from '../../../shared-models';
import { SuperfightGame } from './game';
import { Deck } from './deck';

export interface RoomList {
  [roomName: string]: SuperfightGame;
}
