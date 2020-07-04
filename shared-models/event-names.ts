/**
 * enums for socket.io events
 */
export enum EventName {
  JOIN_ROOM = 'joinRoom',
  CREATE_ROOM = 'createRoom',
  LEAVE_ROOM = 'leaveRoom',
  CONFIRM_GAME_CONNECTION = 'confirmGameConnection',
  UPDATE_PUBLIC_STATE = 'updatePublicState',
  UPDATE_PRIVATE_STATE = 'updatePrivateState',
  COMMAND_TO_SERVER = 'commandToServer',
}
