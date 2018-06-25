import React from "react"
import { Link } from 'react-router-dom'

import * as Style from "./style"

export default class Header extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return (
        <Style.Container>
          <Link to="/"><Style.Link>Headline</Style.Link></Link>
          <Link to="/category"><Style.Link>Category</Style.Link></Link>
        </Style.Container>
    );
  }
}
