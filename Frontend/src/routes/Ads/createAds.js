import React, { useState } from "react";
import { Button, Checkbox, Input, Form, DatePicker, Upload, Select,Mentions } from "antd";
import { connect } from "react-redux";
import { adCreate } from "../../appRedux/actions/ManageAd";
import Icon from '@ant-design/icons';
import InfoView from "components/InfoView";
import { UploadOutlined, InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import axios from 'util/Api';

import IntlMessages from "util/IntlMessages";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Option = Select.Option;

class CreateAds extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hashtags: [{hashtag:"test"}]};
  }
  onFinish = (values) => {
    this.props.adCreate(values);
    console.log('Received values of form: ', values);
  };
  componentDidUpdate() {
    if(this.props.ads){
      console.log("ad creatted");
      //this.props.history.push('/ads');
    }
  }

  handleChange = (value) => {
    console.log('Received values of form: ', value);
  }

  onChange = async(value) => {
    this.setState({
      loading: true,
    });
    console.log("this.props.token",this.props.token);
    let resp = await axios.get('hashtags/list');
    if(resp && resp.data && resp.data.details){
      this.setState({
        hashtags: resp.data.details,
        loading: false,
      });
    }
  }

  onSelect = (option) => {
    console.log('select', option);
  }
  render() {
    let rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };

    let normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
    let disabledDate = (current) => {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    }

    let headers = {
      authorization: "Bearer "+this.props.token
    }
    return (
      <Form onFinish={this.onFinish} className="gx-form-row">
        <Form.Item name="adText">
          <Mentions rows={8}
            style={{ width: '100%' }}
            onSearch={this.onChange}
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
        </Form.Item>


          <Form.Item>
          <Form.Item name="adMedia" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload.Dragger name="adMedia" action="http://localhost:8000/ads/uploadAdMedia"  headers={headers}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
        <FormItem>
          <Button type="primary" block className="gx-mb-2" htmlType="submit">
            <IntlMessages id="app.createAd" />
          </Button>
        </FormItem>

      </Form>
    );
  }
};

const mapStateToProps = ({ auth }) => {
  const { ads, token, history } = auth;
  return { ads, token, history }
};

export default connect(mapStateToProps, { adCreate })(CreateAds);


