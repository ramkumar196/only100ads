import React from "react";
import {Card, Col, Row} from "antd";
import IntlMessages from "util/IntlMessages";
import PostList from "../../components/wall/PostList/index";
import CustomScrollbars from "util/CustomScrollbars";

const Home = () => {

  let postList = [];
  let user = [];

  return (

      <div className="gx-main-content">
      <Row>
        <Col xl={6} lg={8} md={0} sm={10} xs={24} className="gx-d-none gx-d-sm-block">
        </Col>
        <Col xl={12} lg={12} md={24} sm={16} xs={24}>
          <CustomScrollbars className="gx-wall-scroll">
            <div className="gx-wall-postlist">
              <PostList postList={postList} user={user}/>
            </div>
          </CustomScrollbars>
        </Col>
      </Row>
    </div>

  );
};

export default Home;
