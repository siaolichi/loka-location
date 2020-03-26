import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./routing/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/layout/Dashboard";
import Map from "./components/layout/Map";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";

import "./style/App.scss";
import "@material/react-button/dist/button.css";
import "@material/react-dialog/dist/dialog.css";
import "@material/react-list/dist/list.css";
import "@material/react-checkbox/dist/checkbox.css";
import "@material/react-card/dist/card.css";
import "@material/react-select/dist/select.css";

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <div className="container">
            <div className="dark-overlay" />
            <Navbar />
            <Alert />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route
                exact
                path="/map"
                component={() => (
                  <Map
                    profile={{
                      loading: false,
                      profile: null
                    }}
                  />
                )}
              />
              <Route
                exact
                path="/map/:groupId"
                component={({ match, location }) => {
                  // console.log(match, location);
                  return (
                    <Map
                      profile={{
                        loading: false,
                        profile: null
                      }}
                      match={match}
                    />
                  );
                }}
              />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
