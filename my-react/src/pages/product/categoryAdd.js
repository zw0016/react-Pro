import React, { Component } from "react";
import { Form, Select, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;
export default class AddForm extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired,
    setClasses: PropTypes.func.isRequired,
    setInput: PropTypes.func.isRequired
  };
  render() {
    const { categorys } = this.props;
    return (
      <Form onValuesChange={this.onFinish}>
        <Item name="classer">
          <Select initialvalues="0" ref={input => this.props.setClasses(input)}>
            <Option value="0">一级分类</Option>
            {categorys.map(item => (
              <Option key={item._id} value={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          name="input"
          rules={[{ required: true, message: "名称必须输入!" }]}
        >
          <Input
            initialvalues="请输入分类名称"
            ref={input => this.props.setInput(input)}
          ></Input>
        </Item>
      </Form>
    );
  }
}
