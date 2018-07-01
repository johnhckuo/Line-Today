import React from "react"
import { Link } from 'react-router-dom'
import styleVar from '../../style/utilities/variables.scss'

export default class Header extends React.Component{

  constructor(props){
    super(props);
    this.generateNavList = this.generateNavList.bind(this);
    this.generateMoreList = this.generateMoreList.bind(this);
  }

  generateNavList(maxItems){
    let list = [];
    let categoryList = this.props.categoryList;
    for (let i = 0 ; i < categoryList.length ; i++){
      if (i >= maxItems){
        break;
      }
      list.push(<li key={i} className="header__visible-link"><Link onClick={this.props.updateCurrentCategory.bind(this, i)} className={i == this.props.currentCategory ? "currentCategory" : ""} key={i} to={`/${i==0 ? "headline" : categoryList[i].id}`}>{categoryList[i].name}</Link></li>);
    }

    return list;
  }

  generateMoreList(startIndex){
    let list = [];
    let categoryList = this.props.categoryList;
    for (let j = startIndex ; j < categoryList.length ; j++){
      list.push(<li key={j}><Link className={j == this.props.currentCategory ? "currentCategory" : ""} onClick={this.props.updateCurrentCategory.bind(this, j)} key={j} to={`/${categoryList[j].id}`}>{categoryList[j].name}</Link></li>);
    }
    return list;
  }

  render(){
    const {windowWidth, device} = this.props;
    const header_item_width = parseInt(styleVar.header_item_width);

    let maxItems;
    if (device == "tablet" || device == "phone"){
      maxItems = windowWidth;
    }else{
      maxItems = parseInt(windowWidth / 3);
      maxItems = parseInt(maxItems / (header_item_width + 16*2))
    }
    let navList = this.generateNavList(maxItems);
    let moreList = this.generateMoreList(navList.length);

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
