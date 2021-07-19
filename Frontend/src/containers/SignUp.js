import React from "react";
//import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { userSignUp } from "../appRedux/actions/Auth";
import axios from 'util/Api';

import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";
import Icon from '@ant-design/icons';
import { GoogleLogin } from 'react-google-login';

const FormItem = Form.Item;


class SignUp extends React.Component {

  clientId =
  '1076215776675-borod8jqv4phgd2en3a2e5tn2eunrfam.apps.googleusercontent.com';
  onFinish = (values) => {
    this.props.userSignUp(values);
    this.props.history.push('/');
    console.log('Received values of form: ', values);
  };

  validateExistingFields = (values) => {
    return this.props.validateExistingFields(values);
  }


  componentDidUpdate() {
    if (this.props.token !== null) {
      this.props.history.push('/signin');
    }
  }

  onSuccess = (res) => {
    console.log('Login Success: currentUser:', res);

    console.log('Login Success: currentUser:', res.profileObj);
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    );
  };

  onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
    );
  };



  render() {
    return (
      <div className="gx-login-container">
        <div className="gx-login-content">
          <div className="gx-login-header gx-text-center">
            <h1 className="gx-login-title">Sign Up</h1>
          </div>
          <Form onFinish={this.onFinish} className="gx-login-form gx-form-row0">
            <Form.Item
              name="userName"
              rules={[
                {
                  required: true,
                  message: 'Please input your userName!',
                },
                ({ getFieldValue }) => ({
                  async validator(_, value) {
                    console.log(value);
                    try {
                      const resp = await axios.post('users/validateExistingFields', { "key": "userName", "value": value });
                      return Promise.resolve(true);

                    } catch (error) {
                      return Promise.reject(new Error("Email already in use"));
                    }
                  }
                }),
              ]}
              hasFeedback
            >
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="User Name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Please input your valid email!',
                },
                ({ getFieldValue }) => ({
                  async validator(_, value) {
                    console.log(value);
                    try {
                      const resp = await axios.post('users/validateExistingFields', { "key": "email", "value": value });
                      return Promise.resolve(true);

                    } catch (error) {
                      return Promise.reject(new Error("Email already in use"));
                    }
                  }
                }),
              ]}
              hasFeedback
            >
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email address" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            {/* <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox><IntlMessages id="appModule.iAccept" /></Checkbox>
              )}
              <span className="gx-link gx-signup-form-forgot"><IntlMessages
                id="appModule.termAndCondition" /></span>
            </FormItem> */}
            <FormItem>
              <Button type="primary" block className="gx-mb-2" htmlType="submit">
                <IntlMessages id="app.userAuth.signUp" />
              </Button>
              <Button type="dashed" href="/signin" block>
                <IntlMessages
                  id="app.userAuth.signIn" />
              </Button>
              {/* <GoogleLogin block
                clientId={this.clientId}
                buttonText="Sign Up"
                onSuccess={this.onSuccess}
                onFailure={this.onFailure}
                cookiePolicy={'single_host_origin'}
                style={{ marginTop: '100px', width:'display:block' }}
                isSignedIn={true}
              /> */}
            </FormItem>
          </Form>
        </div>
        <InfoView />
      </div>
    );
  }
}


const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token }
};

export default connect(mapStateToProps, { userSignUp })(SignUp);
