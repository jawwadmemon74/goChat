import React, {Component} from 'react';
import TextField from './material-ui/TextField';
import RaisedButton from './material-ui/RaisedButton';
import GoChatLogo from '../../assets/images/logo.png'
import {Link} from 'react-router-dom'
import {auth, isAuthenticated} from '../../config/db_config';

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
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    // Handelling Login 
    handleSubmit = (evt) => {
        evt.preventDefault();
        var errorCode;
        var errorMessage;
        if(this.state.email !== '' && this.state.password !== ''){
            auth.signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
                // Handle Errors here.
                 errorCode = error.code;
                 errorMessage = error.message;
                    alert(errorMessage);
                // ...
              }).then(()=>  {
                    if(!(errorCode)){
                        this.setState({
                            redirectAfterLogin: true,
                        })
                    }
                }
            )
        }
    }

    render(){
        const {from} = this.props.location.state || '/';
        const {redirectAfterLogin} = this.state;
        return(
            <div>
            {redirectAfterLogin && (
                window.location.assign('/chatroom')
            )}
        {from && (
          <p>You must log in to view the page at {from.pathname}</p>
        )}
            <div className="loginForm">
            <img alt="Site logo" src={GoChatLogo} />
            {isAuthenticated() ? <p>You are Logged In. Click Here to go to your <a href="/chatroom">chat room</a></p> :
                <div class="formWrap">
                    <h3>Login !</h3>
                    <form onSubmit={this.handleSubmit}>
                        <TextField type="email" required floatingLabelText="Email Address" style={styles.input} underlineStyle={styles.inputBorder} value={this.state.email} onChange={e => this.setState({email: e.target.value})} /><br />
                        <TextField required floatingLabelText="Password" type="password" style={styles.input} underlineStyle={styles.inputBorder} value={this.state.password} onChange={e => this.setState({password: e.target.value})} /><br />
                        <RaisedButton type="submit" className="loginButton" label="Sign In" primary={true} style={styles.button} />
                    </form>
                    <br />
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