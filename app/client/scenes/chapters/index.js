import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadChapters } from './actions';

export class Chapters extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    // XXX This feels ugly
    this.props.loadChapters(this.props.params.comic);
  }
  render() {
    return (
      <div className="section">
        <h2>{this.props.params.comic}</h2>
        <div className="card-row">
          {this.props.chapters.map((chapter, i) => {
            return (
              <div className="card" key={i}>
                <img src={`/${chapter.key}/0.jpg`} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  chapters: state.chapters,
}), {
  loadChapters,
})(Chapters);
