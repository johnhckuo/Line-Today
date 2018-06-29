import React from "react"

export default class Category extends React.Component{

  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log(this.props.location.pathname)
  }

  render(){
    return (
        <div>
          Category
        </div>
    );
  }
}
