import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { hot } from "react-hot-loader/root"

import QuotesList from "./QuotesList"
import QuoteForm from "./QuoteForm"
import QuoteShow from "./QuoteShow"

import "../assets/main.css"

const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/quotes" component={QuotesList} />
        <Route exact path="/quotes/new" component={QuoteForm} />
        <Route exact path="/quotes/:id" component={QuoteShow} />
      </Switch>
    </BrowserRouter>
  )
}

export default hot(App)
