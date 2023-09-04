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
      loading: false,
    };
    this.props.src = '';
  }

  componentDidUpdate(prevProps) {
    if(!(this.props.src === prevProps.src)) {
      this.setState({src: this.props.src});
    }
  } 

  onFileChange = (e) => {
    this.setState({ 
      file: e.target.files[0],
      loading: true,
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
      
      this.setState({ loading: false });
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
      this.setState({ message: 'An error occurred while uploading the image.' + err.data.error });
    }
  };

  render() {
    let src = this.state.src || this.props.src || '/icons/image.svg';
    return (
      <div className="image-picker">
        {this.state.loading ? <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        :
        <>
          <img src={src} alt="Prévisualisation envoyée" />
          <input
            type="file"
            accept="image/*"
            onChange={this.onFileChange}
          />
          {this.state.message.length > 0 && <ErrorPopup error={this.state.message} onClose={() => {this.setState({message: ""})}}/>}
        </>
        }
      </div>
    );
  }
}
