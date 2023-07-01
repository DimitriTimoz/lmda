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
      src: '',
      value: '',
    };
    this.props.src = '';
  }

  onFileChange = (e) => {
    this.setState({ 
      file: e.target.files[0],
      src: URL.createObjectURL(e.target.files[0]),
    }, () => {
      this.upload(e);  
    });
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

      this.setState({ 
        message: res.data.message,
        src: "/uploads/" +  res.data.compressedImageFile,
        value: res.data.id
      }, () => {
        let event = {
          target: {
            name: this.props.name,
            value: this.state.value,
          },
        };
        this.props.onChange(event);  
      });

    } catch (err) {
      this.setState({ message: 'An error occurred while uploading the image.' });
    }
  };

  render() {
    let src = this.state.src || this.props.src || '/icons/image.svg';
    return (
      <div className="image-picker">
        <img src={src} alt="image" />
        <input
          type="file"
          accept="image/*"
          onChange={this.onFileChange}
        />
      </div>
    );
  }
}
