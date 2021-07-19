import React from "react";
import {Button, Checkbox, Input, Form} from "antd";
import {connect} from "react-redux";
import {Link,useParams} from "react-router-dom";
import {resetPassword} from "../appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";
import Icon from '@ant-design/icons';

const FormItem = Form.Item;
class ResetPassword extends React.Component {

  onFinish = (values) => {
    this.props.resetPassword(this.props.match.params.id,values);
    console.log('Received values of form: ', values);
  };

  componentDidUpdate() {
    if (this.props.token !== null) {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <div className="gx-login-container">
        <div className="gx-login-content">

          <div className="gx-login-header">
            <img src={require("assets/images/logo-white.png")} alt="wieldy" title="wieldy"/>
          </div>
          <div className="gx-mb-4">
            <h2>Reset Password</h2>
            <p><IntlMessages id="appModule.enterPasswordReset"/></p>
          </div>
          <Form onFinish={this.onFinish} className="gx-login-form gx-form-row0">
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
            <FormItem>
              <Button type="primary" htmlType="submit">
              <IntlMessages id="app.userAuth.reset"/>
              </Button>
            </FormItem>
              </Form>
            </div>
            <InfoView/>
          </div>
    );
  }
}

const mapStateToProps = ({auth}) => {
  const {token} = auth;
  return {token}
};

export default connect(mapStateToProps, {resetPassword})(ResetPassword);
