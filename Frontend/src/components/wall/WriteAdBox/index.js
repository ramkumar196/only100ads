import React, {Component} from "react";
import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Divider, Input, Modal, Upload, Mentions, Alert, Space} from "antd";
import axios from 'util/Api';
import { adCreate } from "../../../appRedux/actions/ManageAd";
import { connect } from "react-redux";

const {TextArea} = Input;
const { Option } = Mentions;

class WriteAdBox extends Component {

  state = {
    commentText: '',
    previewVisible: false,
    previewImage: '',
    fileList: [],
    isOpen: false,
    hashtags:[],
    postSucess:false
  };



  onChange = async(value) => {
    this.setState({
      loading: true,
    });
    this.setState({commentText: value})
    console.log("this.props.token",this.props.token);
    let resp = await axios.get('hashtags/list');
    if(resp && resp.data && resp.data.details){
      this.setState({
        hashtags: resp.data.details,
        loading: false,
      });
    }
  }

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
    console.log("previewImage", file)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({fileList}) => {
    console.log("fileList", fileList)
    this.setState({fileList})
  }

  handleClickImage() {
    this.setState((previousState) => ({
      isOpen: !previousState.isOpen
    }));
  }

  handleAddPost() {
    this.props.addPost(this.state.commentText, this.state.fileList);
    this.setState({
      postSucess:true,
      commentText: '',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      isOpen: false,
      hashtags:[]
    });
    this.props.adListFunc();
  }

  onChange(e) {
    this.setState({commentText: e.target.value})
  }

  render() {

    const {previewVisible, previewImage, fileList} = this.state;
    const isEnabled = this.state.fileList.length === 0 && this.state.commentText === "";
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    let headers = {
      authorization: "Bearer "+this.props.token
    }

    return (
      <Card className="gx-card">
        <div className="gx-media gx-mb-2">
          <Avatar className="gx-size-50 gx-mr-3" src={this.props.userDetails.userImage}/>
          <div className="gx-media-body">
          <Mentions rows={4}
            value={this.state.commentText}
            style={{ width: '100%' }}
            onChange={(event) => this.onChange(event)}
            onSelect={this.onSelect}
            loading={this.state.loading}
            defaultValue=""
            prefix = "#"
          >
    {(this.state.hashtags).map(value => (
          <Option key={value.hashtag} value={value.hashtag}>
            {value.hashtag}
          </Option>
        ))}
  </Mentions>
          </div>
        </div>

        <div className="gx-clearfix">
          {this.state.isOpen === true ? <Upload
          name="adMedia"
           action="http://localhost:8000/ads/uploadAdMedia"
           headers={headers}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload> : null}

          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{width: '100%'}} src={previewImage}/>
          </Modal>
        </div>
        <Divider/>

        <div className="ant-row-flex">

            <i onClick={this.handleClickImage.bind(this)} className="icon icon-camera gx-mr-2 gx-fs-xl gx-d-inline-flex gx-vertical-align-middle"/>
          <Button type="primary"  size='small' className="gx-ml-auto gx-mb-0"
                  disabled={(isEnabled) ? "disabled" : ""}
                  onClick={this.handleAddPost.bind(this)}>SEND
          </Button>
        </div>
        {this.state.postSucess === true &&
          <Alert style={{margin:"5px"}}  message="Ad created!!!" type="success" showIcon closable />
          }
      </Card>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  const { ads, token, history } = auth;
  return { ads, token, history }
};

export default connect(mapStateToProps, { adCreate })(WriteAdBox);


