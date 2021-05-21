import React, { Component } from "react";
import HeaderStyle from "./header.module.scss";
import { withRouter } from "react-router-dom";
import { reqWeather } from "../../api/index";
import logo from "../../assets/imgs/logo.png";
import { formateDate } from "../../utils/dateUtils";
import menuList from "../../config/homeList";
import { Modal } from "antd";
class HeaderMsg extends Component {
  state = {
    dayPictureUrl: "", //天气图片
    weather: "", //天气地址
    currentTime: formateDate(Date.now()),
    title: "商品"
  };
  //获取天气
  getWeather = async () => {
    // 发请求
    const { dayPictureUrl, weather } = await reqWeather("北京");
    // 更新状态
    this.setState({
      dayPictureUrl,
      weather
    });
  };
  //获取时间
  getTime() {
    setInterval(() => {
      const currenTime = Date.now();
      this.setState({
        currenTime: currenTime
      });
    }, 1000);
  }
  //获取当前路径
  getTitle = () => {
    let title = "";
    const path = this.props.location.pathname;
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(
          cItem => path.indexOf(cItem.key) === 0
        );
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };
  componentDidMount() {
    this.getWeather();
    // 启动循环定时器
    this.intervalId = setInterval(() => {
      // 将currentTime更新为当前时间值
      this.setState({
        currentTime: formateDate(Date.now())
      });
    }, 1000);
  }

  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.intervalId);
  }

  backHome = () => {
    // 显示确认提示
    Modal.confirm({
      title: "确认退出吗?",
      onOk: () => {
        this.props.history.push("/");
        //同时清理store中数据和sessionstorage中数据
        sessionStorage.clear();
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  render() {
    const currentTime = formateDate(this.state.currentTime);
    // 得到当前需要显示的title
    const title = this.getTitle();
    return (
      <div className={HeaderStyle["header-box"]}>
        <div className={HeaderStyle["header-top"]}>
          <span>欢迎，admin</span>
          <button className={HeaderStyle["back-home"]} onClick={this.backHome}>
            退 出
          </button>
        </div>
        <div className={HeaderStyle["header-bottom"]}>
          <div className={HeaderStyle["header-left"]}>
            <p className={HeaderStyle["header-text"]}>{title}</p>
          </div>
          <div className={HeaderStyle["header-right"]}>
            <p className={HeaderStyle["line-time"]}>当前时间:{currentTime}</p>
            <p className={HeaderStyle["line-text"]}>当天天气:</p>
            <p className={HeaderStyle["line-img"]}>
              <img src={this.state.dayPictureUrl || logo} alt=""></img>
            </p>
            <p className={HeaderStyle["line-season"]}>
              {this.state.weather || "晴天"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(HeaderMsg);
