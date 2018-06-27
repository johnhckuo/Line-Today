import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from 'react-router-dom'

import Main from "./components/main"
import "../style/main.scss"

const app = document.getElementById('app')

ReactDOM.render(
  <BrowserRouter>
	   <Main />
  </BrowserRouter>
 , app);
