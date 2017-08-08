import React, {Component} from 'react';

import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LinearProgress from 'material-ui/LinearProgress';

import Notification from '../Notification/index';

import Form from "react-jsonschema-form";

import {connect} from 'react-redux';

import {submitUserData} from '../../actions/index';
import {resetLoadingState} from '../../actions/index';

import formData from '../../json/form.json';

import './index.scss';

let Scheme = {};
let Errors = {};
let Description = {};

function requiredValidate(formData, errors) {
  for (const prop in formData) {
    if (
        (
            Scheme.required.indexOf(prop) !== -1 ||
            Scheme.properties[prop].required
        ) &&
        formData[prop] === ""
    ) {
      errors[prop].addError("Is required");
    }
  }
  return errors;
}

const widgets = {
  text: (props) => {
    const name = props.id.replace("root_", "");

    let label = props.label;

    if (props.required) {
      label += " *"
    }

    return (
        <TextField
            id={props.id}
            name={props.id}
            floatingLabelText={label}
            errorText={Errors[name].join("\r\n")}
            value={props.value}
            required={props.required}
            autoFocus={props.autofocus}
            disabled={props.disabled}
            readOnly={props.readonly}
            type="text"
            onChange={(event, value) => props.onChange(value)}
            fullWidth={true}
        />
    );
  },
  select: (props) => {
    const name = props.id.replace("root_", "");

    let label = props.label;

    if (props.required) {
      label += " *"
    }

    return (
        <SelectField
            id={props.id}
            name={props.id}
            floatingLabelText={label}
            errorText={Errors[name].join("\r\n")}
            value={props.value}
            required={props.required}
            autoFocus={props.autofocus}
            disabled={props.disabled}
            readOnly={props.readonly}
            onChange={(event, index, value) => props.onChange(value)}
            fullWidth={true}
        >
          {props.options.enumOptions.map((option) => {
            return (
                <MenuItem key={option.value}
                          value={option.value}
                          primaryText={option.label}/>
            );
          })}
        </SelectField>
    );
  },
  date: (props) => {
    const name = props.id.replace("root_", "");

    let label = props.label;

    if (props.required) {
      label += " *"
    }

    return (
        <TextField
            id={props.id}
            name={props.id}
            floatingLabelText={label}
            errorText={Errors[name].join("\r\n")}
            value={props.value}
            required={props.required}
            autoFocus={props.autofocus}
            disabled={props.disabled}
            readOnly={props.readonly}
            type="date"
            onChange={(event, value) => props.onChange(value)}
            fullWidth={true}
        />
    );
  }
};

function CustomFieldTemplate(props) {
  const {classNames, help, description, errors, children} = props;
  Description[children.props.name] = description.props.description;

  if (children.props.name) {
    Errors[children.props.name] = [];
  }

  React.Children.map(errors, (error) => {
    (error.props.errors || []).forEach(
        (e) => children.props.name && Errors[children.props.name].push(e)
    );
  });

  return (
      <div className={classNames}>
        {children}
        {help}
      </div>
  );
}

class UserDataFrom extends Component {

  getGoNextDisabled(user, step) {
    return !(
        (
            step === 0 &&
            Object.keys(Errors).every((prop) => Errors[prop].length === 0) &&
            user.id &&
            user.name
        ) ||
        (
            step === 1 &&
            Object.keys(Errors).every((prop) => Errors[prop].length === 0) &&
            user.dateOfBirth &&
            user.gender
        ) ||
        (
            step === 2 &&
            Object.keys(Errors).every((prop) => Errors[prop].length === 0) &&
            user.id &&
            user.name &&
            user.dateOfBirth &&
            user.gender
        )
    );
  }

  constructor(props) {
    super(props);

    const user = {
      id: "",
      name: "",
      dateOfBirth: "",
      gender: "",
      ...props.user
    };

    this.state = {
      step: 0,
      user,
      goNextDisabled: this.getGoNextDisabled(user, 0)
    };
  }

  goToStep1() {
    this.setState({
      step: 0,
      goNextDisabled: this.getGoNextDisabled(this.state.user, 0)
    });
  }

  goToStep2() {
    this.setState({
      step: 1,
      goNextDisabled: this.getGoNextDisabled(this.state.user, 1)
    });
  }

  goToView() {
    this.props.history.push('/view/');
  }

  doSubmit() {
    if (!this.getGoNextDisabled(this.state.user, 2)) {
      this.setState({
        step: 2
      });
      this.props.submitUserData(this.state.user);
    }
  }

  onDataChange(form = {}) {
    const user = {
      ...this.state.user,
      ...form.formData
    };

    this.setState({
      user,
      goNextDisabled: this.getGoNextDisabled(user, this.state.step)
    });
  }

  render() {
    Scheme = formData.properties["step-" + this.state.step] || {};
    Scheme.default = this.state.user;

    let form = null;

    if (this.state.step === 0) {
      form = (
          <div>
            <Form
                className="UserDataForm"
                liveValidate={true}
                schema={Scheme}
                widgets={widgets}
                showErrorList={false}
                FieldTemplate={CustomFieldTemplate}
                validate={requiredValidate}
                onChange={this.onDataChange.bind(this)}
                onSubmit={this.onDataChange.bind(this)}
                onError={this.onDataChange.bind(this)}
            /><br/>
            <RaisedButton
                label="Next"
                disabled={this.state.goNextDisabled}
                primary={true}
                fullWidth={true}
                onTouchTap={this.goToStep2.bind(this)}
            />
          </div>
      );
    } else if (this.state.step === 1) {
      form = (
          <div>
            <Form
                className="UserDataForm"
                liveValidate={true}
                schema={Scheme}
                widgets={widgets}
                showErrorList={false}
                FieldTemplate={CustomFieldTemplate}
                validate={requiredValidate}
                onChange={this.onDataChange.bind(this)}
                onSubmit={this.onDataChange.bind(this)}
                onError={this.onDataChange.bind(this)}
            /><br/>
            <RaisedButton
                label="Submit"
                disabled={this.state.goNextDisabled}
                primary={true}
                fullWidth={true}
                onTouchTap={this.doSubmit.bind(this)}
            /><br/><br/>
            <FlatButton
                label="Back"
                fullWidth={true}
                onTouchTap={this.goToStep1.bind(this)}
            />
          </div>
      );
    }

    let dataForm = (
        <div>
          <Stepper activeStep={this.state.step}>
            <Step>
              <StepLabel>Step 1</StepLabel>
            </Step>
            <Step>
              <StepLabel>Step 2</StepLabel>
            </Step>
          </Stepper>
          {form}
        </div>
    );

    if (this.state.step === 2) {
      switch (this.props.loadingStatus) {
        case 'PENDING':
          dataForm = (<LinearProgress mode="indeterminate"/>);
          break;
        case 'FULFILLED':
          dataForm = (<Notification status="success"
                                    timer={4000}
                                    action={this.goToView.bind(this)}>
            User data saved successfully.
          </Notification>);
          break;
        case 'REJECTED':
          dataForm = (<Notification status="error"
                                    timer={4000}
                                    action={this.goToStep1.bind(this)}>
            An error occurred while saving user data.
          </Notification>);
          break;
        default:
      }
    }

    return dataForm;
  }
}

UserDataFrom = connect(
    (state) => {
      return state;
    },
    (dispatch) => {
      return {
        submitUserData: (user) => {
          dispatch(submitUserData(user));
        },
        resetLoadingState: () => {
          dispatch(resetLoadingState());
        }
      }
    }
)(UserDataFrom);

export default UserDataFrom;