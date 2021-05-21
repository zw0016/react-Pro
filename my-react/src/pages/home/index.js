import React, { Component } from "react";
import asyncProduct from "../product/index";
import { Layout } from "antd";
import { Redirect, Switch, Route } from "react-router-dom";
import LBar from "../../compoents/LeftBar/leftbar";
import HeaderMsg from "../../compoents/headerMsg/index";
import Loadable from "react-loadable";
const { Header, Footer, Sider, Content } = Layout;

const asyncAdmin = Loadable({
  loader: () => import("../admin/admin"),
  loading: () => null
});
const asyncUser = Loadable({
  loader: () => import("../user/user"),
  loading: () => null
});
const asyncRole = Loadable({
  loader: () => import("../role/role"),
  loading: () => null
});

class Home extends Component {
  render() {
    // 读取保存的user, 如果不存在, 直接跳转到登陆界面
    // if (!user._id) {
    //   // this.props.history.replace('/login') // 事件回调函数中进行路由跳转
    //   return <Redirect to="/login"/> // 自动跳转到指定的路由路径
    // }
    return (
      <div style={{ height: "100%", position: "absolute", width: "100%" }}>
        <Layout style={{ height: "100%" }}>
          <Sider>
            <LBar></LBar>
          </Sider>
          <Layout>
            <Header
              style={{ background: "white", padding: "0px", height: "80px" }}
            >
              <HeaderMsg></HeaderMsg>
            </Header>
            <Content style={{ background: "white", margin: "20px" }}>
              <Switch>
                <Route path="/home/admin" component={asyncAdmin}></Route>
                <Route path="/home/products" component={asyncProduct}></Route>
                <Route path="/home/role" component={asyncRole}></Route>
                <Route path="/home/user" component={asyncUser}></Route>
                <Redirect to="/home/admin" />
              </Switch>
            </Content>
            <Footer
              style={{ textAlign: "center", color: "rgba(0, 0, 0, 0.5)" }}
            >
              推荐使用谷歌浏览器，可以获得更佳页面操作体验
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default Home;
