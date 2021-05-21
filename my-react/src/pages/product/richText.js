import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
//使用lodash 库中的防抖
import _ from "lodash";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PropTypes from "prop-types";
import { BASE_img } from "../../utils/uploadUtils";
class RichText extends Component {
  static propTypes = {
    detail: PropTypes.string
  };
  state = {
    editorState: EditorState.createEmpty()
  };
  componentWillReceiveProps() {
    const detail = this.props.detail;
    //如果存在
    if (detail) {
      // 根据detail生成一个editorState
      const contentBlock = htmlToDraft(detail);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState
      });
    }
  }
  //上传图片

  uploadImageCallBack = file => {
    return new Promise((resolve, reject) => {
      // 执行器函数
      const xhr = new XMLHttpRequest();
      //'/manage/img/upload'
      xhr.open("POST", "/manage/img/upload");
      xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText); // {status:0, data: {name: '', url: '....'}}

        const url = BASE_img.concat(
          response.data.url.substring(response.data.url.indexOf("upload"))
        );
        delete response.data.url;
        response.data.link = url;
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  //编辑器状态发生该改变 使用防抖函数
  onEditorStateChange = _.debounce(editorState => {
    console.log("----");
    this.setState({
      editorState
    });
  }, 500);
  //暴露数据
  getDetail = () =>
    draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{
            height: 200,
            border: "1px solid black",
            paddingLeft: 10
          }}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              uploadCallback: this.uploadImageCallBack,
              alt: { present: true, mandatory: true }
            }
          }}
        />
      </div>
    );
  }
}

export default RichText;
