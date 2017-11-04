import React, {Component} from 'react';
import logo from '../../logo.svg';
import RaisedButton from 'material-ui/RaisedButton';
import '../../App.css';
import {firebaseApp, db, auth, storageKey, isAuthenticated, authData, user} from '../../config/db_config';

const styles = ({
    button: {
        marginTop: 20,
    },

  
    input: {
        width: '100%'
    }
})


  

class ChatRoom extends Component {
    constructor(props){
        super(props);
        this.state = {
            loggedinuser: []
        }
        this.handleLogOut = this.handleLogOut.bind(this)
        
    }

    componentWillMount(){
        const loggedinuserEmpty = this.state.loggedinuser;
        auth.onAuthStateChanged(function(user) {
            
            if (user) {
              // User is signed in.
              var uid = user.uid;
              var firstname = user.firstname;
              var email = user.email;
              var providerData = user.providerData;
              alert(uid+ ' ' + firstname + ' ' + email + ' ' + providerData)

              
               
                  
              // ...
            } else {
              // User is signed out.
              // ...
            }
            var ref = db.ref("users/"+ uid);
              ref.once("value")
                .then(function(snapshot) {
                  var firstname = snapshot.child('firstname').val();
                  var lastname = snapshot.child('lastname').val();
                  var email = snapshot.child('email').val();
                  loggedinuserEmpty.push({
                      id : snapshot.key,
                      firstname: firstname,
                      lastname: lastname,
                      email: email
                  });
                  
                });
                this.setState({
                    loggedinuser: loggedinuserEmpty
                }); 
          });
         
        
    }
    

    handleLogOut= () => {
        auth.signOut();
        
    }
    render(){
        return(
            <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              {/* {auth ? "User " + user.uid + " is logged in with " + user.provider :"User is logged out" } */}
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
              <RaisedButton type="submit" onClick={this.handleLogOut} className="loginButton" label="Logout" primary={true} style={styles.button} />

            </p>
          </div>
        );
    }
}

export default ChatRoom;