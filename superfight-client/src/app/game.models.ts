export enum GameStageName {
  SELECTING = 'SELECTING',
  DEBATING = 'DEBATING',
  VOTING = 'VOTING',
}

export enum CardColor {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export interface Card {
  text: string;
  color: string;
}

export interface playerScore {
  name: string;
  id: string;
  score: number;
}

export interface GameState {
  stage: GameStage;
  scoreboard: playerScore[];
}

export interface GameStage {
  stageName: GameStageName;
  playerA: any;
  playerB: any;
}

export interface SelectingStage extends GameStage {
  stageName: GameStageName.SELECTING;
  playerA: {
    name: string;
    id: string;
    whiteOptions: Card[];
    blackOptions: Card[];
  };
  playerB: {
    name: string;
    id: string;
    whiteOptions: Card[];
    blackOptions: Card[];
  };
}

export interface DebatingStage extends GameStage {
  stageName: GameStageName.DEBATING;
  playerA: { name: string };
  playerB: { name: string };
}

export interface VotingStage extends GameStage {
  stageName: GameStageName.VOTING;
  playerA: { name: string };
  playerB: { name: string };
}
