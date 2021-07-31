import React from "react";
//import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox, Form, Input, Upload, Avatar, Space, Skeleton , Alert} from "antd";
import { Link } from "react-router-dom";
import { UploadOutlined,UserOutlined, InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { getAccountDetails, updateProfile } from "../../appRedux/actions/Account";
import axios from 'util/Api';

import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";
import Icon from '@ant-design/icons';
import { GoogleLogin } from 'react-google-login';

const FormItem = Form.Item;


class EditProfile extends React.Component {

  state = {
    userDetails:{
      profileImage: '',
      userName: '',
      email: '',
    },
    updateSuccess:false,
    loading:true
  };

  componentWillMount() {
    //this.setState({postList: this.adList(), user: this.props.user})
    this.userDetails();
    console.log(this.state.userDetails);
  }
  userDetails = async(value) => {
    let resp = await axios.get('account/userDetails');
    console.log("fetching user",resp.data.details.userDetails);
    if(resp && resp.data && resp.data.details){
      this.setState({
        userDetails: resp.data.details,
        loading: false,
      });
      console.log("after setting",this.state.userDetails);

    }
  }

  onFinish = (values) => {
    let imageList = values.profileImage;
    let imageNameList = [];
    imageList.forEach(element => {
      if(element.thumbUrl){
        delete element.thumbUrl;
      }
      if(element.percent == 100
        && element.response
        && element.response.details
        && element.response.details.fileName){
          imageNameList.push({'image':element.response.details.fileName,"type":element.type,"size":element.size,'uid':element.uid});
          console.log("imageNameList-in",imageNameList);
        }
        values.profileImage = imageNameList;

    });
    this.props.updateProfile(values);
    this.userDetails();
    this.setState({
      updateSuccess:true
    })
    //this.props.history.push('/');
    console.log('Received values of form: ', values);
  };

  validateExistingFields = (values) => {
    return this.props.validateExistingFields(values);
  }


  componentDidUpdate() {
    // if (this.props.token !== null) {
    //   this.props.history.push('/signin');
    // }
  }
  render() {
    let normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
    let headers = {
      authorization: "Bearer "+this.props.token
    }
    if(this.state.loading){
      return (<div><Skeleton/></div>)

    }else {


    return (
      <div>
          <Form onFinish={this.onFinish} className="gx-form-row0"
          initialValues={[this.state.userDetails]}>
<Form.Item>
            <Form.Item name="profileImage" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload multiple={false} name="profileImage" action="http://localhost:8000/account/uploadUserProfile"  headers={headers}>
            { this.state.userDetails.profileImage != '' &&
            <Avatar className="gx-size-90" src= {this.state.userDetails.profileImage.image} shape="square" size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} icon={<UserOutlined />} />
            }
            { this.state.userDetails.profileImage == '' &&
            <Avatar className="gx-size-90" shape="square" size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }} icon={<UserOutlined />} />
            }

            </Upload>
          </Form.Item>
          </Form.Item>

            <Form.Item
              initialValue ={this.state.userDetails.userName}
              name="userName"
            >
              <Input disabled={true} value={this.state.userDetails.userName} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="User Name" />
            </Form.Item>
            <Form.Item
                          disabled={true}

              name="email"
              initialValue ={this.state.userDetails.email}

            >
              <Input disabled={true} prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}  value={this.state.userDetails.email}
                placeholder="Email address" />
            </Form.Item>
            <FormItem>
              <Button type="primary" block className="gx-mb-2" htmlType="submit">
                Update Profile
                {/* <IntlMessages id="app.profile.update" /> */}
              </Button>
            </FormItem>
          </Form>
          {this.state.updateSuccess === true &&
          <Alert style={{margin:"5px"}}   message="Updated Successfully" type="success" showIcon closable />
          }
          </div>
    );
            }
  }
}


const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token }
};

export default connect(mapStateToProps, { updateProfile })(EditProfile);
