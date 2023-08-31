import React from 'react';
import axios from 'axios';
import "./ImagePicker.css";
import ErrorPopup from './ErrorPopup';
export default class ImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      file: null,
      message: '',
      src: '',
      value: '',
      message: '',
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

      if (res.status !== 200) {
        this.setState({ message: res.data.error});
        return;
      }

      this.setState({ 
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
        <img src={src} alt="Prévisualisation envoyée" />
        <input
          type="file"
          accept="image/*"
          onChange={this.onFileChange}
        />
        {this.state.message && <ErrorPopup error={this.state.message} />}
      </div>
    );
  }
}
