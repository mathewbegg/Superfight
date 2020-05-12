const Express = require('express')();
const Http = require('http').Server(Express);
const io = require('socket.io')(Http);
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');

Http.listen(3000, () => {
  console.log('Listening at :3000...');
});

const mongoConnectionString = 'mongodb://localhost:27017';
var db;
var playerList = [];
var masterGameState = {};
var matchupList;
const SELECTING_PHASE = 'SELECTING';
const DEBATING_PHASE = 'DEBATING';
const VOTING_PHASE = 'VOTING';
const START_VOTING_ACTION = 'START_VOTING';
const FIGHTER_SELECTION_ACTION = 'FIGHTER_SELECTION';
const PLAYER_VOTE_ACTION = 'PLAYER_VOTE';

MongoClient.connect(
  mongoConnectionString,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log('mongoDB connected');
    db = client.db('superfightDB');
    io.on('connection', (socket) => {
      userConnect(socket);
    });
  }
);

function userConnect(socket) {
  const playerId = socket.id;
  console.log('a player connected: ' + playerId);

  socket.on('disconnect', () => {
    console.log('a player disconnected: ' + playerId);
    playerList = playerList.filter((player) => player.id !== playerId);
    updatePlayerList();
  });

  socket.on('setName', (name) => {
    console.log(`${playerId} identified as: ${name}`);
    const player = { id: playerId, name: name };
    playerList.push(player);
    updatePlayerList();
  });

  socket.on('newGame', () => {
    if (playerId && playerList.length >= 3 && playerList[0].id === playerId) {
      newGame(socket);
    } else {
      console.log('cannot start game');
    }
  });

  socket.on('clientPackage', (package) => {
    parseClientPackage(socket, package);
  });
}

function updatePlayerList() {
  console.log('CURRENT PLAYERS\n---------------');
  if (!playerList.length) {
    console.log('NONE');
  } else {
    playerList[0].isLeader = true;
    playerList.forEach((player) => {
      console.log(
        `${player.name} : ${player.id} ${player.isLeader ? '(leader)' : ''}`
      );
    });
  }
  console.log('---------------');
  io.emit('listPlayers', playerList);
}

async function newGame(socket) {
  await shuffleWhiteDeck();
  await shuffleBlackDeck();
  masterGameState.players = playerList.map((player) => {
    return {
      ...player,
      timesPlayed: 0,
      score: 0,
    };
  });
  matchupList = [];
  playerList.forEach((playerA) => {
    playerList.forEach((playerB) => {
      if (playerA.id !== playerB.id) {
        matchupList.push({
          playerA: playerA,
          playerB: playerB,
          timesPlayed: 0,
        });
      }
    });
  });
  masterGameState.scoreboard = generateFreshScoreboard(playerList);
  masterGameState.phase = findMatchup();
  updateClients();
}

function updateClients() {
  const phase = masterGameState.phase;
  const updatePackage = {
    phase: phase,
    scoreboard: masterGameState.scoreboard,
  };

  io.emit('updatePublicState', updatePackage);
  if (phase.phaseName === 'SELECTING') {
    sendFightSelectionOptions();
  }
}

function parseClientPackage(socket, package) {
  const wrongStateMessage = `socket ${socket.id} submitted a package invalid with the current gameState`;
  switch (package.action) {
    case FIGHTER_SELECTION_ACTION:
      if (validateSelectionPackage(socket, package)) {
        selectFighter(socket, package);
      } else {
        console.error(wrongStateMessage);
      }
      break;
    case START_VOTING_ACTION:
      if (playerList[0].id === socket.id) {
        startVoting();
      } else {
        console.error('Only the leader can start the voting phase');
      }
      break;
    case PLAYER_VOTE_ACTION:
      playerVote(package.payload);
      break;
    default:
      console.error(
        `socket ${socket.id} submitted a package with an invalid action`
      );
  }
}

function validateSelectionPackage(socket, package) {
  const isPlayersTurn =
    socket.id === masterGameState.phase.playerA.id ||
    socket.id === masterGameState.phase.playerB.id;
  const hasProperPayload = !!package.payload.white && !!package.payload.black;
  return isPlayersTurn && hasProperPayload;
}

function selectFighter(socket, package) {
  const playerA = masterGameState.phase.playerA;
  const playerB = masterGameState.phase.playerB;
  if (playerA.id === socket.id) {
    playerA.selectedFighter = [
      package.payload.white,
      package.payload.black,
      drawBlackCard(),
    ];
    if (playerB.selectedFighter) {
      advanceToDebatePhase();
    }
  }
  if (playerB.id === socket.id) {
    playerB.selectedFighter = [
      package.payload.white,
      package.payload.black,
      drawBlackCard(),
    ];
    if (playerA.selectedFighter) {
      advanceToDebatePhase();
    }
  }
}

