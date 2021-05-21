import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { reqAddRole, reqUpdateRole, reqRoles } from "../../api/index";
import { formateDate } from "../../utils/dateUtils";
import AddForm from "./addRole";
import SetTree from "./setTree";
import { connect } from "react-redux";
class Role extends Component {
  constructor(props) {
    super(props);
    this.auth = React.createRef();
  }

  state = {
    roles: [], // 所有角色的列表
    role: [],
    loading: false,
    showStatus: 0
  };
  //退出修改
  handleCancel = () => {
    this.setState({ showStatus: 0 });
  };
  //侧边栏
  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: create_time => formateDate(create_time)
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: auth_time => formateDate(auth_time)
      },
      {
        title: "授权人",
        dataIndex: "auth_name"
      }
    ];
  };
  //获取初始数据
  getRoles = async () => {
    const result = await reqRoles();
    // console.log(result)
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles
      });
    }
  };
  //新增角色
  addRole = async () => {
    //调用子组件的值
    const newRole = this.input.props.value;
    const result = await reqAddRole(newRole);
    if (result.status === 0) {
      message.success("添加角色成功");
      //插入请求roles的最后一个位置
      const role = result.data;
      this.setState(state => ({
        roles: [...state.roles, role]
      }));
    } else {
      message.error("添加角色失败");
    }
    this.setState({ showStatus: 0 });
  };
  //更改角色权限
  setRole = async () => {
    const menus = this.auth.current.getMenus();
    //权限路由重新赋值
    const role = this.state.role;
    role.menus = menus;
    role.auth_time = Date.now();
    let userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    role.auth_name = userInfo.username;
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      message.success("设置权限成功");
      //如果更新的是自己角色权限,强制退出
      if (userInfo.username !== "admin" && role._id === userInfo.role_id) {
        sessionStorage.clear();
        this.props.clearUser();
        this.props.history.replace("/");
        message.info("权限已更改,请重新登录");
      }
    } else {
      message.error("设置权限失败");
    }
    this.setState({ showStatus: 0 });
  };
  //生命周期获取
  componentDidMount() {
    this.getRoles();
  }

  //渲染侧边栏
  UNSAFE_componentWillMount() {
    this.initColumn();
  }
  render() {
    const { roles, role, showStatus } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={() => this.setState({ showStatus: 1 })}>
          创建角色
        </Button>
        <Button
          type="primary"
          onClick={() => this.setState({ showStatus: 2 })}
          disabled={!role._id}
        >
          设置角色权限
        </Button>
      </span>
    );

    return (
      <div>
        <Card title={title}>
          <Table
            rowKey="_id"
            pagination={{
              pageSize: 8
              // , total: 50
            }}
            dataSource={roles}
            columns={this.columns}
            loading={this.state.loading}
            rowSelection={{
              type: "radio",
              selectedRowKeys: [role._id],
              onSelect: role => {
                this.setState({ role: role });
              }
            }} //设置单选
            onRow={role => {
              return {
                onSelect: event => {
                  this.setState({ role });
                },
                onClick: event => {
                  this.setState({ role });
                }, // 点击行
                onDoubleClick: event => {},
                onContextMenu: event => {},
                onMouseEnter: event => {}, // 鼠标移入行
                onMouseLeave: event => {}
              };
            }}
            bordered
          />
          <Modal
            title="添加角色"
            visible={showStatus === 1}
            onOk={this.addRole}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            {/* 新增角色组件 */}
            <AddForm
              categoryName
              setInput={input => {
                this.input = input;
              }}
            />
          </Modal>
          <Modal
            title="设置角色权限"
            visible={showStatus === 2}
            onOk={this.setRole}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            {/* 修改用户权限组件 */}
            <SetTree role={role} ref={this.auth}></SetTree>
          </Modal>
        </Card>
      </div>
    );
  }
}

const mapDispatchToprops = dispatch => {
  return {
    clearUser: () => {
      dispatch({
        type: "CLEAR_USERMSG"
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
)(Role);
