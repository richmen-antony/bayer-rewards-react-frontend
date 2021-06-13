import React from "react";
import { Route, Redirect } from "react-router-dom";
import { setTitle, setMetaDescription } from "./routes";
import Authorization from "../utility/authorization";
import {accessDeniedToaster} from "../utility/helper";

/**
 * If we have a logged-in user, display the component, otherwise redirect to login page.
 */
const PrivateRoute = ({ component: Component, meta, role, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) => {
        setTitle(meta && meta.title ? meta.title : "");
        setMetaDescription(meta && meta.description ? meta.description : "");
        if (Authorization.isLoggedIn()) {
          if (
            Authorization.isRSMAdmin() &&
            (role === "public" || role === "RSM")
          ) {
            return <Component {...props} />;
          } else if (
            Authorization.isAdmin() &&
            (role === "public" ||  role === "ADMIN")
          ) {
            return <Component {...props} />;
          } else if (
            Authorization.isDEVAdmin() &&
            (role === "public" ||  role === "DEVADMIN")
          ) {
            return <Component {...props} />;
          } else {
            setTimeout(() => {
              accessDeniedToaster();
            }, 100);
            
            return <Redirect to={{ pathname: "/dashboard" }} />;
          }
        } else {
          return <Redirect to={{ pathname: "/landing" }} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
