import React, { Component } from 'react';

import {firebaseApp, db, auth, storageKey, isAuthenticated} from './config/db_config';
import Home from './components/home/home';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import ChatRoom from './components/chatroom/chatroom';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'

class App extends Component {
  state = {
    uid: null
  }

  componentDidMount(){
    auth.onAuthStateChanged(user => {
      if(user){
        window.localStorage.setItem(storageKey, user.uid);
        this.setState({uid: user.uid})
      } else {
        window.localStorage.removeItem(storageKey);
        this.setState({uid: null})
      }
    })
  }
 
  render() {
    return (
      <Router>
        <div className="appcontainer">
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <MatchWhenAuthorized pattern="/chatroom" component={ChatRoom} />
          
        {/* <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">About</Link></li>
          <li><Link to="/topics">Topics</Link></li>
        </ul> */}
        </div>
      </Router>
    );
  }
  
}

const MatchWhenAuthorized = ({component: Component}) => (
  <Route render={renderProps => (
    isAuthenticated() ? (
      <ChatRoom />
    ) : (
      <Redirect to={ {
        pathname: '/',
      } } />
    )
  )}/>
)

export default App;
