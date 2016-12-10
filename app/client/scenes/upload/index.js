import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UploadForm from './upload-form';
import { upload } from './actions';

class Upload extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = (values) => {
    // Do something with the form values
    this.props.upload(values);
  }
  render() {
    return (
      <div className="upload-page">
        <UploadForm onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default connect(
  state => ({
    upload: state.upload,
  }), {
    upload,
  }
)(Upload);
