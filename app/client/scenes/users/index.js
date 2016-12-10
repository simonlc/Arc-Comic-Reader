import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { loadUsers } from './actions';

class UsersPage extends Component {
  componentWillMount() {
    this.props.loadUsers();
  }
  render() {
    return (
      <div>
        <h1>Users</h1>
        {this.props.users.map((user, index) => <div key={index}><Link to={`/users/${user.username}`}>{user.username}</Link></div>)}
      </div>
    );
  }
}

export default connect(state => ({
  users: state.users,
}), {
  loadUsers,
})(UsersPage);
