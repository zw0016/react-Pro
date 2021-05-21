import React, { Component } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reqDeleteImg } from "../../api/index";
import PropTypes from "prop-types";
//获取上传地址的端口号
import { BASE_IMG } from "../../utils/uploadUtils";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  componentDidMount() {
    //获取传过来哦的imgs
    const imgs = this.props.imgs;
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map((img, index) => ({
        uid: -index, // 唯一标识
        name: img, // 文件名
        status: "done", // 状态有：uploading done error removed
        url: BASE_IMG + img
      }));
      this.setState({ fileList });
    }
  }
  static propTypes = {
    //可能有可能没有
    imgs: PropTypes.array
  };
  state = {
    previewVisible: false, //是否现实大图
    previewImage: "", // 大图的url或者base64值
    previewTitle: "",
    fileList: [
      //   {//图片信息
      //     uid: '-1',//唯一标示
      //     name: 'image.png',//文件名
      //     status: 'done',//文件状态
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   },
      //   {
      //     uid: '-2',
      //     name: 'image.png',
      //     status: 'done',
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   },
    ]
  };
  //获取上产所有文件名的数组
  getImgs = () => this.state.fileList.map(file => file.name);
  //取消预览大图
  handleCancel = () => this.setState({ previewVisible: false });
  /* 
  进行大图预览的回调函数
  file: 当前选择的图片对应的file
  */
  handlePreview = async file => {
    //如果地址不存在进行base64编码
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    });
  };
  /* 
  在file的状态发生改变的监听回调
  file: 当前操作(上传/删除)的file
  fiellist 遍历操作会反复执行
  */
  handleChange = async ({ file, fileList }) => {
    //如果上传成功
    if (file.status === "done") {
      // 将数组最后一个file保存到file变量
      // file与fileList中最后一个file代表同个图片的不同对象
      // 将数组最后一个file保存到file变量
      file = fileList[fileList.length - 1];
      // 取出响应数据中的图片文件名和url
      const { name, url } = file.response.data;
      //上传file对象
      file.name = name;
      file.url = url;
      console.log(file);
    } else if (file.status === "removed") {
      // 删除
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("删除图片成功");
      } else {
        message.error("删除图片失败");
      }
    }
    //更新状态
    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action="/manage/img/upload" //上传图片的url
          name="image" // 图片文件对应参数名
          listType="picture-card" //显示风格
          fileList={fileList} //以上传文件列表
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        {/* 大图显示 */}
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
