import { Player, Card, GameState } from '../../../../shared-models';
export * from '../../../../shared-models';

export const BLANK_UI_STATE: UiState = {
  name: null,
  id: null,
  playerList: null,
  cards: null,
  isLeader: null,
  isPlaying: null,
  isChampion: null,
  gameState: null,
  privateState: null,
};

export interface UiState {
  name: string;
  id: string;
  playerList: Player[];
  cards: Card[];
  isLeader: boolean;
  isPlaying: boolean;
  isChampion: boolean;
  gameState: GameState;
  privateState: any;
  whiteSelection?: Card;
  blackSelection?: Card;
  lockedIn?: boolean;
}
