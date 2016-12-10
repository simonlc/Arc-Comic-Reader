import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LoginForm from './login-form';
import { login } from './actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(values) {
    // Do something with the form values
    this.props.login(values);
  }
  render() {
    return (
      <div className="login-page">
        <div>Log in</div>
        <LoginForm onSubmit={this.handleSubmit} />
        <div>Don't have an account? <a href="">Sign up</a></div>
      </div>
    );
  }
}

export default connect(
  state => ({
    login: state.login,
  }), {
    login,
  }
)(Login);
