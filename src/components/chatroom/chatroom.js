import React, {Component} from 'react';
import logo from '../../logo.svg';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500,
    white
  } from 'material-ui/styles/colors';
import '../../App.css';
import firebase from 'firebase';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {firebaseApp, db, auth, storageKey, isAuthenticated, authData, user} from '../../config/db_config';

const styles = ({
    button: {
        marginTop: 20,
    },

  
    input: {
        width: '100%'
    }
})


  

class Chatroom extends Component {
    constructor(props){
        super(props);
        this.users = db.ref().child('users');
        this.messages = db.ref().child('messages');
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handlerSubmitMessage = this.handlerSubmitMessage.bind(this)
        // this.handlerUserClick = this.handlerUserClick.bind(this);
        this.onItemClickHandler = this.onItemClickHandler.bind(this);
        this.state = {
            loggedinuser: [],
            users: [],
            messages: [],
            newMessage: ''
        }
     
        
    }

    componentWillMount(){
        var loggedinuserEmpty = this.state.loggedinuser;
        const oldUsers = this.state.users;
        const oldMessages = this.state.messages;
        auth.onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                db.ref().child('users/'+ uid).on('value', snap => {
                    loggedinuserEmpty.push({
                        id: snap.key,
                        firstname: snap.child('firstname').val(),
                        lastname: snap.child('lastname').val(),
                        email: snap.child('email').val()
                    });   
                    this.setState({
                        loggedinuser:loggedinuserEmpty
                    })
                })

                this.users.on('child_added', snap => {
                    oldUsers.push({
                        id: snap.key,
                        firstname: snap.child('firstname').val(),
                        lastname: snap.child('lastname').val(),
                        email: snap.child('email').val()
                    })
                    this.setState({
                        users: oldUsers
                    })
                })
                this.messages.on('child_added', snap => {
                    oldMessages.push({
                        id: snap.key,
                        uid: user.uid,
                        firstname: snap.child('firstname').val(),
                        lastname: snap.child('lastname').val(),
                        email: snap.child('email').val(),
                        message: snap.val().userMessage,
                    })
                    this.setState({
                        messages: oldMessages
                    })
                })
            }
        }) 
    }

    onItemClickHandler(){
        // var clickedUser = document.getElementById(userid);
    }
    
    handleLogOut= () => {
        auth.signOut();
    }

    handlerSubmitMessage(userMessage) {
        this.messages.push().set({message: userMessage});
        this.setState({
            newMessage: ''
        })
    }
    
    render(){
        return(
            <div className="App">
            <header className="App-header">
                {
                    this.state.loggedinuser.map((getUserCurrent)=>{
                        return(
                            <div key={getUserCurrent.id} className="header-inner">
                                <img src={logo} className="App-logo" alt="logo" />
                                <h1 className="App-title">Welcome {getUserCurrent.firstname} {getUserCurrent.lastname} to Go Chat</h1>
                            </div>
                        );
                    })
                }
            </header>
            <main>
                <div className="containerChat">
                    <div className="usersList pull-left">
                        <List onClick={this.onItemClickHandler.bind(this)}>
                        {
                            this.state.users.map((singleUser)=>{
                                return(
                                    <ListItem key={singleUser.id} className="userName" id={singleUser.id} disabled={true} rightIcon={<CommunicationChatBubble />} leftAvatar={<Avatar color={white} backgroundColor={purple500} size={50}>{singleUser.firstname? singleUser.firstname.slice(0,1).toUpperCase(): 'U'}</Avatar>}>{singleUser.firstname && singleUser.lastname ? singleUser.firstname + ' ' + singleUser.lastname : 'Unknown' }</ListItem>
                                 
                                );
                            })
                        }
                        </List>
                    </div>
                    <div className="userConvo pull-right">
                        <div className="convo-inner">
                            {
                                this.state.messages.map((singleMessage)=>{
                                    return(
                                        <div className="messageWrap">
                                            <p>{singleMessage.message}</p>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className="msg-submit">
                            <TextField className="submitInput" value={this.state.newMessage} onChange={e => {this.setState({newMessage: e.target.value})}} hintText="Write a little Message Here ..." />
                            <RaisedButton onClick={()=> this.handlerSubmitMessage(this.state.newMessage)} className="submitBtn" type="submit" label="Send" primary={true} style={styles.button} />
                        </div>
                    </div>
                </div>
            </main>
          </div>
        );
    }
}

export default Chatroom;