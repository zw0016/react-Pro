import React, { Component } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
//antd 4.0 版本icons 需要单独引入
import { PlusOutlined } from "@ant-design/icons";
import LinkButton from "../../compoents/link-button";
import {
  reqProducts,
  reqSearchProducts,
  reqUpdateStatus
} from "../../api/index";
import { connect } from "react-redux";
const { Option } = Select;
//query参数 ?user=xx&mag=xx
//params 参数  :user/:msg 只能拼在路径
class Product extends Component {
  state = {
    loading: false,
    total: 0, //一共多少数据总量
    //商品列表
    products: [],
    searchType: "productName", //默认商品名称搜索
    searchName: "" //搜索关键字
  };
  //列表描述
  initColum = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name"
      },
      {
        title: "商品描述",
        dataIndex: "desc"
      },
      {
        title: "价格",
        dataIndex: "price",
        render: price => "¥" + price
      },
      {
        title: "状态",
        dataIndex: "status",
        width: 80,
        render: (status, _id) => {
          let btnText = "下架";
          let text = "在售";
          if (status === 2) {
            text = "下架";
            btnText = "在售";
          }
          return (
            <span>
              <button onClick={() => this.updateStatus(_id, status)}>
                {btnText}
              </button>
              <span>{text}</span>
            </span>
          );
        }
      },
      {
        title: "操作",
        render: products => (
          <span>
            <LinkButton
              onClick={() => {
                //loaction 存储传递那个元素
                sessionStorage.setItem("detail_item", JSON.stringify(products));
                this.props.saveDetail(products);
                this.props.history.push(
                  "/home/products/products/detail/" + products._id
                );
              }}
            >
              详情
            </LinkButton>
            <LinkButton
              onClick={() => {
                this.props.saveDetail(products);
                this.props.history.push("/home/products/products/addupdate");
              }}
            >
              修改
            </LinkButton>
          </span>
        )
      }
    ];
  };
  //页面将要挂载是渲染table 列表
  componentWillMount() {
    //
    this.initColum();
  }

  //发送请求
  getProducts = async pageNum => {
    // 保存当前请求的页码
    this.pageNum = pageNum;
    const { searchName, searchType } = this.state;
    let result;
    //判断是否是搜索分页
    if (!this.isSearch) {
      result = await reqProducts(pageNum, 4);
    } else {
      console.log(searchName, searchType);
      result = await reqSearchProducts({
        pageNum,
        pageSize: 5,
        searchName,
        searchType
      });
    }

    if (result.status === 0) {
      const { total, list } = result.data;
      this.setState({
        products: list,
        total: total
      });
    }
  };
  //跟新状态
  updateStatus = async (_id, status) => {
    // 计算更新后的值
    status = status === 1 ? 2 : 1;
    const result = await reqUpdateStatus(_id, status);
    if (result.status === 0) {
      message.success("更新商品状态成功!");
      // 获取当前页显示
      this.getProducts(this.pageNum);
    }
  };

  componentDidMount() {
    this.getProducts(1);
    // console.log(this.props.match.params.id )
  }
  render() {
    const { loading, products } = this.state;
    //左侧 内容为标签
    const title = (
      <span>
        {/* 受控组件 */}
        <Select
          style={{ width: 200 }}
          value={this.state.searchType}
          onChange={value => {
            this.setState({
              searchType: value
            });
          }}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          style={{ width: 200, margin: "0 10px" }}
          placeholder="关键字"
          value={this.state.searchName}
          onChange={e => {
            this.setState({
              searchName: e.target.value
            });
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            this.isSearch = true; // 保存搜索的标记
            this.getProducts(1);
          }}
        >
          搜索
        </Button>
      </span>
    );
    //右侧
    const extra = (
      <Button
        type="primary"
        onClick={() => {
          this.props.saveDetail({});
          this.props.history.push("/home/products/products/addupdate");
        }}
      >
        <PlusOutlined />
        添加商品
      </Button>
    );
    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            bordered={true}
            rowKey="_id"
            loading={loading}
            //compoentWillMount时触发
            columns={this.columns}
            //资源
            dataSource={products}
            pagination={{
              total: this.state.total,
              defaultPageSize: 4,
              showQuickJumper: true,
              //页面发生改变是调用
              onChange: this.getProducts
            }}
          />
        </Card>
      </div>
    );
  }
}
const mapDispatchToprops = dispatch => {
  return {
    saveDetail: detailInfo => {
      //传递action 对象 定义一个type属性
      dispatch({
        type: "SAVE_DETAIL",
        detailInfo: detailInfo
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
)(Product);
