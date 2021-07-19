import React from "react";
import {Card, Col, Row} from "antd";
import IntlMessages from "util/IntlMessages";
import CreateAds from "./createAds";
import Profile from "components/wall/Profile/index";
import PostList from "components/wall/PostList/index";
import Interests from "components/wall/Interests/index";
import Photos from "components/wall/Photos/index";
import Friends from "components/wall/Friends/index";
import CustomScrollbars from "util/CustomScrollbars";
import RecentActivity from "components/dashboard/CRM/RecentActivity";
import {communitiesList, friendList, interestList, photoList, postList, recentActivity, user, userInfo} from "./data"
import Communities from "../../components/wall/Communities/index";

const ManageAds = () => {
  return (

      // <Row>
      // <Col lg={12} md={12} sm={24} xs={24}>
      //   <Card title={<IntlMessages id="app.createAd" />}>
      //   <CreateAds></CreateAds>
      //   </Card>
      // </Col>
      // </Row>
      <div className="gx-main-content">
      <Row>
        <Col xl={6} lg={8} md={8} sm={10} xs={24} className="gx-d-none gx-d-sm-block">
          <CustomScrollbars className="gx-wall-scroll">
            <Profile user={user} userInfo={userInfo}/>
            {/* <Interests interestList={interestList}/>
            <Friends friendList={friendList}/>

            <Photos photoList={photoList} title="Photos"/>
            <span className="gx-text-primary gx-fs-md gx-pointer gx-d-block gx-mb-4">Go to gallery <i
              className={`icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle`}/></span>*/}
          </CustomScrollbars>
        </Col>
        <Col xl={12} lg={12} md={16} sm={14} xs={24}>
          <CustomScrollbars className="gx-wall-scroll">
            <div className="gx-wall-postlist">
              <PostList postList={postList} user={user}/>
            </div>
          </CustomScrollbars>
        </Col>
        {/* <Col xl={6} lg={8} md={6} sm={24} xs={24} className="gx-d-none gx-d-lg-block">
          <CustomScrollbars className="gx-wall-scroll">
            <Communities communitiesList={communitiesList}/>
            <span className="gx-text-primary gx-fs-md gx-pointer gx-d-block gx-mb-4">See All Communities <i
              className={`icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle`}/></span>
            <RecentActivity recentList={recentActivity} shape="square"/>
          </CustomScrollbars>
        </Col> */}
      </Row>
    </div>

  );
};

export default ManageAds;