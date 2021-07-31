import React from "react";
//import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox, Form, Input, Upload, Avatar, Space, Skeleton, Alert } from "antd";
import { Link } from "react-router-dom";
import { UploadOutlined,UserOutlined, InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { getAccountDetails, updatePassword } from "../../appRedux/actions/Account";
import axios from 'util/Api';

import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";
import Icon from '@ant-design/icons';
import { GoogleLogin } from 'react-google-login';

const FormItem = Form.Item;


class ChangePassword extends React.Component {

  state = {
    userDetails:{
      profileImage: '',
      userName: '',
      email: '',
    },
    updateSucess:false,
    updateFailue:false,
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
        userDetails: resp.data.details.userDetails,
        loading: false,
      });
      console.log("after setting",this.state.userDetails);

    }
  }

  onFinish = (values) => {
    this.props.updatePassword(values);
    this.setState({
      updateSuccess:true
    })
    this.props.history.push('/');
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
            <Form.Item
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your current password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Current Password" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your new password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="New Password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <FormItem>
              <Button type="primary" block className="gx-mb-2" htmlType="submit">
                Update Password
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

export default connect(mapStateToProps, { updatePassword })(ChangePassword);
