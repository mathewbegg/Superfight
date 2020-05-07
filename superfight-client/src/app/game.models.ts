export enum PhaseName {
  SELECTING = 'SELECTING',
  DEBATING = 'DEBATING',
  VOTING = 'VOTING',
}

export enum PlayerAction {
  FIGHTER_SELECTION = 'FIGHTER_SELECTION',
  PLAYER_VOTE = 'PLAYER_VOTE',
}

export enum CardColor {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

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

  constructor(payload) {
    this.payload = payload;
  }
}

export interface SelectionPair {
  white: Card;
  black: Card;
}

export interface Player {
  id: string;
  name: string;
  isLeader?: boolean;
  votes?: number;
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
