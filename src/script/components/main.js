import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'
import Header from "./header/main"
import Headline from "./headline/main"
import Category from "./category/main"

import data from "../data"

export default class Main extends React.Component{

  constructor(props){
    super(props);
    this.DataSource = "https://today.line.me/tw/portaljson";
    this.raw = null;
    this.categoryList = [];
    this.categories = [];
    this.state = {currentCategory: -1, windowWidth: 0};
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount(){

    this.raw = data;
    this.categoryList = this.raw.result.categoryList;
    this.categories = this.raw.result.categories;

    this.setState({currentCategory: this.categoryList[0].id});
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
  }

  componentWillUnmount(){
    this.setState({
      init:false
    })
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth })
  }

  render(){
    return(
      <div>
        <Header categoryList = {this.categoryList} windowWidth = {this.state.windowWidth}/>
        <Route exact path="/" render={props=><Headline {...props} category={this.categories[0]} windowWidth = {this.state.windowWidth} />} />
        <Route path="/category/:id" render={props=><Category {...props} />} />
      </div>

    );
  }
}
