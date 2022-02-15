import React, { useEffect, useState } from "react";
import "./style.scss";
import jwtDecode from "jwt-decode";
import { Switch, Route } from "react-router-dom";
import { routes } from "../../routes/Index";

import Layout from "../../components/layout/Index";
import FourOFour from "../fourOfour/Index";

const Index = () => {
  const [permitted, setPermitted] = useState([]);
  console.log("🚀 ~ file: Index.js ~ line 12 ~ Index ~ permitted", permitted);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token || true) {
      //   const decode = jwtDecode(token);
      //   const permissions = decode.permissions || [];
      const permissions = [];

      // Filter permitted routes from given permissions
      if (routes && routes.length) {
        const isAll = permissions.find((item) => item === "all") || true;

        if (isAll) {
          console.log(
            "🚀 ~ file: Index.js ~ line 25 ~ useEffect ~ isAll",
            isAll
          );
          return setPermitted(routes);
        } else {
          const permittedRoutes = routes.filter(({ name: routeName }) =>
            permissions.some((x) => x === routeName)
          );
          setPermitted(permittedRoutes);
        }
      }
    }
  }, []);

  return (
    <div className="master">
      <Layout routes={permitted} />
      <div className="main">
        <Switch>
          {permitted &&
            permitted.map((item, i) =>
              item.name && item.path ? (
                <Route
                  key={i}
                  exact={item.exact}
                  path={item.path}
                  component={item.component}
                />
              ) : item.child && item.child.length ? (
                item.child.map((child, j) =>
                  child.path ? (
                    <Route
                      key={j}
                      exact={child.exact}
                      path={child.path}
                      component={child.component}
                    />
                  ) : child.child && child.child.length ? (
                    child.child.map((leaf, k) => (
                      <Route
                        key={k}
                        exact={leaf.exact}
                        path={leaf.path}
                        component={leaf.component}
                      />
                    ))
                  ) : null
                )
              ) : null
            )}

          {/* {permitted && permitted.map((item, i) =>
                        item.name && item.path ?
                            <Route
                                key={i}
                                exact={item.exact}
                                path={item.path}
                                component={item.component}
                            />
                            : item.child && item.child.length ? item.child.map((child, j) =>
                                <Route
                                    key={j}
                                    exact={child.exact}
                                    path={child.path}
                                    component={child.component}
                                />
                            ) : null)
                    } */}

          <Route path="*" component={FourOFour} />
        </Switch>
      </div>
    </div>
  );
};

export default Index;
