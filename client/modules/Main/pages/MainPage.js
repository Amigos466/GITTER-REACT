import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { login_to, get_messages_to, get_users_list_to, send_message, search_rooms } from '../../App/AppActions';
import { getMessages, getUserInfo, getUserRooms, getListUsers, getUserRoomsQuery } from '../../App/AppReducer';


let currroom;

class MainPage extends Component {
    constructor(props) {
    super(props);
    this.state = {seconds: 0, once: true, likesIncreasing: false, quared: false, messagetosend: '', currentroom: '', queryroom: '' };
  }
  componentDidMount() {
    setInterval(this.refresh_room, 3000);
    // this.get_messages_toSection(this.props.rooms[0].id);
    // this.get_users_list_toSection('561d4970d33f749381a93ebc');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      likesIncreasing: nextProps.rooms > this.props.rooms,
      quared: nextProps.roomsquery > this.props.roomsquery,
    });
  }

  get_messages_toSection = (e) => {
    this.props.dispatch(get_messages_to(e));
  };

  get_users_list_toSection = (e) => {
    this.props.dispatch(get_users_list_to(e));
  };

  refresh_room = (e) => {
      if (e == undefined){
        e = this.state.currentroom;
      }
      console.log(e);
      if(e != '') {
      this.get_messages_toSection(e);
      this.get_users_list_toSection(e);
      this.setState({
        currentroom: e
      })
    }
  }

  scroller_message = (e) => {
    let element = document.getElementById(e);
    if(element != null){
      element.scrollTop = element.scrollHeight;
    }
  }

  changemessage = (e) => {
    this.setState({
      messagetosend: e
    })
  }

  changequery = (e) => {
    this.setState({
      queryroom: e
    })
  }

  sendquery = () => {
    const query = this.state.queryroom;
    this.props.dispatch(search_rooms(query));
  }

  sendmessage = () => {
    const mess = this.state.messagetosend;
    this.props.dispatch(send_message(this.state.currentroom, mess));
    this.refresh_room(this.state.currentroom);
  }

//  test
   roomsList = () => {
   	let rooms = this.props.rooms;
    if(this.props.roomsquery) {
      rooms = this.props.roomsquery;
    }
	   return (rooms.map(roomitem => {
      return (<li key={roomitem.id} className="list-group-item roomname" onClick={()=> this.refresh_room(roomitem.id)}>{roomitem.name}</li>)
	 }))
  }
  messagesList = () => {
    let messages = this.props.messages.messages;
	   return (messages.map(roomitem => {
      return (<div key={roomitem.id} className="them">
          <img className="avatar_face in_message" src={roomitem.fromUser.avatarUrl} alt=""/>
          <p>{roomitem.text}</p>
          <span>{roomitem.sent}</span>
        </div>)
	 }))
  }

  usersList = () => {
    let users = this.props.listusers;
     return (users.map(useritem => {
      return (<li key={useritem.id} className="list-group-item"><img className="avatar_face" src={useritem.avatarUrl} alt=""/>{useritem.displayName}</li>)
   }))
  }

  render() {

    if(this.state.once && this.state.likesIncreasing) {
      this.setState({
        currentroom: this.props.rooms[0].id,
        once: false
      });
      this.get_messages_toSection(this.props.rooms[0].id);
      this.get_users_list_toSection(this.props.rooms[0].id);
    }


    return (
    <div className="row">
    {this.state.seconds}
    {/*<button onClick={()=> this.scroller_message('message_container')}>aaaaa</button>*/}
      <div className="col-md-3">
        <ul className="list-group rooms_list">
        {this.roomsList()}
        </ul>
      </div>
      <div className="col-md-6 main_chat">
      <div className="chatbox" id="message_container" >
        {/*<div className="isead">
          <img className="avatar_face in_message" src="./assets/images/face_2.JPG" alt=""/>
          <p>Commodi cumque, molestias ad voluptate, consequuntur eligendi! Dicta quidem quibusdam officia quo et blanditiis itaque maxime quia unde, minima, labore accusantium.</p>
          <span>01:50</span>
        </div>*/}
        {this.messagesList()}
      </div>
        <div className="">
           <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea className="form-control" onBlur={(e)=> this.changemessage(e.target.value)} rows="3" id="comment"></textarea>
              <button type="button" className="btn btn-primary main_butt" onClick={()=> this.sendmessage()}>Send</button>
          </div>
        </div>

        </div>
      <div className="col-md-3">
        <ul className="list-group users_list">
          {this.usersList()}
        </ul>
      </div>
    </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    messages: getMessages(state),
    rooms: getUserRooms(state),
    listusers: getListUsers(state),
    currentuser: getUserInfo(state),
    roomsquery: getUserRoomsQuery(state),
  };
}

MainPage.propTypes = {
	rooms: PropTypes.array.isRequired,
  currentuser: PropTypes.object.isRequired,
  listusers: PropTypes.array.isRequired,
  messages: PropTypes.object.isRequired,
};

MainPage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(MainPage);