function sendFightSelectionOptions() {
  if (masterGameState.whiteDeck.length < 6) {
    shuffleWhiteDeck();
  }
  if (masterGameState.blackDeck.length < 6) {
    shuffleBlackDeck();
  }
  const packageA = {
    whiteOptions: [
      masterGameState.whiteDeck.pop(),
      masterGameState.whiteDeck.pop(),
      masterGameState.whiteDeck.pop(),
    ],
    blackOptions: [
      masterGameState.blackDeck.pop(),
      masterGameState.blackDeck.pop(),
      masterGameState.blackDeck.pop(),
    ],
  };
  const packageB = {
    whiteOptions: [
      masterGameState.whiteDeck.pop(),
      masterGameState.whiteDeck.pop(),
      masterGameState.whiteDeck.pop(),
    ],
    blackOptions: [
      masterGameState.blackDeck.pop(),
      masterGameState.blackDeck.pop(),
      masterGameState.blackDeck.pop(),
    ],
  };
  io.to(masterGameState.phase.playerA.id).emit('updatePrivateState', packageA);
  io.to(masterGameState.phase.playerB.id).emit('updatePrivateState', packageB);
}

function startVoting() {
  if (masterGameState.phase.phaseName === DEBATING_PHASE) {
    masterGameState.phase.phaseName = VOTING_PHASE;
    updateClients();
  }
}

function playerVote(vote) {
  if (vote === 'A') {
    masterGameState.phase.playerA.votes++;
  } else if (vote === 'B') {
    masterGameState.phase.playerB.votes++;
  }
  if (
    masterGameState.phase.playerA.votes +
      masterGameState.phase.playerB.votes ===
    playerList.length - 2
  ) {
    console.log('All Votes In!');
  }
}

async function shuffleWhiteDeck() {
  masterGameState.whiteDeck = _.shuffle(
    await db.collection('whiteCatalogue').find().toArray()
  );
}

async function shuffleBlackDeck() {
  masterGameState.blackDeck = _.shuffle(
    await db.collection('blackCatalogue').find().toArray()
  );
}

function drawBlackCard() {
  return masterGameState.blackDeck.pop();
}

/**
 * Finds a suitable matchup,
 * adjusts matchupList accordingly,
 * returns the resulting selecting phase,
 */
function findMatchup() {
  const firstPlayer = masterGameState.players[0];
  let secondPlayer;
  let matchupFound = false;
  for (let i = 0; i < matchupList.length; i++) {
    if (!matchupFound) {
      if (matchupList[i].playerA.id === firstPlayer.id) {
        secondPlayer = matchupList[i].playerB;
        matchupList[i].timesPlayed++;
        matchupFound = true;
      } else if (matchupList.playerB.id === firstPlayer.id) {
        secondPlayer = matchupList[i].playerA;
        matchupList[i].timesPlayed++;
        matchupFound = true;
      }
    }
    if (
      matchupFound &&
      i < matchupList.length - 1 &&
      matchupList[i] >= matchupList[i + 1]
    ) {
      //shifting matchup to proper place in queue
      const temp = matchupList[i];
      matchupList[i] = matchupList[i + 1];
      matchupList[i + 1] = temp;
    }
  }
  return generateSelectingPhase(firstPlayer, secondPlayer);
}

function generateSelectingPhase(playerA, playerB) {
  return {
    phaseName: SELECTING_PHASE,
    playerA: playerA,
    playerB: playerB,
  };
}

function advanceToDebatePhase() {
  const phase = masterGameState.phase;
  const fighterA = phase.playerA.selectedFighter;
  const fighterB = phase.playerB.selectedFighter;
  console.log(
    `${masterGameState.phase.playerA.name} selects ${fighterA[0].text} ${fighterA[1].text} ${fighterA[2].text}`
  );
  console.log(
    `${masterGameState.phase.playerB.name} selects ${fighterB[0].text} ${fighterB[1].text} ${fighterB[2].text}`
  );
  if (phase.phaseName === SELECTING_PHASE && phase.playerA && phase.playerB) {
    phase.phaseName = DEBATING_PHASE;
    phase.playerA.votes = 0;
    phase.playerB.votes = 0;
    updateClients();
  } else {
    console.error('Insufficient conditions to move to debate stage');
  }
}

function generateFreshScoreboard(players) {
  return players.map((player) => {
    return { ...player, score: 0 };
  });
}
