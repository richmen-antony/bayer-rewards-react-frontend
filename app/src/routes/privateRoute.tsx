import React from "react";
import { Route, Redirect } from "react-router-dom";
import { setTitle, setMetaDescription } from "./routes";
import Authorization from "../utility/authorization";
import {accessDeniedToaster} from "../utility/helper";
import {RSM_ROLE,ADMIN_ROLE,DEVADMIN_ROLE,PUBLIC_ROLE,RSM_ADMIN_ROLE} from "../utility/constant";

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
            (role === PUBLIC_ROLE || role === RSM_ROLE || role===RSM_ADMIN_ROLE)
          ) {
            return <Component {...props} />;
          } else if (
            Authorization.isAdmin() &&
            (role === PUBLIC_ROLE ||  role === ADMIN_ROLE||role===RSM_ADMIN_ROLE)
          ) {
            return <Component {...props} />;
          } else if (
            Authorization.isDEVAdmin() &&
            (role === PUBLIC_ROLE ||  role === DEVADMIN_ROLE)
          ) {
            return <Component {...props} />;
          } else {
            setTimeout(() => {
              accessDeniedToaster();
            }, 100);
            // let pathName= Authorization.isDEVAdmin() ? "devconfig"  :"dashboard";'
            return <Redirect to={{ pathname: `/${"dashboard"}` }} />;
          }
        } else {
          return <Redirect to={{ pathname: "/landing" }} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
