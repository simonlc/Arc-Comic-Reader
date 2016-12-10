import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from './components/header';

class App extends Component {
  render() {
    return (
      <div>
        {/*<Header loggedIn={this.props.loggedIn} />*/}
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
  };
};

export default connect(mapStateToProps)(App);
