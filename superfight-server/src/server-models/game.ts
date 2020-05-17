import { Player, Card, GameState, PhaseName } from '../../../shared-models';
import { Deck } from './deck';
import { BehaviorSubject } from 'rxjs';

export class SuperfightGame {
  private roomName: string;
  private playerList: Player[] = [];
  private whiteDeck: Deck;
  private blackDeck: Deck;
  private phaseName: PhaseName;
  private playerA: Player;
  private playerB: Player;
  gameState = new BehaviorSubject<GameState>(null);

  constructor(roomName: string, whiteCards: Card[], blackCards: Card[]) {
    this.roomName = roomName;
    this.phaseName = PhaseName.WAITING;
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
      this.updateGameState();
    } else {
      console.error('Cannot start a game with fewer than 3 players.');
    }
  }

  updateGameState() {
    this.gameState.next(this.generateGameState());
  }

  generateGameState(): GameState {
    return {
      phase: {
        phaseName: this.phaseName,
        playerA: this.playerA,
        playerB: this.playerB,
      },
      playerList: this.playerList.map((player) => {
        return { ...player, score: player.score || 0 };
      }),
    };
  }

  addPlayer(player: Player) {
    this.playerList.push(player);
    this.playerList[0].isLeader = true;
    this.updateGameState();
  }

  removePlayer(player: Player) {
    this.playerList = this.playerList.filter((p) => p.id !== player.id);
    if (this.playerList.length) {
      this.playerList[0].isLeader = true;
    }
    this.updateGameState();
  }

  getPlayerList(): Player[] {
    return this.playerList;
  }

  clearScores() {
    this.playerList = this.playerList.map((player) => {
      return { ...player, score: 0 };
    });
    this.updateGameState();
  }
}
