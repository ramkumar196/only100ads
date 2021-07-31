import React, {Component} from "react";
import { Skeleton, Empty } from 'antd';

import PostItem from "./PostItem";
import AdItem from "./AdItem";
import FilterBar from "./FilterBar";
import WriteAdBox from "../../../components/wall/WriteAdBox/index";
import Auxiliary from "../../../util/Auxiliary";
import axios from 'util/Api';
import { adCreate,adListNoAuth,adList,hashtagList } from "../../../appRedux/actions/ManageAd";
import { getAccountDetails } from "../../../appRedux/actions/Account";

import { connect } from "react-redux";

class PostList extends Component {

  currentDate = new Date();
  currentTimeStamp = this.currentDate.getTime();
  state = {
    postList:[],
    userDetails:{},
    hashtags:[],
    user: {},
    loading:true
  }



  // hashtagList = async (value) => {
  //   //console.log("this props",this.props)
  //   let resp = await axios.get('hashtags/list?keyword='+value);
  //   if(resp && resp.data && resp.data.details){
  //     return resp.data.details;
  //   } else {
  //     return [];
  //   }
  // }

  // userDetails = async(value) => {
  //   this.setState({
  //     loading: true,
  //   });
  //   let resp = await axios.get('account/userDetails');
  //   //console.log("fetching user",resp.data.details.userDetails);
  //   if(resp && resp.data && resp.data.details){
  //     this.setState({
  //       userDetails: resp.data.details.userDetails,
  //       loading: false,
  //     });
  //     //console.log("after setting",this.state.userDetails);

  //   }
  // }


  componentWillMount() {
    console.log("**********************COMPONENT-WILL-MOUNT********************************")
    this.setState({
          loading: true,
        });

    if(!this.props.token) {
      this.props.adListNoAuth();
    } else {
    this.props.adList();
    this.props.getAccountDetails();
    this.props.hashtagList();
    }
    // //console.log("componentDidMount",this.props);
    // this.setState({
    //   loading: false,
    //   postList:this.props.adsList
    // });
    ////console.log("postList",this.state.postList)
  }
  // componentDidUpdate(prevProps) {
  //   //console.log("prevProps",prevProps)
  //  return {
  //     postList:prevProps.adsList
  //   }
  // }

  // static getDerivedStateFromProps(props, current_state) {
  //   //console.log("current_state",current_state)
  //     return {
  //       postList: props.adsList,
  //     }
  // }

  addPost(adText, imageList) {
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
          //console.log("imageNameList-in",imageNameList);
        }

    });

    const post = {
      adText: adText,
      adMedia:imageList,
      adImages:imageNameList
    };

    this.props.adCreate(post);
    this.props.adList();

  }

  filterAdList = async (hashtags) => {
    this.props.adList({hashtags:hashtags});
  }

  generateAdItem = () =>{
    let k=0
    if(this.props.adsList.length == 0){
      return <Empty/>;
    }
    let AdItems = this.props.adsList.map((post) => {
      ++k;
      console.log("<-------"+k+"---post---------------->",post)
      return <AdItem key={k} post={post} user={this.props.userDetails} />
    })

    return AdItems;
  }

  generateNoAuthAdItem = () =>{
    let k=0
    if(this.props.adNoAuthList.length == 0){
      return <Empty/>;
    }
    let AdItems = this.props.adNoAuthList.map((post) => {
      ++k;
      console.log("<-------"+k+"---post---------------->",post)
      return <AdItem key={k} post={post} user={this.props.userDetails} />
    })

    return AdItems;
  }



  render() {
    console.log("**********************RENDERING********************************")
    if(this.props.adsList && this.props.userDetails && this.props.token) {
    return (
      <Auxiliary>
        <WriteAdBox addPost={this.addPost.bind(this)} hashtagList={this.props.hashtagList} adList={this.props.adsList} adListFunc={this.props.adList} user={this.props.userDetails} userDetails={this.props.userDetails}/>
        <FilterBar filterAdList={this.filterAdList.bind(this)} hashtags={this.props.hashtagsList} hashtagList={this.props.hashtagList}  placeholder="Filter By Hashtags" style={{ width: "75%", margin:"5px" }}  />
        {this.generateAdItem()}
      </Auxiliary>
    )
    } else if (!this.props.token && this.props.adNoAuthList) {
      return (
        <Auxiliary>
          {this.generateNoAuthAdItem()}
        </Auxiliary>
      )
    } else {
        return (
        <Skeleton avatar paragraph={{ rows: 20 }} />
        )
    }
  }
}


const mapStateToProps = ({ auth }) => {
  //console.log("PROPS UPDAETING!!!!!!!")
  //console.log(auth)
  const { ads, token, history, adsList,adNoAuthList, userDetails, hashtagsList } = auth;
  return { ads, token, history, adsList,adNoAuthList, userDetails, hashtagsList  }
};

export default connect(mapStateToProps, { adCreate,adList,hashtagList,getAccountDetails,adListNoAuth })(PostList);
