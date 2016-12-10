import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    onChange(e.target.files[0]);
  }

  render() {
    const { input: { value } } = this.props;

    return (
      <input
        type="file"
        value={value}
        onChange={this.onChange}
        multiple
      />
    );
  }
}

const UploadForm = ({ handleSubmit }) =>
  <form onSubmit={handleSubmit} encType="multipart/form-data">
    <div><Field name="file" component={FileInput} type="file" /></div>
    <div><Field name="title" component="input" type="text" placeholder="Title" /></div>
    <div><Field name="chapter" component="input" type="text" placeholder="Issue number" /></div>
    <button type="submit">Upload</button>
  </form>

export default reduxForm({
  form: 'upload',
})(UploadForm);
