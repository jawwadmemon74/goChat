import React, {Component} from 'react';
import TextField from './material-ui/TextField';
import RaisedButton from './material-ui/RaisedButton';
import Avatar from './material-ui/Avatar';
import {purple500, white} from './material-ui/styles/colors';
import '../../App.css';
import CommunicationChatBubble from '/node_modules/material-ui/svg-icons/communication/chat-bubble';
import {db, auth} from '../../config/db_config';

const styles = ({
    button: {
        marginTop: 10,
    },
    input: {
        width: '100%'
    }
})



class Chatroom extends Component {
    
    constructor(props){
        super(props);
        this.users = db.ref().child('users');
        this.messages = db.ref().child('messages/' + localStorage.getItem('localuserid'));
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handlerSubmitMessage = this.handlerSubmitMessage.bind(this);
        this.msgPreventDefault = this.msgPreventDefault.bind(this)
        this.handlerConvoChange = this.handlerConvoChange.bind(this)
        
        this.state = {
            currentUseris: '',
            loggedinuser: [],
            users: [],
            messages: [],
            newMessage: '',
            clickedUser: '',
            clickedUserName: ''
        }
    }

    componentWillMount(){
        this.forceUpdate();
        var loggedinuserEmpty = this.state.loggedinuser;
        const oldUsers = this.state.users;
        const oldMessages = this.state.messages;
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    currentUseris : localStorage.getItem('localuserid')
                })
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
            }
        }) 
        // this.messages.on('child_added', snap => {
        //     if(this.state.clickedUser !== ''){
        //     var getClickedUser = snap.child(this.state.clickedUser).val();
        //     if(oldMessages){
        //     var oldMessagesl = oldMessages.length;
            
        //     oldMessages.splice(0, oldMessagesl)}
            
        //         for(var i=0; i<Object.keys(getClickedUser).length;i++){
        //             var getKeys = Object.keys(getClickedUser);
        //             oldMessages.push({
        //                 uid: snap.child( '/' + this.state.clickedUser + '/' +getKeys[i]+'/uid').val(),
        //                 time: snap.child( '/' + this.state.clickedUser + '/' +getKeys[i]+'/time').val(),
        //                 firstname: snap.child( '/' + this.state.clickedUser + '/' +getKeys[i]+'/firstname').val(),
        //                 lastname: snap.child('/' + this.state.clickedUser + '/' +getKeys[i]+'/lastname').val(),
        //                 email: snap.child('/' + this.state.clickedUser + '/' +getKeys[i]+'/email').val(),
        //                 message: snap.child('/' + this.state.clickedUser + '/' +getKeys[i]+'/message').val(),
        //             })
        //         }
        //         this.setState({
        //             messages: oldMessages
        //         })
        //     }
        // })
    }

    handleLogOut= () => {
        auth.signOut();
    }
    handlerConvoChange = (clickedUserId, clickedUserFName, clickedUserLName) => {
        var oldMessages = this.state.messages;
        this.setState({
            clickedUser: clickedUserId,
            clickedUserName: clickedUserFName + ' ' + clickedUserLName
        });
        // alert(clickedUserId)
        this.messages.on('value', snap => {
            var getClickedUser = snap.child(clickedUserId).val();
            if(oldMessages){
            var oldMessagesl = oldMessages.length;
            oldMessages.splice(0, oldMessagesl)}
            if(getClickedUser !== null){
                 for(var i=0; i<Object.keys(getClickedUser).length;i++){
                    var getKeys = Object.keys(getClickedUser);
                    oldMessages.push({
                        uid: snap.child( '/' + clickedUserId + '/' +getKeys[i]+'/uid').val(),
                        time: snap.child( '/' + clickedUserId + '/' +getKeys[i]+'/time').val(),
                        firstname: snap.child( '/' + clickedUserId + '/' +getKeys[i]+'/firstname').val(),
                        lastname: snap.child('/' + clickedUserId + '/' +getKeys[i]+'/lastname').val(),
                        email: snap.child('/' + clickedUserId + '/' +getKeys[i]+'/email').val(),
                        message: snap.child('/' + clickedUserId + '/' +getKeys[i]+'/message').val(),
                    })
                }
                this.setState({
                    messages: oldMessages
                }, function(){
                    const messagesList = document.getElementById('msgList');
                    // alert(messagesList)
                    const shouldScroll = messagesList.scrollTop + messagesList.clientHeight === messagesList.scrollHeight;
                    if (!shouldScroll) {
                        messagesList.scrollTop = messagesList.scrollHeight;
                    }
                } )
                
            }
            
        })
    
    }
    msgPreventDefault = (evt) => {
        evt.preventDefault();
        const messagesList = document.getElementById('msgList');
        // alert(messagesList)  
        const shouldScroll = messagesList.scrollTop + messagesList.clientHeight === messagesList.scrollHeight;
        if (!shouldScroll) {
            messagesList.scrollTop = messagesList.scrollHeight;
          }
    }
    handlerSubmitMessage(userMessage) {
        // const oldMessages = this.state.messages;
        if(this.state.clickedUser === ''){
            
                alert('Please click on any user to talk with') 
            } else {
                if(this.state.newMessage !== ''){
        auth.onAuthStateChanged((user) => {
            if (user) {
              
                var uid = user.uid;
                db.ref().child('users/'+ uid).on('value', snap => {
                   
                    this.messages.child( '/' + this.state.clickedUser).push().set({
                        uid: this.state.currentUseris,
                        time: new Date().toLocaleTimeString(),
                        firstname: snap.child('firstname').val(),
                        lastname: snap.child('lastname').val(),
                        email: snap.child('email').val(),
                        message: userMessage,
                        // postedto: this.state.clickedUser
                    });
                    db.ref().child('messages/'+ this.state.clickedUser + '/' + localStorage.getItem('localuserid')).push().set({
                        uid: this.state.currentUseris,
                        time: new Date().toLocaleTimeString(),
                        firstname: snap.child('firstname').val(),
                        lastname: snap.child('lastname').val(),
                        email: snap.child('email').val(),
                        message: userMessage,
                    });
                    this.setState({
                         newMessage: ''
                    })
                })
            }
        }) 
    } else {
        alert('You are submitting an empty message. Please write a message to proceed !');
    }
}
    }
    
    render(){
        return(
            <div className="App">
            <header className="App-header">
                {
                    this.state.loggedinuser.map((getUserCurrent)=>{
                        return(
                            <div key={getUserCurrent.id} className="header-inner">
                                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                                <h1 className="username">{getUserCurrent.firstname} {getUserCurrent.lastname}</h1>
                                <h1 className="App-title">Welcome to Go Chat  </h1>
                                <RaisedButton onClick={()=> this.handleLogOut()} label="Logout" primary={true} className="redbtn" style={styles.button} />
                            </div>
                        );
                    })
                }
            </header>
            <main>
                <div className="containerChat">
                    <div className="usersList pull-left">
                        {/* <List onClick={this.onItemClickHandler.bind(this)}> */}
                        {
                            
                            this.state.users.map((singleUser)=>{
                                return(
                                    localStorage.getItem('localuserid') === singleUser.id  ? '' : 
                                     <div key={singleUser.id} clicked={singleUser.id === this.state.clickedUser ? 'true' : 'false'} onClick={() => this.handlerConvoChange(singleUser.id, singleUser.firstname, singleUser.lastname)} className="userName" id={singleUser.id}>
                                        <span>
                                            <Avatar color={white} backgroundColor={purple500} size={50}>{singleUser.firstname? singleUser.firstname.slice(0,1).toUpperCase(): 'U'}</Avatar>
                                            <strong class="username">{singleUser.firstname && singleUser.lastname ? singleUser.firstname + ' ' + singleUser.lastname : 'Unknown' }</strong>
                                            <CommunicationChatBubble /> 
                                        </span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="userConvo pull-right">
                    {this.state.clickedUserName ? 
                        <div className="convo-header">
                                <h3>{this.state.clickedUserName === 'null null' ? 'Unknown User' : this.state.clickedUserName }</h3>
                        </div>
                    : ''}
                        
                            {this.state.clickedUser ?
                                <div id="msgList" className="convo-inner">{
                                this.state.messages.map((messagesingle, ind)=>{
                                   
                                 
                                    return(
                                       
                                        <div key={ind} usertype={localStorage.getItem('localuserid') === messagesingle.uid ? 'same' : 'opposite' } className="messageWrap">
                                            {console.log(messagesingle.uid)}
                                            <div className="messageSingle">
                                                <div className="messageAvatar">
                                                    <Avatar color={white} backgroundColor={purple500} size={50}>{messagesingle.firstname? messagesingle.firstname.slice(0,1).toUpperCase(): 'U'}</Avatar>
                                                </div>
                                                <div className="msg-text">
                                                    <div className="msg-name">
                                                        <h4>{messagesingle.firstname} {messagesingle.lastname}</h4>
                                                    </div>
                                                    <div className="msg-coretext">
                                                        <p>{messagesingle.message}</p>
                                                    </div>
                                                    <div className="msg-time">
                                                        <span>{messagesingle.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                
                                }) } 
                                </div>
                                :
                                    <div className="docs">
                                        <div className="getchat">
                                            <p>Click on any user to start chating :) </p>
                                        </div>
                                        <h2>Go Chat Home</h2>
                                    <h6>Watch the video to learn how to use Go Chat</h6>
                                    <iframe title="doc-video" width="530" height="300" src="https://www.youtube.com/embed/HD8myvOBAhw" frameborder="0" gesture="media" allowfullscreen></iframe>
                                    </div>
                                } 
                     
                        {this.state.clickedUser ?
                        <div className="msg-submit">
                            <form onSubmit={this.msgPreventDefault}>
                                <TextField className="submitInput" value={this.state.newMessage} onChange={e => {this.setState({newMessage: e.target.value})}} hintText="Write a little Message Here ..." />
                                <RaisedButton onClick={()=> this.handlerSubmitMessage(this.state.newMessage)} className="submitBtn" type="submit" label="Send" primary={true} style={styles.button} />
                            </form>
                        </div> : '' }
                    </div>
                </div>
            </main>
          </div>
        );
    }
}

export default Chatroom;