import React, {Component} from 'react';
import TextField from '../../node_modules/material-ui/TextField';
import RaisedButton from '../../node_modules/material-ui/RaisedButton';
import GoChatLogo from '../../assets/images/logo.png'
import {Link} from 'react-router-dom'
import {firebaseApp, auth, isAuthenticated} from '../../config/db_config';


const styles = ({
    button: {
        marginTop: 20,
    },

  
    input: {
        width: '100%'
    }
})

class Signup extends Component{
    constructor(props){
        super(props);

        this.state = {
            signupEmail: '',
            signupPass: '',
            signupPass2: '',
            firstname: '',
            lastname: '',
            redirectAfterSignup: false,
            displayName: 'hello'
        }
        this.createUser = this.createUser.bind(this)
    }
    createUser = (evt) => {
        evt.preventDefault();
        if(this.state.signupPass === this.state.signupPass2){
            auth.createUserWithEmailAndPassword(this.state.signupEmail, this.state.signupPass).catch(function(error) {
                // Handle Errors here.
                // var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
                // ...
              }).then(userBlock => {
                  if(userBlock){
                    firebaseApp.database().ref('users/' + userBlock.uid).set({
                        firstname: this.state.firstname,
                        lastname: this.state.lastname,
                        email: this.state.signupEmail,
                    })
                    this.setState({redirectAfterSignup: true})
                }
                } 
            )   
        } else {
            alert('Password does not match');
        }
    }
    render(){
        const {from} = this.props.location.state || '/signup';
        const {redirectAfterSignup} = this.state;
        
      
        return(
            <div>
                {redirectAfterSignup && (
                    window.location.assign('/chatroom')
                )}
              {from && (
                <p>You must log in to view the page at {from.pathname}</p>
              )}
            <div className="loginForm">
                <img alt="Site Logo" src={GoChatLogo} />
                {isAuthenticated() ? <p>You are Signed up and Logged In. Click Here to go to your <a href="/chatroom">chat room</a></p> :
                <div class="formWrap">
                    
                    <h3>Sign up !</h3>
                    <form onSubmit={this.createUser}>
                        <TextField required floatingLabelText="First Name" value={this.state.firstname} style={styles.input} onChange={e=>this.setState({ firstname: e.target.value})} /><br />
                        <TextField required floatingLabelText="Last Name" value={this.state.lastname} style={styles.input} onChange={e=>this.setState({ lastname: e.target.value})} /><br />
                        <TextField required type="email" floatingLabelText="Email Address" value={this.state.signupEmail} style={styles.input} onChange={e=>this.setState({ signupEmail: e.target.value})} /><br />
                        <TextField required floatingLabelText="Password" type="password" value={this.state.signupPass} style={styles.input} onChange={e=>this.setState({ signupPass: e.target.value})} /><br />
                        <TextField required floatingLabelText="Confirm Password" value={this.state.signupPass2} type="password" style={styles.input} onChange={e=>this.setState({ signupPass2: e.target.value})}  /><br />
                        <RaisedButton type="submit" className="loginButton" label="Sign Up" primary={true} style={styles.button}  />
                    </form>
                    <div className="route-signup">
                        <Link to="/">Have Account? Login here</Link>
                    </div>
                </div>
                }
            </div>
            </div>
        );
    }
}

export default Signup;