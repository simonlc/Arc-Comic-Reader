import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadChapters, setComic } from './actions';
import { Link } from 'react-router';

export class Chapters extends Component {
  componentWillMount() {
    // XXX This feels ugly
    this.props.loadChapters(this.props.params.comic);
  }
  render() {
    const { setComic, params, chapters } = this.props;
    return (
      <div className="section">
        <h2>{params.comic}</h2>
        <div className="card-row">
          {chapters.map((chapter, i) => {
            return (
              <Link
                key={i}
                onClick={() => setComic(chapter)}
                to={`/c/${params.comic}/${chapter.chapterNumber}`}
              >
                <div className="card">
                  <img src={`/${chapter.key}/0.jpg`} />
                </div>
              </Link>
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
  setComic,
})(Chapters);
