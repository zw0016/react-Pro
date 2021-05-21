import React from "react";
import ButtonStyle from "./index.module.scss";
export default function LinkButton(props) {
  //注意 ：children 标签属性
  //字符串 LinkButton
  // 标签对象  LinkButton>span
  // 标签对象数组 LinkButton>span span
  //取出对象所有属性
  return <button className={ButtonStyle["link-button"]} {...props} />;
}
