import React, { Component } from "react";
import { Tree, Input, Form } from "antd";
import menuList from "../../config/menuConfig";
import PropTypes from "prop-types";
export default class SetTree extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    console.log(this.props.role);
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus
    };
  }
  /* 为父组件提交获取最新menus数据的方法 */
  getMenus = () => this.state.checkedKeys;
  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;
    const treeData = menuList;
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label宽度
      wrapperCol: { span: 10 } //右侧包裹输入框宽度
    };
    const onCheck = checkedKeys => {
      // console.log("onCheck", checkedKeys);
      this.setState({ checkedKeys: checkedKeys });
    };
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label="角色名称">
            <Input value={role.name} disabled />
          </Form.Item>
          <Form.Item>
            <Tree
              checkable
              //   defaultExpandedKeys={['0-0-0', '0-0-1']}
              defaultExpandAll={true}
              //   defaultSelectedKeys={['0-0-0', '0-0-1']}
              checkedKeys={checkedKeys}
              // onSelect={onSelect}
              onCheck={onCheck}
              treeData={treeData}
            />
          </Form.Item>
        </Form>
      </div>
    );
  }
}
