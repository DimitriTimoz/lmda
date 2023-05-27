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
    this.state.file = e.target.files[0];
    this.setState({ file: e.target.files[0] });
    this.props.src = URL.createObjectURL(e.target.files[0]);
    this.upload(e);
  };

  upload = async (e) => {
    const formData = new FormData();
    formData.append('image', this.state.file);
    formData.append('utility', this.props.type || 'preview');

    try {
      const res = await axios.post('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        this.setState({ message: 'Image uploaded successfully.' });
      }

      this.setState({ message: res.data.message });
      this.props.value = res.data.id;
      this.props.src = "/uploads/" +  res.data.compressedImageFile;
    } catch (err) {
      this.setState({ message: 'An error occurred while uploading the image.' });
    }
  };

  render() {
    let src = this.props.src || '/icons/image.svg';
    return (
      <div className="image-picker">
        <img src={src} alt="image" />
        <input
          type="file"
          accept="image/*"
          name={this.props.name}
          onChange={this.onFileChange}
        />
      </div>
    );
  }
}
