import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader/root";

import "../assets/main.css";
import AdventuresList from "./AdventuresList";
import AdventureShow from "./AdventureShow";
import NewAdventureForm from "./NewAdventureForm";
import LocationList from "./LocationList";
import LocationShow from "./LocationShow";

const App = props => {
  return (
    <div className="grid-container">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={AdventuresList} />
          <Route exact path="/adventures" component={AdventuresList} />
          <Route exact path="/adventures/new" component={NewAdventureForm} />
          <Route exact path="/adventures/:id" component={AdventureShow} />
          <Route exact path="/locations" component={LocationList} />
          <Route exact path="/locations/:locationId" component={LocationShow} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default hot(App);
