import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import leftBar from "./leftbar.module.css";
import logo from "../../assets/imgs/logo.png";
import { Menu } from "antd";
import menuList from "../../config/homeList";

const { SubMenu } = Menu;

class LeftBar extends Component {
  state = {
    collapsed: false,
    user: JSON.parse(sessionStorage.getItem("user_info"))
  };
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  /* 
  判断当前用户是否有此item对应的权限
  */
  // hasAuth  = (item) => {
  //   // 得到当前用户的所有权限
  //   const user=this.state.user
  //   const menus = user.role.menus
  //   // 1. 如果当前用户是admin
  //   // 2. 如果item是公开的
  //   // 3. 当前用户有此item的权限
  //   if (user.username === 'admin' || item.public || menus.indexOf(item.key)!==-1) {
  //     return true
  //   } else if (item.children) {
  //     // 4. 如果当前用户有item的某个子节点的权限, 当前item也应该显示
  //     const cItem = item.children.find(cItem => menus.indexOf(cItem.key)!==-1)
  //     return !!cItem
  //   }

  //   return false
  // }
  getMenuNodes = menuList => {
    // 得到当前请求的path
    const path = this.props.location.pathname;
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <NavLink to={item.key}>
              <span>{item.title}</span>
            </NavLink>
          </Menu.Item>
        );
      } else {
        // 如果当前请求路由与当前菜单的某个子菜单的key匹配, 将菜单的key保存为openKey
        if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
          this.openKey = item.key;
        }
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }
    });
  };

  /* 
  第一次render()之前执行一次
  为第一次render()做一些同步的准备工作
  */
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }
  render() {
    let selectKey = this.props.location.pathname; // /product/xxx
    if (selectKey.indexOf("/home/products") === 0) {
      selectKey = "/home/products";
    }
    return (
      <div className={leftBar["left-bar"]}>
        <NavLink className={leftBar["left-nav-bar"]} to="/">
          <img src={logo} alt="logo" className={leftBar["logo-img"]} />
          <span className={leftBar["logo-text"]}>管理层后台</span>
        </NavLink>
        <div style={{ width: 200 }}>
          <Menu
            defaultSelectedKeys={["admin"]} //默认选中的菜单
            defaultOpenKeys={[this.openKey]}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
          >
            {this.menuNodes}
          </Menu>
        </div>
      </div>
    );
  }
}
export default withRouter(LeftBar);
