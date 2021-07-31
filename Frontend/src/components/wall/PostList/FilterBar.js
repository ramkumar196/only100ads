import React, {Component} from "react";
import {Avatar, Card, Select, Spin, Button, Space,Skeleton} from "antd";
import axios from 'util/Api';

const { Option } = Select;

class FilterBar extends Component {

  state = {
    loading: false,
    filterValue: [],
    options:[]
  };

  componentWillMount() {
    console.log("hash list",this.props.hashtags);
  }

  handleSearch = value => {
    console.log("handleSearch",value)
    //this.props.hashtagList(value);
  };

  handleClear = value => {
    this.state.filterValue = [];
    this.props.filterAdList();
  };



  handleChange = value => {
    console.log(value);
    // this.setState({
    //   filterValue:[...value]
    // });
    this.state.filterValue.push(value);
    this.props.filterAdList(this.state.filterValue);
  };

  render() {
    console.log("hash list- render",this.props);
    if(this.props.hashtags) {
     let options = this.props.hashtags.map(d => <Option key={d.hashtag}>#{d.hashtag}</Option>)

    return (
      <Card className="gx-card">
        <Select
        mode="multiple"
        //showSearch
        loading={this.state.loading}
       // value={this.state.filterValue}
        placeholder={this.props.placeholder}
        style={this.props.style}
        allowClear={true}
        onClear={this.handleClear}
        // //defaultActiveFirstOption={false}
        // showArrow={false}
        // filterOption={false}
        // onSearch={this.handleSearch}
        onSelect={this.handleChange}
        // notFoundContent={null}

      >
        {options}
      </Select>
      <Button onClick="" type="primary" className="gx-mb-2">Filter</Button>
      </Card>
    )
    } else  {
      return (
        <Skeleton avatar paragraph={{ rows: 3 }} />
        )
    }
  }
}

export default FilterBar;
