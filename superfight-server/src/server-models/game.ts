import {
  Player,
  Card,
  PlayerScore,
  GameState,
  PhaseName,
} from '../../../shared-models';
import { Deck } from './deck';

export class SuperfightGame {
  private roomName: string;
  private playerList: Player[];
  private whiteDeck: Deck;
  private blackDeck: Deck;
  private phaseName: PhaseName;
  private playerA: Player;
  private playerB: Player;

  constructor(
    roomName: string,
    whiteCards: Card[],
    blackCards: Card[],
    initialPlayerList: Player[] = []
  ) {
    this.roomName = roomName;
    this.playerList = initialPlayerList;
    this.clearScores();

    this.whiteDeck = new Deck(whiteCards, false);
    this.blackDeck = new Deck(blackCards, false);
  }

  newGame() {
    if (this.playerList.length >= 3) {
      this.clearScores();
      this.whiteDeck.shuffle();
      this.blackDeck.shuffle();
      this.phaseName = PhaseName.SELECTING;
      this.playerA = this.playerList[0];
      this.playerB = this.playerList[1];
    } else {
      console.error('Cannot start a game with fewer than 3 players.');
    }
  }

  getGameState(): GameState {
    return {
      phase: {
        phaseName: this.phaseName,
        playerA: this.playerA,
        playerB: this.playerB,
      },
      scoreboard: this.playerList.map((player) => {
        return { id: player.id, name: player.name, score: player.score || 0 };
      }),
    };
  }

  getPlayerList(): Player[] {
    return this.playerList;
  }

  clearScores() {
    this.playerList = this.playerList.map((player) => {
      return { ...player, score: 0 };
    });
  }
}
