import React, {Component} from 'react';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';

import UserDataForm from '../UserDataForm/index';
import UserDataView from '../UserDataView/index';

import './index.scss';

class App extends Component {
  render() {
    return (
        <div className="app">
          <AppBar
              title="User Data Form"
              iconElementLeft={<FontIcon/>}
          />
          <section className="AppMain">
            <Paper className="AppForm">
              <HashRouter>
                <Switch>
                  <Route exact path='/form/' component={UserDataForm}/>
                  <Route exact path='/view/' component={UserDataView}/>
                  <Redirect from="/" to="/form/"/>
                </Switch>
              </HashRouter>
            </Paper>
          </section>
        </div>
    );
  }
}

export default App;