import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'
import axios from "axios"
import Header from "./header/main"
import Headline from "./headline/main"
import Category from "./category/main"

export default class Main extends React.Component{

  constructor(props){
    super(props);
    this.DataSource = "https://today.line.me/tw/portaljson";
    this.raw = null;
    this.categoryList = [];
    this.state = {currentCategory: -1};

  }

  componentDidMount(){
    var config = {
      headers: {'Content-Type': 'application/json'}
    };
    axios.get("https://today.line.me/tw/portaljson", config)
    .then(function(response) {
      this.raw = response.data;
      this.categoryList = this.raw.result.categoryList;
      this.setState({currentCategory: this.categoryList[0].id});
    });

  }

  render(){
    return(
      <div>
        <Header categoryList = {this.categoryList}/>
        <Switch>
            <Route exact path="/" render={
              props=>
                <Headline {...props} />
              }
            />

            <Route exact path="/category" render={
              props=>
                <Category {...props} />
              }
            />
            <Route render={
              props=>
                <GenericNotFound {...props} />
              }
            />
        </Switch>
      </div>

    );
  }
}


const GenericNotFound = ()=>{
  alert("Page not found! Redirecting you to the main page...");
  return <Redirect to="/" />
}
