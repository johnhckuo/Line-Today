import React from "react"
import { Link } from 'react-router-dom'
import mainimg from '../../../images/mainimg.png'
import styleVar from '../../../style/utilities/variables.scss'

export default class Header extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    const {categoryList, windowWidth} = this.props;
    const {header_item_width, mobile_width} = styleVar;
    var maxItems = windowWidth / header_item_width;
    console.log(maxItems)
    return (
        <header className = "header__container">
          <h1>
            <a>
              <img src={mainimg} />
              <span className="hidden">Line Today</span>
            </a>
          </h1>
          <nav>
            <ul>
            {
              categoryList.map((category, key)=>{
                var id = category.id;
                if (key == 0){
                  id = "";
                }

                return <li className="link"><Link key={key} to={`/category/${id}`}>{category.name}</Link></li>
              })
            }
            </ul>
          </nav>
        </header>
    );
  }
}
