import React from "react";
import {Card, Col, Row, Tabs} from "antd";
import Auxiliary from "../../util/Auxiliary";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import Logout from "./Logout";

const { TabPane } = Tabs;

const ManageProfile = () => {

  let callback = (key) => {
    console.log(key);
  }
  return (

    <Auxiliary>
    <div className="gx-profile-content">
    <Row>
        <Col xl={6} lg={8} md={8} sm={10} xs={24} className="gx-d-none gx-d-sm-block">
        </Col>
        <Col xl={12} lg={12} md={16} sm={14} xs={24}>
        <Card className="gx-card">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Edit Profile" key="1">
            <EditProfile/>
          </TabPane>
          <TabPane tab="Change Password" key="2">
            <ChangePassword/>
          </TabPane>
          <TabPane tab="Logout" key="3">
            <Logout/>
          </TabPane>
        </Tabs>
        </Card>
        </Col>
      </Row>
    </div>
  </Auxiliary>

  );
};

export default ManageProfile;
