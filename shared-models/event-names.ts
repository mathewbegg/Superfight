/**
 * enums for socket.io events
 */
export enum EventName {
  JOIN_ROOM = 'joinRoom',
  CREATE_ROOM = 'createRoom',
  LEAVE_ROOM = 'leaveRoom',
  JOIN_ROOM_SUCCESS = 'joinRoomSuccess',
  CREATE_ROOM_SUCCESS = 'createRoomSuccess',
  UPDATE_PUBLIC_STATE = 'updatePublicState',
  UPDATE_PRIVATE_STATE = 'updatePrivateState',
  COMMAND_TO_SERVER = 'commandToServer',
}
