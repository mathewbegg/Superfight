import { GameState, Card, GamePhase } from '../../../shared-models';
import { SuperfightGame } from './game';
import { Deck } from './deck';

/**A map of roomNames to their game object */
export interface RoomList {
  [roomName: string]: SuperfightGame;
}

/**A map of all players to the roomName they are in */
export interface AllPlayersList {
  [playerId: string]: string;
}
