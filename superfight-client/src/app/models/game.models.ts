export enum PhaseName {
  SELECTING = 'SELECTING',
  DEBATING = 'DEBATING',
  VOTING = 'VOTING',
}

export enum PlayerAction {
  FIGHTER_SELECTION = 'FIGHTER_SELECTION',
  PLAYER_VOTE = 'PLAYER_VOTE',
  START_VOTING = 'START_VOTING',
}

export enum CardColor {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export const BLANK_UI_STATE: UiState = {
  name: null,
  id: null,
  playerList: null,
  cards: null,
  isLeader: null,
  isPlaying: null,
  gameState: null,
  privateState: null,
};

export interface Card {
  text: string;
  color: string;
}

export interface packageToServer {
  action: PlayerAction;
  payload: any;
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

export interface Fighter {}

export interface SelectionPair {
  white: Card;
  black: Card;
}

export interface Player {
  id: string;
  name: string;
  isLeader?: boolean;
  votes?: number;
  selectedFighter?: Card[];
}

export interface playerScore {
  name: string;
  id: string;
  score: number;
}

export interface GameState {
  phase: GamePhase;
  scoreboard: playerScore[];
}

export interface PrivateState {}

export interface UiState {
  name: string;
  id: string;
  playerList: Player[];
  cards: Card[];
  isLeader: boolean;
  isPlaying: boolean;
  gameState: GameState;
  privateState: any;
  playerA?: Player;
  playerB?: Player;
  whiteSelection?: Card;
  blackSelection?: Card;
  lockedIn?: boolean;
}

export interface privatePackage {
  whiteOptions: Card[];
  blackOptions: Card[];
}

export interface GamePhase {
  phaseName: PhaseName;
  playerA: Player;
  playerB: Player;
}

export interface SelectingPhase extends GamePhase {
  phaseName: PhaseName.SELECTING;
}

export interface DebatingPhase extends GamePhase {
  phaseName: PhaseName.DEBATING;
}

export interface VotingPhase extends GamePhase {
  phaseName: PhaseName.VOTING;
  playerA: {
    name: string;
    id: string;
    votes: number;
  };
  playerB: {
    name: string;
    id: string;
    votes: number;
  };
}
