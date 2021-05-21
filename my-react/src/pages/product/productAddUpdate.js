import React, { Component } from "react";
import { Card, Input, Select, Button, Form, message } from "antd";
import LinkButton from "../../compoents/link-button";
import { reqAddUpdateProduct, reqCategorys } from "../../api/index";
import detailStyle from "./productDetail.module.scss";
import { connect } from "react-redux";
//antd 4.0 版本icons 需要单独引入
import { LeftOutlined } from "@ant-design/icons";
import PicturesWall from "./pictureWall";
import RichText from "./richText";
const Item = Form.Item;
const Option = Select.Option;
// 指定form中所有item的布局
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 }
};
class ProductAddUpdate extends Component {
  constructor(props) {
    super(props);
    this.picRef = React.createRef();
    this.richRef = React.createRef();
  }
  state = {
    product: {},
    categoryName: "",
    categorys: [],
    isUpdate: true
  };
  //获取分类标签
  getCategorys = async () => {
    const result = await reqCategorys();
    if (result.status === 0) {
      const categorys = result.data;
      this.setState({ categorys });
    }
  };
  //对价格进行校验
  //rule 规则 value值 callback 成功后回调
  validatePrice = (rule, value, callback) => {
    if (value === "") {
      callback();
    } else if (value * 1 <= 0) {
      callback("价格必须大于0");
    } else {
      callback();
    }
  };
  //成功修改或者新的方法
  onFinish = async values => {
    //调用子组件获取url的方法
    const imgs = this.picRef.current.getImgs();
    // 输入的商品详情的标签字符串
    const detail = this.richRef.current.getDetail();
    const { name, desc, categoryId, price } = values;
    const product = { name, desc, price, categoryId, imgs, detail };
    //判断是否是新增还是修改
    //如果是新增就带上id
    if (this.state.isUpdate) {
      product._id = this.state.product._id;
    }
    console.log(product);
    // 发请求添加或修改
    const result = await reqAddUpdateProduct(product);
    // console.log(result)
    if (result.status === 0) {
      message.success(`${this.state.isUpdate ? "修改" : "添加"}商品成功`);
      this.props.history.replace("/home/products/products");
    } else {
      message.error(result.msg);
    }
  };
  //判断是修改还是增加
  componentWillMount() {
    const product = this.props.detailInfo.detailInfo;
    if (product) {
      console.log(product);
      this.setState({
        isUpdate: !!product._id,
        product: product
      });
    } else {
      return;
    }
  }
  componentDidMount() {
    this.getCategorys();
  }
  render() {
    const { product, categorys, isUpdate } = this.state;
    const title = (
      <span>
        <LinkButton
          onClick={() => {
            this.props.history.goBack();
          }}
        >
          <LeftOutlined />
        </LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );
    return (
      <div>
        <Card title={title} className={detailStyle["detail"]}>
          <Form {...formItemLayout} onFinish={this.onFinish} name="message">
            <Item
              className={detailStyle["list-item"]}
              label="商品分类"
              name="name"
              initialValue={product.name}
              rules={[
                {
                  required: true,
                  message: "必须输入商品名称"
                }
              ]}
            >
              <Input placeholder="请输入商品名称" />
            </Item>
            <Item
              className={detailStyle["list-item"]}
              label="商品描述"
              name="desc"
              initialValue={product.desc || ""}
              rules={[
                {
                  required: true,
                  message: "必须输入商品描述"
                }
              ]}
            >
              <Input placeholder="Basic usage" value={product.desc} />
            </Item>
            <Item
              className={detailStyle["list-item"]}
              label="商品价格"
              name="price"
              initialValue={product.price || ""}
              rules={[
                {
                  required: true,
                  message: "必须输入商品价格",
                  validator: this.validatePrice
                }
              ]}
            >
              <Input type="number" placeholder="商品价格" addonAfter="元" />
            </Item>
            <Item
              className={detailStyle["list-item"]}
              label="所属分类"
              name="categoryId"
              initialValue={product.categoryId || ""}
            >
              <Select>
                <Option value="">未选择</Option>
                {categorys.map(item => (
                  <Option value={item._id} key={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item className={detailStyle["list-item"]} label="商品图片">
              {/* 获取元素 同时将图片名称传入图片上传的组件 */}
              <PicturesWall
                ref={this.picRef}
                imgs={product.imgs}
              ></PicturesWall>
            </Item>
            <Item
              className={detailStyle["list-item"]}
              label="商品详情"
              wrapperCol={{ span: 20 }}
            >
              <RichText detail={product.detail} ref={this.richRef}></RichText>
            </Item>
            <Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Item>
          </Form>
        </Card>
      </div>
    );
  }
}
const mapStateProps = state => {
  //  console.log('reducer',state)
  return state;
};

export default connect(mapStateProps)(ProductAddUpdate);
