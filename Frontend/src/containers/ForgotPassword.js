import React from "react";
import {Button, Checkbox, Input, Form} from "antd";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {forgotPassword} from "../appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";
import Icon from '@ant-design/icons';

const FormItem = Form.Item;

class ForgotPassword extends React.Component {

  onFinish = (values) => {
    this.props.forgotPassword(values);
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
            <h2>Forgot Your Password ?</h2>
            <p><IntlMessages id="app.userAuth.forgot"/></p>
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
            <FormItem>
              <Button type="primary" htmlType="submit">
                <IntlMessages id="app.userAuth.send"/>
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

export default connect(mapStateToProps, {forgotPassword})(ForgotPassword);
