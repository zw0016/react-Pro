import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Product from "./product";
import ProductAddUpdate from "./productAddUpdate";
import ProductDetail from "./productDetail";
/**
 * 商品管理
 */
export default class ProductHome extends Component {
  render() {
    return (
      <Switch>
        <Route path="/home/products/products" exact component={Product} />
        <Route
          path="/home/products/products/addupdate"
          component={ProductAddUpdate}
        />
        <Route
          path="/home/products/products/detail/:id"
          component={ProductDetail}
        />
        <Redirect to="/home/products/products" />
      </Switch>
    );
  }
}
