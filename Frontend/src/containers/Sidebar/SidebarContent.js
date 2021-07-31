import React, {Component} from "react";
import {connect} from "react-redux";
import {Menu} from "antd";
import {Link} from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";

import Auxiliary from "util/Auxiliary";
import UserProfile from "./UserProfile";
import AppsNavigation from "./AppsNavigation";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import IntlMessages from "../../util/IntlMessages";
import {getUser} from "../../appRedux/actions/Auth";
class SidebarContent extends Component {

  getNoHeaderClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  render() {
    const {themeType, navStyle, pathname} = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (<Auxiliary>

        <SidebarLogo/>
        <div className="gx-sidebar-content">
          {/* <div className={`gx-sidebar-notifications ${this.getNoHeaderClass(navStyle)}`}>
            <UserProfile/>
            <AppsNavigation/>
          </div> */}
          <CustomScrollbars className="gx-layout-sider-scrollbar">
            <Menu
              defaultOpenKeys={[defaultOpenKeys]}
              selectedKeys={[selectedKeys]}
              theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
              mode="inline">
                { this.props.token  &&
                <Menu.Item key="ads">
                <Link to="/ads"><i className="icon icon-widgets"/>
                  Listings</Link>
                </Menu.Item>

                }
                { this.props.token  &&

                 <Menu.Item key="profile">
                  <Link to="/profile"><i className="icon icon-account"/>
                  Profile</Link>
                </Menu.Item>
                }

                <Menu.Item key="home">
                  <Link to="/home"><i className="icon icon-home"/>
                  Home</Link>
                </Menu.Item>
                <Menu.Item key="aboutus">
                  <Link to="/about-us"><i className="icon icon-about"/>
                  About Us</Link>
                </Menu.Item>


            </Menu>
          </CustomScrollbars>
        </div>
      </Auxiliary>
    );
  }
}

SidebarContent.propTypes = {};
const mapStateToProps = ({settings,auth}) => {
  const {navStyle, themeType, locale, pathname} = settings;
  const {authUser, token, initURL} = auth;

  return {navStyle, themeType, locale, pathname, token}
};
export default connect(mapStateToProps,{getUser})(SidebarContent);

