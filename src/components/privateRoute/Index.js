import React from "react";
import { checkIfLoggedIn } from "../../utils/Authenticate";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ props, children, ...rest }) => {
  // const loggedIn = checkIfLoggedIn()
  const loggedIn = true;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              from: location,
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
