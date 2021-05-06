import { BrowserRouter, Route, Switch } from "react-router-dom";

import React from "react";
import Start from "../components/Start";
import Shell from "../components/Shell";
import Lobby from "./Lobby";
import CreateRoom from "./CreateRoom";
import ChatRoom from "./ChatRoom";

function Router() {
  return (
    <BrowserRouter>
      <Shell>
        <Switch>
          <Route path="/" exact component={Start} />
          <Route path="/lobby" component={Lobby} />
          <Route path="/create-room" component={CreateRoom} />
          <Route path="/chat-room/:name" component={ChatRoom} />
        </Switch>
      </Shell>
    </BrowserRouter>
  );
}

export default Router;
