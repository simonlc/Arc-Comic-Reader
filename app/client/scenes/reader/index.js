import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadComic } from './actions';

// Centered cover on start ?
// on each img load also get edge color, default black
//
// then show p1 and p2
//
// on touch devices, require swipe, not click to change pages
//
// TODO Detect end, detect 2 page spreads

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      return resolve(img);
    };
    img.onerror = () => {
      // Still return, since we want to keep running.
      return resolve();
    };
    img.src = url;
  });
}

export class Reader extends Component {
  constructor(props) {
    super(props);
    // preload first image to prevent progressive load
    this.state = {
      page: 0,
      singlePage: true,
      x: 0,
      y: 0,
    };
  }
  componentWillMount() {
    this.props.loadComic(this.props.params.comic, this.props.params.issue);
  }
  componentDidMount() {
    // TODO Get comic.key from params in orm find by slug
    // Setup
    // window.scrollTo(0, 1);
    // TODO
    // scroll,
    // keydown,
    // swipe
    addEventListener('keydown', this.handleKeyup);
    // addEventListener('touchmove', e => e.preventDefault());
  }
  componentWillUnmount() {
    removeEventListener('keydown', this.handleKeyup);
  }
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }
  handleKeyup = (e) => {
    if ([39].includes(e.keyCode)) {
      this.navigateForward();
    }
    if ([37].includes(e.keyCode)) {
      this.navigateBack();
    }
  }
  navigateBack = () => {
    const { comic } = this.props;
    const { page, singlePage } = this.state;
    const url = `/${comic.key}/${page - 2}.jpg`;
    const url2 = `/${comic.key}/${page - 1}.jpg`;
    // TODO Because we are using promise all, we can never get the last
    // page if it is odd
    const images = [
      loadImage(url),
      loadImage(url2),
    ];
    Promise.all(images).then(values => {
      // Calculate edge color?
      const img = values[1];
      if (img === void 0) return;
      if (img.width > img.height || values[0] === void 0) {
        this.setState({ singlePage: true, page: page - 1 });
      } else {
        this.setState({ singlePage: false, page: page - 2 });
      }
    });
  }
  navigateForward = () => {
    const { comic } = this.props;
    const { page, singlePage } = this.state;

    let url = `/${comic.key}/${page + 2}.jpg`;
    let url2 = `/${comic.key}/${page + 3}.jpg`;

    if (singlePage) {
      url = `/${comic.key}/${page + 1}.jpg`;
      url2 = `/${comic.key}/${page + 2}.jpg`;
    }

    // TODO Because we are using promise all, we can never get the last
    // page if it is odd
    Promise.all([
      loadImage(url),
      loadImage(url2),
    ]).then(values => {
      if (values[0] === void 0) return;

      const img = values[0];
      let newPage = page;
      let newSinglePage;
      if (singlePage) {
        newPage += 1;
      } else {
        newPage += 2;
      }
      if (img.width > img.height) {
        newSinglePage = true;
        this.setState({ singlePage: true, page: newPage });
      } else {
        newSinglePage = false;
        this.setState({ singlePage: false, page: newPage });
      }
      // Lazy load //
      let url = `/${comic.key}/${newPage + 2}.jpg`;
      let url2 = `/${comic.key}/${newPage + 3}.jpg`;

      if (newSinglePage) {
        url = `/${comic.key}/${newPage + 1}.jpg`;
        url2 = `/${comic.key}/${newPage + 2}.jpg`;
      }
      loadImage(url);
      loadImage(url2);
    });
  }
  render() {
    const { comic } = this.props;
    const { page } = this.state;
    const url = `/${comic.key}/${page}.jpg`;
    const url2 = `/${comic.key}/${page + 1}.jpg`;
    return (
      <div>
        {this.state.singlePage ?
          <div className="reader-book">
            {/* XXX: This will need a navigateback too */}
            <img style={{ maxWidth: '100%' }} onClick={this.navigateForward} className="reader-page" src={url} />
          </div>
            :
          <div className="reader-book">
            <img onClick={this.navigateBack} className="reader-page" src={url} />
            <img onClick={this.navigateForward} className="reader-page" src={url2} />
          </div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({ comic: state.comic }),
  { loadComic },
)(Reader);
