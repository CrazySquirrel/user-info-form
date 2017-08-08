import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Store from './store/index';

import App from './components/App/index.jsx';

import './index.scss';

injectTapEventPlugin();

const app = document.getElementById('root');

if (app) {
  ReactDOM.render(
      <Provider store={Store}>
        <HashRouter>
          <MuiThemeProvider>
            <App />
          </MuiThemeProvider>
        </HashRouter>
      </Provider>,
      app
  );
} else {
  throw new Error("Root tag doesn't exist.");
}
