import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'
import axios from "axios"
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
    this.state = {currentCategory: -1};

  }

  componentDidMount(){
    // var config = {
    //   headers: {'Content-Type': 'application/json'}
    // };
    // axios.get("https://today.line.me/tw/portaljson", config)
    // .then(function(response) {
    //   this.raw = response.data;
    //   this.categoryList = this.raw.result.categoryList;
    //   this.setState({currentCategory: this.categoryList[0].id});
    // });

    fetch('https://today.line.me/tw/portaljson', {mode: 'no-cors'})
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          console.log(data);
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
  
    this.raw = data;
    this.categoryList = this.raw.result.categoryList;
    this.categories = this.raw.result.categories;
    this.setState({currentCategory: this.categoryList[0].id});

  }

  render(){
    return(
      <div>
        <Header categoryList = {this.categoryList}/>
        <Route exact path="/" render={props=><Headline {...props} category={this.categories[0]} />} />
        <Route path="/category/:id" render={props=><Category {...props} />} />
      </div>

    );
  }
}
