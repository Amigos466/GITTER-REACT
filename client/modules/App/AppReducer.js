// Import Actions
import { TOGGLE_ADD_POST, LOGIN_TO, MESSAGES, GET_USERS_ROOM, MESSAGE_CALLBACK, FIND_ROOMS } from './AppActions';

// Initial State
const initialState = {
  showAddPost: false,
  user_info: {"user": {"displayName": "login"}, "rooms": []},
  messages: {"messages": []},
  listusers: {"users": []},
  roomsquery: '',
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_TO:
      return {
        ...state,
        user_info: action.user_id,
      };
    case MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case GET_USERS_ROOM:
      return {
        ...state,
        listusers: action.listusers,
      };
    case MESSAGE_CALLBACK:
      return {
        ...state,
        result: action.result,
      };
    case FIND_ROOMS:
      return {
        ...state,
        roomsquery: action.query.rooms.results,
      };

    default:
      return state;
  }
};

/* Selectors */

// Get showAddPost
export const getUserInfo = state => state.app;
export const getUserRooms = state => state.app.user_info.rooms;
export const getUserRoomsQuery = state => state.app.roomsquery;
export const getMessages = state => state.app.messages;
export const getListUsers = state => state.app.listusers.users;

// Export Reducer
export default AppReducer;
