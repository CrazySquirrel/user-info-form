import React, {Component} from 'react';

import FlatButton from 'material-ui/FlatButton';

import {connect} from 'react-redux';

import './index.scss';

class UserDataView extends Component {
  gotToForm() {
    this.props.history.push('/form/');
  }

  render() {
    return (
        <div>
          <table className="UserData">
            <thead>
            <tr>
              <th colSpan="2">User</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td className="UserDataProperty">User name:</td>
              <td className="UserDataProperty">Date of birth:</td>
            </tr>
            <tr>
              <td className="UserDataValue">{this.props.user.name}</td>
              <td className="UserDataValue">{this.props.user.dateOfBirth}</td>
            </tr>
            <tr>
              <td className="UserDataProperty">User ID:</td>
              <td className="UserDataProperty">Gender:</td>
            </tr>
            <tr>
              <td className="UserDataValue">{this.props.user.id}</td>
              <td className="UserDataValue">{this.props.user.gender}</td>
            </tr>
            </tbody>
          </table>
          <FlatButton
              label="Back"
              fullWidth={true}
              onTouchTap={this.gotToForm.bind(this)}
          />
        </div>
    );
  }
}

UserDataView = connect(
    (state) => {
      return state;
    },
)(UserDataView);

export default UserDataView;