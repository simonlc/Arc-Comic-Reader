import React, { Component, PropTypes } from 'react';

export default class ProfilePage extends Component {
  render() {
    return (
      <div>
        Profile Page
        <div>{this.props.params.username}</div>
      </div>
    );
  }
}
