import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadComics } from './actions';

const Section = ({ comics }) =>
  <div className="section">
    <h2>Continue reading</h2>
    <div className="card-row">
      {comics.map((comic, i) => {
        return (
          <div className="card" key={i}>
            <img src={`/${comic.key}/0.jpg`} />
          </div>
        );
      })}
    </div>
  </div>

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    // XXX This feels ugly
    this.props.loadComics();
  }
  render() {
    const mockComics = [...Array(36).keys()];
    return (
      <div>
        <Section comics={this.props.comics} />
        <Section comics={this.props.comics} />
        <Section comics={this.props.comics} />
      </div>
    );
  }
}

export default connect(state => ({
  comics: state.comics,
}), {
  loadComics,
})(Home);