import { Card } from '../../../shared-models';
import { SuperfightGame } from './game';

/**A map of roomNames to their game object */
export interface RoomList {
  [roomName: string]: SuperfightGame;
}

/**A map of all players to the roomName they are in */
export interface AllPlayersList {
  [playerId: string]: string;
}

/**Abstracted so I can constantly flip between MongoDB and DynamoDB as I change my mind */
export interface CatalogueConnection {
  getWhiteCatalogue(): Promise<Card[]>;
  getBlackCatalogue(): Promise<Card[]>;
}
