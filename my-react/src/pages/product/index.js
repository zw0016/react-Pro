import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Category from "../product/productCate";
import ProductHome from "./productHome";
export default class ProductsRouter extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/home/products/Category" component={Category}></Route>
          <Route path="/home/products/products" component={ProductHome}></Route>
        </Switch>
      </div>
    );
  }
}
