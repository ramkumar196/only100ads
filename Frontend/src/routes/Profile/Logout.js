import React from "react";
//import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox, Form, Input, Upload, Avatar, Space, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { UploadOutlined,UserOutlined, InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { userSignOut } from "../../appRedux/actions/Auth";
import axios from 'util/Api';

import IntlMessages from "util/IntlMessages";
import InfoView from "components/InfoView";
import Icon from '@ant-design/icons';
import { GoogleLogin } from 'react-google-login';

const FormItem = Form.Item;


class Logout extends React.Component {

  state = {
    userDetails:{
      profileImage: '',
      userName: '',
      email: '',
    },
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

  logout = (values) => {
    this.props.userSignOut();
  };

  componentDidUpdate() {

  }
  render() {

    if(this.state.loading){
      return (<div><Skeleton/></div>)

    }else {


    return (
      <div>
        <Button type="dashed" className="gx-mb-2" onClick={this.logout()} block>
          Sign Out
        </Button>
      </div>

    )
            }
  }
}


const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token }
};

export default connect(mapStateToProps, { userSignOut })(Logout);
