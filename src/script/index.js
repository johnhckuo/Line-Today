import React from "react"
import ReactDOM from "react-dom"
import { HashRouter } from 'react-router-dom'
import "../style/main.scss"
import Main from "./components/main"

const app = document.getElementById('app')

ReactDOM.render(
  <HashRouter>
	   <Main />
  </HashRouter>
 , app);
