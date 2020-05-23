export enum PhaseName {
  WAITING = 'WAITING',
  SELECTING = 'SELECTING',
  DEBATING = 'DEBATING',
  VOTING = 'VOTING',
  TIEBREAKER = 'TIEBREAKER',
  WINNER = 'WINNER',
}

export enum CardColor {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export interface Card {
  text: string;
  color: string;
}

export interface Fighter {}

export interface Player {
  id: string;
  name: string;
  isLeader?: boolean;
  votes?: number;
  score?: number;
  champion?: boolean;
  selectedFighter?: Card[];
}

export interface GameState {
  phase: GamePhase;
  playerList: Player[];
}

export interface PrivateState {
  playerId: string;
  payload: any;
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

export interface WaitingPhase extends GamePhase {
  phaseName: PhaseName.WAITING;
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
