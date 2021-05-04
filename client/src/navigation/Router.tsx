import { BrowserRouter, Route, Switch } from "react-router-dom";

import React from "react";
import Start from "../components/Start";
import Shell from "../components/Shell";

function Router() {
  return (
    <BrowserRouter>
      <Shell>
        <Switch>
          <Route path="/" exact component={Start} />
        </Switch>
      </Shell>
    </BrowserRouter>
  );
}

export default Router;
