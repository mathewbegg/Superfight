import {
  Player,
  Card,
  GameState,
  PhaseName,
  CommandToServer,
  PlayerAction,
} from '../../../shared-models';
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
      this.gameLog('ERROR', 'Cannot start a game with fewer than 3 players.');
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

  parseCommand(playerId: string, command: CommandToServer) {
    this.gameLog('INFO', ' recieved command: ', command);
    switch (command.action) {
      case PlayerAction.NEW_GAME:
        if (this.playerList[0].id === playerId) {
          this.newGame();
        } else {
          this.gameLog('ERROR', 'Only the leader can start a new game');
        }
        break;
      case PlayerAction.FIGHTER_SELECTION:
        if (this.validateFighterSelection(playerId, command)) {
          this.selectFighter(playerId, command);
        } else {
          this.gameLog('ERROR', 'Invalid Fighter Selection');
        }
        break;
      case PlayerAction.START_VOTING:
        if (this.playerList[0].id === playerId) {
          this.startVoting();
        } else {
          this.gameLog('ERROR', 'Only The leader can start the voting phase');
        }
    }
  }

  selectFighter(playerId: string, command: CommandToServer) {
    if (playerId === this.playerA.id) {
      this.playerA.selectedFighter = [
        command.payload.white,
        command.payload.black,
        this.blackDeck.drawCard(),
      ];
      if (this.playerB.selectedFighter) {
        this.advanceToDebatePhase();
      }
    }
    if (playerId === this.playerB.id) {
      this.playerB.selectedFighter = [
        command.payload.white,
        command.payload.black,
        this.blackDeck.drawCard(),
      ];
      if (this.playerA.selectedFighter) {
        this.advanceToDebatePhase();
      }
    }
  }

  advanceToDebatePhase() {
    if (this.phaseName === PhaseName.SELECTING) {
      const fighterA = this.playerA.selectedFighter;
      const fighterB = this.playerB.selectedFighter;
      this.phaseName = PhaseName.DEBATING;
      this.gameLog(
        'INFO',
        `${this.roomName}: ${this.playerA.name} selects ${fighterA[0].text} ${fighterA[1].text} ${fighterA[2].text}`
      );
      this.gameLog(
        'INFO',
        `${this.roomName}: ${this.playerB.name} selects ${fighterB[0].text} ${fighterB[1].text} ${fighterB[2].text}`
      );
      this.updateGameState();
    } else {
      this.gameLog(
        'INFO',
        'Tried to advance to debate phase at an improper time'
      );
    }
  }

  validateFighterSelection(
    playerId: string,
    command: CommandToServer
  ): boolean {
    const isPlayersTurn =
      playerId === this.playerA.id || playerId === this.playerB.id;
    const hasProperPayload = !!command.payload.white && !!command.payload.black;
    return isPlayersTurn && hasProperPayload;
  }

  startVoting() {
    if (this.phaseName === PhaseName.DEBATING) {
      this.phaseName = PhaseName.VOTING;
      this.updateGameState();
    } else {
      this.gameLog(
        'ERROR',
        'Tried to advance to voting phase at improper time'
      );
    }
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

  gameLog(type: string, ...message: any[]) {
    if (type === 'ERROR') {
      console.error(this.roomName, ': ', ...message);
    } else if (type === 'INFO') {
      console.error(this.roomName, ': ', ...message);
    } else if (type === 'WARN') {
      console.warn(this.roomName, ': ', ...message);
    } else {
      console.log(this.roomName, ': ', ...message);
    }
  }
}
