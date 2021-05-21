import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
export default class UpdateForm extends Component {
  static propTypes = {
    category: PropTypes.object.isRequired,
    setForm: PropTypes.func.isRequired
  };

  render() {
    const { category } = this.props;
    console.log(category);
    return (
      <Form>
        <Item
          name="username"
          rules={[{ required: true, message: "名称必须输入!" }]}
        >
          <Input
            placeholder="请输入分类名称"
            initialvalues={category.name}
            ref={input => this.props.setForm(input)}
          ></Input>
        </Item>
      </Form>
    );
  }
}
