import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from '/node_modules/material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(<BrowserRouter><MuiThemeProvider><App /></MuiThemeProvider></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
