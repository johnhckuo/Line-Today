import React from "react"
import { Route, Redirect, Switch } from 'react-router-dom'
import Header from "./header"
import Headline from "./headline"
import Category from "./category"

import data from "../data"

export default class Main extends React.Component{

  constructor(props){
    super(props);
    this.DataSource = "https://today.line.me/tw/portaljson";
    this.categoryList = [];
    this.categories = [];
    this.imageURL = {
      imagePrefix: "https://obs.line-scdn.net/",
      imagePostfix: "/w1200"
    }
    this.state = {currentCategory: -1, windowWidth: 0, currentCategory: 0};
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateCurrentCategory = this.updateCurrentCategory.bind(this);
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
    this.setState({ windowWidth: window.innerWidth })
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
            />
          } />
          <Route exact path="/:id" render={props=>
            <Category 
              {...props} 
              categoryList = {this.categoryList} 
              categories={this.categories} 
              imageURL={this.imageURL}
              currentCategory = {this.state.currentCategory}
            />
          }/>
        </Switch>
      </React.Fragment>

    );
  }
}
