import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { IdleTimerContainer } from "./components/idleTimer/IdleTimerContainer";

import Login from "./pages/auth/Login";
// import Reset from "./pages/auth/Reset";
import Master from "./pages/master/Index";
import FourOFour from "./pages/fourOfour/Index";

import ScrollToTop from "./components/scrollToTop/Index";
import PrivateRoute from "./components/privateRoute/Index";

function App() {
  return (
    <div className="App">
      <IdleTimerContainer>
        <Router>
          <ScrollToTop>
            <Switch>
                <Route exact path="/login" component={Login} />
              {/* <Route exact path="/reset" component={Reset} /> */}

              {/* <PrivateRoute path="/dashboard" role={"Super admin" || "Content Officer"}> */}
              <Route path="/">
                <Master />
              </Route>

              {/*   <Route path="/dashboard">
                <Master />
              </Route> */}
              <Route path="*" component={FourOFour} />
            </Switch>
          </ScrollToTop>
        </Router>
      </IdleTimerContainer>
    </div>
  );
}

export default App;
