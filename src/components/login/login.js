import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import GoChatLogo from '../../assets/images/logo.png'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import {firebaseApp, db, auth, storageKey, isAuthenticated} from '../../config/db_config';

const styles = ({
    button: {
        marginTop: 20,
    },

  
    input: {
        width: '100%'
    }
})

class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: '',
            redirectAfterLogin: false,
            loginError: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    // Requesting to server
    handleSubmit = (evt) => {
        evt.preventDefault();
         if(this.state.email === '' || this.state.password === ''){
            this.setState({loginError : true})
         } else if(this.state.email !== '' && this.state.password !== ''){
            auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(()=> 
                 this.setState({
                     redirectAfterLogin: true,
                     loginError: false
                })
            )
        }
        
    }

    

    render(){
       
        const {from} = this.props.location.state || '/';
        const {redirectAfterLogin} = this.state;
        return(
            <div>
            {redirectAfterLogin && (
          <Redirect to={from || '/chatroom'}/>
        )}
        {from && (
          <p>You must log in to view the page at {from.pathname}</p>
        )}
            <div className="loginForm">
            <img src={GoChatLogo} />
            {isAuthenticated() ? <p>You are Logged In. Click Here to go to your <a href="/chatroom">chat room</a></p> :
                <div class="formWrap">
                    <h3>Login !</h3>
                    
                        <form onSubmit={this.handleSubmit}>
                            <TextField floatingLabelText="Email Address" style={styles.input} underlineStyle={styles.inputBorder} value={this.state.email} onChange={e => this.setState({email: e.target.value})} /><br />
                            <TextField floatingLabelText="Password" type="password" style={styles.input} underlineStyle={styles.inputBorder} value={this.state.password} onChange={e => this.setState({password: e.target.value})} /><br />
                            <RaisedButton type="submit" className="loginButton" label="Sign In" primary={true} style={styles.button} />
                        </form>
                       <br />
                       {this.state.loginError ? <small className="red error">Username or Password is invalid</small>
                        : ''
                        }
                        <div className="route-signup">
                            <Link to="/signup">Don't have account?</Link>
                        </div> 
                   
                </div>
        
                }
            </div>
            </div>
        );
    }
}

export default Login;