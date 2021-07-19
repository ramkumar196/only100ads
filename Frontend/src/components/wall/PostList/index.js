import React, {Component} from "react";
import PostItem from "./PostItem";
import AdItem from "./AdItem";
import WriteAdBox from "../../../components/wall/WriteAdBox/index";
import Auxiliary from "../../../util/Auxiliary";
import axios from 'util/Api';
import { adCreate } from "../../../appRedux/actions/ManageAd";
import { connect } from "react-redux";

class PostList extends Component {

  state = {
    postList: [],
    user: {}
  }



  componentWillMount() {
    //this.setState({postList: this.adList(), user: this.props.user})
    this.adList();
    console.log(this.state.postList);
  }

  adList = async(value) => {

    let resp = await axios.get('ads/list');
    if(resp && resp.data && resp.data.details){
      this.setState({
        postList: resp.data.details.ads,
        loading: false,
      });
    }
  }

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
          console.log("imageNameList-in",imageNameList);
        }

    });
    console.log("imageNameList-out",imageNameList);

    const post = {
      adText: adText,
      adMedia:imageList,
      adImages:imageNameList
    };

    this.props.adCreate(post);
    this.adList();

  }

  render() {
    return (
      <Auxiliary>
        <WriteAdBox addPost={this.addPost.bind(this)} user={this.state.user}/>
        {this.state.postList.map((post) => {
            return <AdItem postData={post} user={this.state.user}/>
          }
        )}
      </Auxiliary>
    )
  }
}


const mapStateToProps = ({ auth }) => {
  const { ads, token, history } = auth;
  return { ads, token, history }
};

export default connect(mapStateToProps, { adCreate })(PostList);
