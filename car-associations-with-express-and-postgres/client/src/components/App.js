import React from "react"
import { BrowserRouter, Route } from "react-router-dom"
import { hot } from "react-hot-loader/root"

import CarMakeShow from "./CarMakeShow"

import "../assets/main.css";

const App = props => {
  return(
    <BrowserRouter>
      <Route exact path="/car-makes/:id" component={CarMakeShow} />
    </BrowserRouter>
  )
}

export default hot(App)
