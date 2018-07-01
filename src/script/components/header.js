import React from "react"
import { Link } from 'react-router-dom'
import styleVar from '../../style/utilities/variables.scss'

export default class Header extends React.Component{

  constructor(props){
    super(props);
    this.generateNavList = this.generateNavList.bind(this);
    this.generateMoreList = this.generateMoreList.bind(this);
  }

  generateNavList(categoryList, maxItems, currentCategory){

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
      var currentCategoryStyle = "";
      if (i == currentCategory){
        currentCategoryStyle = "currentCategory";
      }
      navList.push(<li key={i} className="header__visible-link"><Link onClick={this.props.updateCurrentCategory.bind(this, i)} className={currentCategoryStyle} key={i} to={`/${id}`}>{category.name}</Link></li>);
    }

    return navList;
  }

  generateMoreList(categoryList, startIndex, currentCategory){
    //remain categories
    var moreList = [];
    for (var j = startIndex ; j < categoryList.length ; j++){
      var category = categoryList[j]
      var id = category.id;

      var currentCategoryStyle = "";
      if (j == currentCategory){
        currentCategoryStyle = "currentCategory";
      }

      moreList.push(<li key={j}><Link className={currentCategoryStyle} onClick={this.props.updateCurrentCategory.bind(this, j)} key={j} to={`/${id}`}>{category.name}</Link></li>);
    }
    return moreList;
  }

  render(){
    const {categoryList, windowWidth, currentCategory, device} = this.props;
    const header_item_width = parseInt(styleVar.header_item_width);
    
    var maxItems;
    if (device == "tablet" || device == "phone"){
      maxItems = windowWidth;
    }else{
      maxItems = parseInt(windowWidth / 3);
      maxItems = parseInt(maxItems / (header_item_width + 16*2))
    }
    var navList = this.generateNavList(categoryList, maxItems, currentCategory);
    var moreList = this.generateMoreList(categoryList, navList.length, currentCategory);

    return (
        <header className = "header">
          <nav>
            <ul className="header__visible-list">
              <li><h1><Link to='/' onClick={this.props.updateCurrentCategory.bind(this, 0)}>Line Today</Link></h1></li>
              {navList}
              <li className="header__visible-link header__more">
                <Link to='#' className="global__disable_links">更多<span className="header__icon-more"></span></Link>
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
