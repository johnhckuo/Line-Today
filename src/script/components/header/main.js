import React from "react"
import { Link } from 'react-router-dom'

export default class Header extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    var {categoryList} = this.props;
    return (
        <header className = "header__container">
          {
            categoryList.map((category, key)=>{
              var id = category.id;
              if (key == 0){
                id = "";
              }

              return <Link key={key} to={`/category/${id}`}><span className="link">{category.name}</span></Link>
            })
          }
        </header>
    );
  }
}
