import React from "react"
import { Link } from 'react-router-dom'
import styleVar from '../../style/utilities/variables.scss'


export default class Header extends React.Component{

  constructor(props){
    super(props);
    this.generateNavList = this.generateNavList.bind(this);
    this.generateMoreList = this.generateMoreList.bind(this);
  }

  generateNavList(categoryList, maxItems){

    var navList = [];

    //visible categories
    for (var i = 0 ; i < categoryList.length ; i++){
      var category = categoryList[i]
      var id = category.id;
      if (i >= maxItems){
        break;
      }
      if (i == 0){
        id = "headline";
      }
      navList.push(<li key={i} className="header__visible-link"><Link key={i} to={`/${id}`}>{category.name}</Link></li>);
    }

    return navList;
  }

  generateMoreList(categoryList, startIndex){
    //remain categories
    var moreList = [];
    for (var j = startIndex ; j < categoryList.length ; j++){
      var category = categoryList[j]
      var id = category.id;
      moreList.push(<li key={j}><Link key={j} to={`/${id}`}>{category.name}</Link></li>);
    }
    return moreList;
  }

  render(){
    const {categoryList, windowWidth} = this.props;
    const header_item_width = parseInt(styleVar.header_item_width);
    var maxItems = parseInt(windowWidth / 3);
    maxItems = parseInt(maxItems / (header_item_width + 16*2))
    var navList = this.generateNavList(categoryList, maxItems);
    var moreList = this.generateMoreList(categoryList, navList.length);

    return (
        <header className = "header">
          <nav>
            <ul className="header__visible-list">
              <li><h1><Link to='/'>Line Today</Link></h1></li>
              {navList}
              <li className="header__visible-link header__more">
                <Link to='#' className="disable_links">更多<span className="header__icon-more"></span></Link>
                <ul className="header__collapse-list">
                  {moreList}
                </ul>
              </li>
            </ul>
          </nav>
          <div className="header__login-button">
            <a href="#">登入</a>
          </div>
        </header>
    );
  }
}
