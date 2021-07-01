import React from "react"
import { hot } from "react-hot-loader/root"
import { BrowserRouter, Route } from "react-router-dom"

import "../assets/main.css"

import ConcertVenuesList from "./ConcertVenuesList"
import NewConcertVenueForm from "./NewConcertVenueForm"

const App = props => {
  return (
    <div className="grid-container">
      <BrowserRouter>
        <Route exact path="/" component={ConcertVenuesList} />
        <Route exact path="/concert-venues/new" component={NewConcertVenueForm} />
      </BrowserRouter>
    </div>
  )
}

export default hot(App)
