import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

const LoginForm = ({ handleSubmit }) =>
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="username">Username</label>
    </div>
    <Field name="username" component="input" type="text" placeholder="Username" />
    <div>
      <label htmlFor="password">Password</label>
    </div>
    <Field name="password" component="input" type="password" placeholder="Password" />
    <div>
      <Field name="remember" component="checkbox" /><label htmlFor="remember">Remember me</label> · <a href="">Forgot password?</a>
    </div>
    <button type="submit">Log in</button>
  </form>

export default reduxForm({
  form: 'login',
})(LoginForm);
