import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import login from "./login.module.scss";
import { reqLogin } from "../../api/index";
import { connect } from "react-redux";

class Login extends Component {
  //完成后点击登陆
  onFinish = async values => {
    const { username, password } = values;
    //调用接口 返回数据
    const result = await reqLogin(username, password);
    console.log(result);
    if (result.status === 0) {
      const user = result.data;
      //session和store 记录user信息
      //session 只能存字符串
      sessionStorage.setItem("user_info", JSON.stringify(result.data));
      this.props.saveUser(user.role);
      //成功后跳转
      this.props.history.push("/home");
    }

    message.success("登陆成功!");
  };
  render() {
    // 读取保存的user, 如果存在, 直接跳转到管理界面
    const user = JSON.parse(sessionStorage.getItem("user_key") || "{}");
    if (user._id) {
      return <Redirect to="/" />; // 自动跳转到指定的路由路径
    }
    return (
      <div className={login["box"]}>
        <div className={login["login-box"]}>
          <p className={login["login-text"]}>用户登陆</p>
          <Form
            className={login["login-form"]}
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                // 声明式验证: 使用插件已定义好的规则进行验证
                // 1).必须输入
                // 2). 必须大于等于4位
                // 3). 必须小于等于12位
                // 4). 必须是英文、数字或下划线组成
                { required: true, whitespace: true, message: "用户名是必须" },
                { min: 4, message: "用户名不能小于4位" },
                { max: 12, message: "用户名不能大于12位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名必须是英文、数字或下划线组成"
                }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                // 声明式验证: 使用插件已定义好的规则进行验证
                // 1).必须输入
                // 2). 必须大于等于4位
                // 3). 必须小于等于12位
                // 4). 必须是英文、数字或下划线组成
                { required: true, whitespace: true, message: "密码是必须" },
                { min: 4, message: "密码不能小于4位" },
                { max: 12, message: "密码不能大于12位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名必须是英文、数字或下划线组成"
                }
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <div className={login["button-box"]}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={login["login-button"]}
                >
                  登陆
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
const mapDispatchToprops = dispatch => {
  return {
    saveUser: userInfo => {
      //传递action 对象 定义一个type属性
      dispatch({
        type: "SAVE_USERMSG",
        userInfo: userInfo
        //可以用来传参数
      });
    }
  };
};
const mapStateProps = state => {
  //  console.log('reducer',state)
  return state;
};
export default connect(
  mapStateProps,
  mapDispatchToprops
)(Login);
