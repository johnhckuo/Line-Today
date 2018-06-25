import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'

import Header from "./header/main"
import Headline from "./headline/main"
import Category from "./category/main"

export default class Main extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <Header />
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
