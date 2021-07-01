import React from "react"
import { Route, Switch, BrowserRouter } from "react-router-dom"
import { hot } from "react-hot-loader/root"

import MoviesIndex from "./MoviesIndex"
import MovieShow from "./MovieShow"

const App = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/movies" component={MoviesIndex} />
        <Route exact path="/movies/:id" component={MovieShow} />
      </Switch>
    </BrowserRouter>
  )
}

export default hot(App)
