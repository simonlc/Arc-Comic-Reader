import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const Header = ({ loggedIn }) =>
  <header className="header">
    <Link />
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/users">Users</Link></li>
      <li><Link to="/inbox">Inbox</Link></li>
      { loggedIn && <li><Link to={`/users/${loggedIn}`}>Inbox</Link></li> }
    </ul>
  </header>

export default Header;
