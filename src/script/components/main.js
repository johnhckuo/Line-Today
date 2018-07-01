import React from "react"
import { Route, Redirect, Switch } from 'react-router-dom'
import Header from "./header"
import Headline from "./headline"
import Category from "./category"
import styleVar from '../../style/utilities/variables.scss'

import data from "../data"

export default class Main extends React.Component{

  constructor(props){
    super(props);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateCurrentCategory = this.updateCurrentCategory.bind(this);

    this.DataSource = "https://today.line.me/tw/portaljson";
    this.categoryList = [];
    this.categories = [];
    this.imageURL = {
      imagePrefix: "https://obs.line-scdn.net/",
      imagePostfix: "/w1200"
    }

    this.state = {
      currentCategory: -1,
      windowWidth: 0,
      currentCategory: 0,
      device: "pc"
    };

  }

  componentDidMount(){
    this.categoryList = data.result.categoryList;
    this.categories = data.result.categories;
    this.setState({currentCategory: 0});
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    let device;
    if (window.innerWidth <= styleVar.phone_width.split("px")[0]){
      device = "phone";
    }else if (window.innerWidth <= styleVar.pad_width.split("px")[0]){
      device = "tablet";
    }else{
      device = "pc";
    }
    this.setState({ windowWidth: window.innerWidth, device })
  }

  updateCurrentCategory(newCategory){
    this.setState({currentCategory: newCategory})
  }

  render(){
    return(
      <React.Fragment>
        <Header categoryList = {this.categoryList}
          windowWidth = {this.state.windowWidth}
          currentCategory = {this.state.currentCategory}
          updateCurrentCategory = {this.updateCurrentCategory}
          device = {this.state.device}
        />
        <Switch>
          <Route exact path="/(|headline)/" render={props=>
            <Headline
              {...props}
              categoryList = {this.categoryList}
              categories={this.categories}
              windowWidth = {this.state.windowWidth}
              imageURL={this.imageURL}
              currentCategory = {this.state.currentCategory}
              updateCurrentCategory = {this.updateCurrentCategory}
              device = {this.state.device}
            />
          } />
          <Route exact path="/:id" render={props=>
            <Category
              {...props}
              categoryList = {this.categoryList}
              categories={this.categories}
              windowWidth = {this.state.windowWidth}
              imageURL={this.imageURL}
              currentCategory = {this.state.currentCategory}
              device = {this.state.device}
            />
          }/>
        </Switch>
      </React.Fragment>

    );
  }
}
