import React from 'react';
import axios from 'axios';
import "./ImagePicker.css";
export default class ImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      file: null,
      message: '',
    };
    this.props.src = '';
  }

  onFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
    this.props.src = URL.createObjectURL(e.target.files[0]);
    this.upload(e);
  };

  upload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', this.state.file);
    formData.append('utility', this.props.type || 'preview');

    try {
      const res = await axios.post('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      this.setState({ message: res.data.message });
      this.props.value = res.data.id;
    } catch (err) {
      this.setState({ message: 'An error occurred while uploading the image.' });
    }
  };

  render() {
    return (
      <div className="image-picker">
        <img src={this.props.src || '/icons/image.svg'} alt="image" />
        <input
          type="file"
          accept="image/*"
          onChange={this.props.onChange ? this.props.onChange : this.onFileChange}
        />
      </div>
    );
  }
}
