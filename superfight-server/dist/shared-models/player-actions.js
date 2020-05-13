"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerAction;
(function (PlayerAction) {
    PlayerAction["JOIN_ROOM"] = "JOIN_ROOM";
    PlayerAction["FIGHTER_SELECTION"] = "FIGHTER_SELECTION";
    PlayerAction["PLAYER_VOTE"] = "PLAYER_VOTE";
    PlayerAction["START_VOTING"] = "START_VOTING";
})(PlayerAction = exports.PlayerAction || (exports.PlayerAction = {}));
class PackageJoinRoom {
    constructor(payload) {
        this.action = PlayerAction.JOIN_ROOM;
        this.payload = payload;
    }
}
exports.PackageJoinRoom = PackageJoinRoom;
class packageFighterSelection {
    constructor(payload) {
        this.action = PlayerAction.FIGHTER_SELECTION;
        this.payload = payload;
    }
}
exports.packageFighterSelection = packageFighterSelection;
class packageStartVoting {
    constructor() {
        this.action = PlayerAction.START_VOTING;
    }
}
exports.packageStartVoting = packageStartVoting;
class packageVote {
    constructor(payload) {
        this.action = PlayerAction.PLAYER_VOTE;
        this.payload = payload;
    }
}
exports.packageVote = packageVote;
//# sourceMappingURL=player-actions.js.map