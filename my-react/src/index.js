import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import md5 from "js-md5";
//引入store
import { store } from "./stores/store/store";
//引入provider
import { Provider } from "react-redux";
React.Component.prototype.$md5 = md5;

ReactDOM.render(
  <Provider store={store}>
    {/* Provider 包裹根组件，值为store */}
    <App />
  </Provider>,
  document.getElementById("root")
);
