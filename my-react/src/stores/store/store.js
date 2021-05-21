//Redux的组成

//state 储存状态数据
//1:存储服务端的数据 user信息等
//2 ui 组建状态的控制
//3 页面组件内交互数据的使用

//action
//store.dispatch 将action 传递给store

//reducer
//本质就是一个函数 接受返回的action 并进行处理 返回新的state 给store
//接受两个参数 state 之前的state
//action return 出新的对象

//store 将action 和reducer 联系到一起
// 是维持应用的state
//dispatch 分发action
//getState 获取state
//subscribe 注册或撤销监听
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducer from "../reducer/index";

export const store = createStore(
  reducer,
  compose(
    applyMiddleware(...[thunk]) // 需要使用的中间件数组
  )
);
