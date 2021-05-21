import React, { Component } from "react";
import { Space, Card, Table, Button, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import LinkButton from "../../compoents/link-button/index";
import {
  reqCategorys,
  reqAddCategory,
  reqUpdateCategory
} from "../../api/index";
import AddForm from "./categoryAdd";
import UpdateForm from "./categoryUpdate";
import { withRouter } from "react-router-dom";
class ProCategory extends Component {
  state = {
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    loading: false,
    parentId: "0", //当前需要显示的分类ID 默认为一级分类
    parentName: "", //当前需要显示的分类名称
    showStatus: 0 //0都不显示,1显示更新,2显示添加
  };
  //调用分类菜单
  getCategorys = async () => {
    this.setState({ loading: true });
    const { parentId } = this.state;
    const result = await reqCategorys(parentId);
    this.setState({ loading: false });
    if (result.status === 0) {
      //去除分类数组
      const categorys = result.data;
      if (parentId === "0") {
        this.setState({ categorys });
      } else {
        this.setState({ subCategorys: categorys });
      }
    } else {
      message.error("获取分类列表失败");
    }
  };
  //显示二级菜单
  /* 展现指定对象的子列表 */
  showSubCategory = category => {
    this.setState(
      {
        parentId: category._id,
        parentName: category.name
      },
      () => {
        //在状态更新后重新render后执行
        this.getCategorys();
      }
    );
  };
  //取消弹框
  handleCancel = () => {
    this.setState({ showStatus: 0 });
  };
  //新增分类
  addCategotry = async () => {
    this.setState({ showStatus: 0 });
    //一级分类
    const parentId = this.classes.props.value;
    //二级名称
    const categoryName = this.input.props.value;
    if (!categoryName) {
      message.error("名称不能为空!");
      return;
    }
    const result = await reqAddCategory(categoryName, parentId);
    console.log(result.data);
    if (result.status === 0) {
      //重新显示列表
      if (!parentId) {
        this.getCategorys(); //重新获取当前分类列表
        message.success("添加成功");
      }
    } else {
      message.error("添加失败");
    }
  };

  //修改后更新列表
  updateCategory = async () => {
    //
    this.setState({ showStatus: 0 });
    //发请求更新分类
    const categoryId = this.category._id;
    // console.log(categoryId)
    const categoryName = this.form.state.value;
    if (!categoryName) {
      message.error("名称不能为空!");
      return;
    }
    // console.log(categoryName);
    const result = await reqUpdateCategory(categoryId, categoryName);
    // console.log(result)
    if (result.status === 200) {
      //重新显示列表
      this.getCategorys();
      message.success("修改成功");
    } else {
      message.error("修改失败");
    }
  };
  //初始化表单
  initColumns = () => {
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "操作",
        width: 300,
        key: "action",
        dataIndex: "",
        render: category => (
          <span>
            <LinkButton
              onClick={() => {
                this.category = category;
                this.setState({ showStatus: 2 });
              }}
            >
              修改分类
            </LinkButton>{" "}
            {/* 如何向事件回调函数传递参数,定义一个回调函数 */}
            {this.state.parentId === "0" ? (
              <LinkButton
                onClick={() => {
                  this.showSubCategory(category);
                }}
              >
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        )
      }
    ];
  };
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getCategorys();
  }
  render() {
    const extra = (
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => {
          this.setState({ showStatus: 1 });
        }}
      >
        添加
      </Button>
    );
    const {
      parentId,
      categorys,
      subCategorys,
      parentName,
      showStatus
    } = this.state;

    const category = this.category || {}; // 如果还没有,则空对象
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <Space>
          <LinkButton
            onClick={() => {
              this.setState(
                {
                  parentId: "0",
                  parentName: "",
                  subCategorys: []
                },
                () => {
                  //在状态更新后重新render后执行
                  this.getCategorys();
                }
              );
            }}
          >
            一级分类列表
          </LinkButton>{" "}
          <ArrowRightOutlined /> {parentName}
        </Space>
      );

    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            rowKey="_id"
            pagination={
              {
                // , total: 50
              }
            }
            dataSource={parentId === "0" ? categorys : subCategorys}
            columns={this.columns}
            loading={this.state.loading}
          />
          <Modal
            title="添加分类"
            visible={showStatus === 1}
            onOk={this.addCategotry}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <AddForm
              categorys={categorys}
              categoryName
              setClasses={classes => {
                this.classes = classes;
              }}
              setInput={input => {
                this.input = input;
              }}
            />
          </Modal>
          <Modal
            title="修改分类"
            visible={showStatus === 2}
            onCancel={this.handleCancel}
            destroyOnClose={true} //让对话框关闭时候清空输入值
            onOk={this.updateCategory}
          >
            <UpdateForm
              category={category}
              setForm={form => {
                this.form = form;
              }}
            />
          </Modal>
        </Card>
      </div>
    );
  }
}

export default withRouter(ProCategory);
