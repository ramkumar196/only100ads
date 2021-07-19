import React from "react";
import {Button, Checkbox, Input, Form} from "antd";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {userSignIn} from "../appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";
import Icon from '@ant-design/icons';

const FormItem = Form.Item;

class SignIn extends React.Component {

  onFinish = (values) => {
    this.props.userSignIn(values);
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
          <div className="gx-login-header gx-text-center">
            <h1 className="gx-login-title">Sign In</h1>
          </div>
          <Form onFinish={this.onFinish} className="gx-login-form gx-form-row0">
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
                }
              ]}
              hasFeedback
            >
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email" />
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
              <Input.Password               placeholder="Password"/>
            </Form.Item>
                {/* <FormItem>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox><IntlMessages id="appModule.iAccept"/></Checkbox>
                  )}
                  <span className="gx-signup-form-forgot gx-link"><IntlMessages
                    id="appModule.termAndCondition"/></span>
                </FormItem> */}
                <FormItem>
                  <Button type="primary" block className="gx-mb-2" htmlType="submit">
                    <IntlMessages id="app.userAuth.signIn"/>
                  </Button>
                  <Button type="dashed" className="gx-mb-2" href="/signup" block>
                  <IntlMessages
                  id="app.userAuth.signUp"/>
                </Button>
                <Button type="dashed" className="gx-mb-2" href="/forgot-password" block>
                  <IntlMessages
                  id="app.userAuth.forgotPassword"/>
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

export default connect(mapStateToProps, {userSignIn})(SignIn);
