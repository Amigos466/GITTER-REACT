import callApi from '../../util/apiCaller';

// Export Constants
export const TOGGLE_ADD_POST = 'TOGGLE_ADD_POST';
export const MESSAGE_CALLBACK = 'MESSAGE_CALLBACK';
export const LOGIN_TO = 'LOGIN_TO';
export const MESSAGES = 'MESSAGES';
export const GET_USERS_ROOM = 'GET_USERS_ROOM';
export const FIND_ROOMS = 'FIND_ROOMS';
export const JOIN_ROOM = 'JOIN_ROOM';

// Export Actions

export function login_to() {
  return (dispatch) => {
    return callApi('curusr').then(res => {
      dispatch(login_to_d(res));
    });
  }
}

export function get_messages_to(roomId) {
  return (dispatch) => {
    return callApi('getmessages', 'post', {
      roomId: roomId,
    }).then(res => dispatch(get_messages(res)));
  };
}

export function get_users_list_to(roomId) {
  return (dispatch) => {
    return callApi('getusersroom', 'post', {
      roomId: roomId,
    }).then(res => dispatch(get_users_room(res)));
  };
}

export function send_message(roomId, text) {
  return (dispatch) => {
    return callApi('sendmessage', 'post', {
      roomId: roomId,
      text: text,
    }).then(res => dispatch(send_message_responce(res)));
  };
}

export function search_rooms(query) {
  return (dispatch) => {
    return callApi('searchroom', 'post', {
      query: query,
    }).then(res => dispatch(searchroom(res)));
  };
}

export function toggleAddPost() {
  return {
    type: TOGGLE_ADD_POST,
  };
}

export function login_to_d(user_id) {
  return {
    type: LOGIN_TO,
    user_id,
  };
}

export function get_messages(messages) {
  return {
    type: MESSAGES,
    messages,
  };
}

export function get_users_room(listusers) {
  return {
    type: GET_USERS_ROOM,
    listusers,
  };
}

export function send_message_responce(result) {
  return {
    type: MESSAGE_CALLBACK,
    result,
  };
}

export function searchroom(query) {
  return {
    type: FIND_ROOMS,
    query,
  };
}