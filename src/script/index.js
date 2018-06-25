import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from 'react-router-dom'

import Main from "./components/main"
import "../style/reset.css"
import "../style/global.scss"

const app = document.getElementById('app')

ReactDOM.render(
  <BrowserRouter>
	   <Main />
  </BrowserRouter>
 , app);