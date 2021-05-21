import React, { Component } from "react";
import { Card, List } from "antd";
//antd 4.0 版本icons 需要单独引入
import { LeftOutlined } from "@ant-design/icons";
import LinkButton from "../../compoents/link-button";
import detailStyle from "./productDetail.module.scss";
import { reqProduct, reqCategory } from "../../api/index";
import { Redirect } from "react-router";
const Item = List.Item;
export default class ProductDetail extends Component {
  state = {
    products: {},
    categoryName: ""
  };
  //根据分类id获取分类
  getCategory = async categoryId => {
    const result = await reqCategory(categoryId);
    if (result.status === 0) {
      const categoryName = result.data.name;
      this.setState({
        categoryName: categoryName
      });
    }
  };
  async componentDidMount() {
    const products = JSON.parse(sessionStorage.getItem("detail_item"));
    this.setState({
      products: products
    });
    if (!products) {
      return <Redirect to="/home/products/products" />;
    }

    if (products._id) {
      // 如果商品有数据, 获取对应的分类
      this.getCategory(products.categoryId);
    } else {
      // 如果当前product状态没有数据, 根据id参数中请求获取商品并更新
      const id = this.props.match.params.id;
      const result = await reqProduct(id);
      if (result.status === 0) {
        this.products = result.data;
        this.setState({
          products
        });
        this.getCategory(products.categoryId); // 获取对应的分类
      }
    }
  }
  render() {
    const { products } = this.state;
    const title = (
      <span>
        <LinkButton
          onClick={() => {
            this.props.history.goBack();
          }}
        >
          <LeftOutlined />
        </LinkButton>
        <span>商品详情</span>
      </span>
    );
    return (
      <div>
        <Card title={title} className={detailStyle["detail"]}>
          <List>
            <Item className={detailStyle["list-item"]}>
              <span className={detailStyle["detail-left"]}>商品名称：</span>
              <span>{products.name}</span>
            </Item>
            <Item className={detailStyle["list-item"]}>
              <span className={detailStyle["detail-left"]}>商品描述：</span>
              <span>{products.desc}</span>
            </Item>
            <Item className={detailStyle["list-item"]}>
              <span className={detailStyle["detail-left"]}>商品价格：</span>
              <span>{products.price}元</span>
            </Item>
            <Item className={detailStyle["list-item"]}>
              <span className={detailStyle["detail-left"]}>所属分类：</span>
              <span>{this.state.categoryName}</span>
            </Item>
            <Item className={detailStyle["list-item"]}>
              <span className={detailStyle["detail-left"]}>商品图片：</span>
              <span>
                {products.imgs &&
                  products.imgs.map((item, key) => (
                    <img
                      className={detailStyle["imgStyle"]}
                      key={key}
                      src={"http://120.55.193.14:5000/upload/" + item}
                      alt="img"
                    />
                  ))}
              </span>
            </Item>
            <Item className={detailStyle["list-item"]}>
              <span className={detailStyle["detail-left"]}>商品详情：</span>
              <div dangerouslySetInnerHTML={{ __html: products.detail }} />
            </Item>
          </List>
        </Card>
      </div>
    );
  }
}
