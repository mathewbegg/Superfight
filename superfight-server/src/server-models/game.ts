import {
  Player,
  Card,
  GameState,
  PhaseName,
  CommandToServer,
  PlayerAction,
  PrivateState,
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
  private originalFighterA: Card[];
  private originalFighterB: Card[];
  private tieBreaking = false;
  private playersWhoVoted: { [id: string]: boolean } = {};
  gameState = new BehaviorSubject<GameState>(null);
  privateState = new BehaviorSubject<PrivateState>(null);

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
      this.advanceToSelectingPhase();
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

  updatePrivateState() {
    if (!this.playerA.champion) {
      this.privateState.next({
        playerId: this.playerA.id,
        payload: {
          whiteOptions: [
            this.whiteDeck.drawCard(),
            this.whiteDeck.drawCard(),
            this.whiteDeck.drawCard(),
          ],
          blackOptions: [
            this.blackDeck.drawCard(),
            this.blackDeck.drawCard(),
            this.blackDeck.drawCard(),
          ],
        },
      });
    }
    this.privateState.next({
      playerId: this.playerB.id,
      payload: {
        whiteOptions: [
          this.whiteDeck.drawCard(),
          this.whiteDeck.drawCard(),
          this.whiteDeck.drawCard(),
        ],
        blackOptions: [
          this.blackDeck.drawCard(),
          this.blackDeck.drawCard(),
          this.blackDeck.drawCard(),
        ],
      },
    });
  }

  addPlayer(player: Player) {
    player.score = 0;
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
          this.advanceToVotingPhase();
        } else {
          this.gameLog('ERROR', 'Only The leader can start the voting phase');
        }
        break;
      case PlayerAction.PLAYER_VOTE:
        if (
          playerId !== this.playerA.id &&
          playerId !== this.playerB.id &&
          !this.playersWhoVoted[playerId]
        ) {
          this.voteFor(command.payload);
          this.playersWhoVoted[playerId] = true;
        }
    }
  }

  advanceToSelectingPhase(champion?: Player, rematch = false) {
    this.phaseName = PhaseName.SELECTING;
    this.tieBreaking = false;
    if (!rematch && !champion) {
      this.playerA = this.playerList[0];
      this.playerB = this.playerList[1];
    } else if (!rematch) {
      const previousLoser =
        champion.id === this.playerA.id ? this.playerB : this.playerA;
      let challengerIndex = this.playerList
        .map((player) => player.id)
        .indexOf(previousLoser.id);
      while (
        this.playerList[challengerIndex].id === champion.id ||
        this.playerList[challengerIndex].id === previousLoser.id
      ) {
        challengerIndex = (challengerIndex + 1) % this.playerList.length;
      }
      this.playerA = champion;
      this.playerB = this.playerList[challengerIndex];
    }
    this.updateGameState();
    this.updatePrivateState();
  }

  selectFighter(playerId: string, command: CommandToServer) {
    const extraCardsForWhite = this.resolveSpecials(command.payload.white);
    const extraCardsForBlack = this.resolveSpecials(command.payload.black);
    if (playerId === this.playerA.id) {
      this.playerA.selectedFighter = [
        command.payload.white,
        ...extraCardsForWhite,
        command.payload.black,
        ...extraCardsForBlack,
        this.blackDeck.drawCard(),
      ];
      if (this.playerB.selectedFighter) {
        this.advanceToDebatePhase();
      }
    }
    if (playerId === this.playerB.id) {
      this.playerB.selectedFighter = [
        command.payload.white,
        ...extraCardsForWhite,
        command.payload.black,
        ...extraCardsForBlack,
        this.blackDeck.drawCard(),
      ];
      if (this.playerA.selectedFighter) {
        this.advanceToDebatePhase();
      }
    }
  }

  /**strips the !WHITE_DECK and !BLACK_DECK tokens from the resolvedSpecials string, and builds the corresponding array of drawn cards.
   * If a special card is drawn, it is ignored and a new card is drawn*/
  resolveSpecials(card: Card): Card[] {
    const numWhite = (card?.resolvedSpecial?.match('!WHITE_DECK') || []).length;
    const numBlack = (card?.resolvedSpecial?.match('!BLACK_DECK') || []).length;
    card.text.replace(/!WHITE_DECK|!BLACK_DECK/gm, '');

    const res: Card[] = [];
    let drawnWhiteCard: Card;
    let drawnBlackCard: Card;
    for (let i = 0; i < numWhite; i++) {
      while (!drawnWhiteCard || drawnWhiteCard.specials) {
        drawnWhiteCard = this.whiteDeck.drawCard();
      }
      res.push(drawnWhiteCard);
    }
    for (let i = 0; i < numBlack; i++) {
      while (!drawnBlackCard || drawnBlackCard.specials) {
        drawnBlackCard = this.blackDeck.drawCard();
      }
      res.push(drawnBlackCard);
    }
    return res;
  }

  advanceToDebatePhase() {
    if (this.phaseName === PhaseName.SELECTING) {
      const fighterA = this.playerA.selectedFighter;
      const fighterB = this.playerB.selectedFighter;
      this.phaseName = PhaseName.DEBATING;
      this.gameLog(
        'INFO',
        `${this.playerA.name} selects ${fighterA[0].text} ${fighterA[1].text} ${fighterA[2].text}`
      );
      this.gameLog(
        'INFO',
        `${this.playerB.name} selects ${fighterB[0].text} ${fighterB[1].text} ${fighterB[2].text}`
      );
    } else if (this.phaseName === PhaseName.TIEBREAKER) {
      this.gameLog(
        'INFO',
        `${this.playerA} assigned ${this.playerA.selectedFighter[0]} for tie breaker`
      );
      this.gameLog(
        'INFO',
        `${this.playerB} assigned ${this.playerB.selectedFighter[0]} for tie breaker`
      );
      this.phaseName = PhaseName.DEBATING;
    } else {
      this.gameLog(
        'INFO',
        'Tried to advance to debate phase at an improper time'
      );
    }
    this.updateGameState();
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

  advanceToVotingPhase() {
    if (this.phaseName === PhaseName.DEBATING) {
      this.phaseName = PhaseName.VOTING;
      this.playersWhoVoted = {};
      this.playerA.votes = 0;
      this.playerB.votes = 0;
      this.updateGameState();
    } else {
      this.gameLog(
        'ERROR',
        'Tried to advance to voting phase at improper time'
      );
    }
  }

  voteFor(letter: string) {
    if (letter.toUpperCase() === 'A') {
      this.playerA.votes++;
    } else {
      this.playerB.votes++;
    }
    if (
      this.playerA.votes + this.playerB.votes ===
      this.playerList.length - 2
    ) {
      if (this.playerA.votes > this.playerB.votes) {
        this.advanceToWinnerPhase('A');
      } else if (this.playerB.votes > this.playerA.votes) {
        this.advanceToWinnerPhase('B');
      } else {
        this.advanceToTieBreakerPhase();
      }
    }
  }

  advanceToWinnerPhase(letter: string) {
    this.phaseName = PhaseName.WINNER;
    if (letter === 'A') {
      this.playerA.champion = true;
      this.playerB.champion = false;
      this.playerA.score++;
      this.gameLog(
        'INFO',
        `${this.playerA.name} won the round, scored increased to ${this.playerA.score}`
      );
      this.updateGameState();
      setTimeout(() => {
        //continue after 5 seconds
        if (this.tieBreaking && this.originalFighterA) {
          this.playerA.selectedFighter = this.originalFighterA;
        }
        this.advanceToSelectingPhase(this.playerA);
      }, 5000);
    } else {
      this.playerB.champion = true;
      this.playerA.champion = false;
      this.playerB.score++;
      this.gameLog(
        'INFO',
        `${this.playerB.name} won the round, scored increased to ${this.playerB.score}`
      );
      this.updateGameState();
      setTimeout(() => {
        //continue after 5 seconds
        if (this.tieBreaking && this.originalFighterB) {
          this.playerB.selectedFighter = this.originalFighterB;
        }
        this.advanceToSelectingPhase(this.playerB);
      }, 5000);
    }
  }

  advanceToTieBreakerPhase() {
    this.phaseName = PhaseName.TIEBREAKER;
    this.gameLog('INFO', 'Vote is a tie, commencing tie breaker');
    this.playerA.votes = 0;
    this.playerB.votes = 0;
    if (!this.tieBreaking) {
      this.originalFighterA = this.playerA.selectedFighter;
      this.originalFighterB = this.playerB.selectedFighter;
    }
    this.tieBreaking = true;
    this.playerA.selectedFighter = [this.whiteDeck.drawCard()];
    this.playerB.selectedFighter = [this.whiteDeck.drawCard()];
    this.updateGameState();
    setTimeout(() => {
      //continue after 5 seconds
      this.advanceToDebatePhase();
    }, 5000);
  }

  getPlayerList(): Player[] {
    return this.playerList;
  }

  /**Sets all players scores to 0, and all champions to false */
  clearScores() {
    this.playerList = this.playerList.map((player) => {
      return { ...player, score: 0, champion: false };
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
