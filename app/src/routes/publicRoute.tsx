import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authorization from '../utility/authorization';
/**
 * If we have a logged-in user, redirect to the home page. Otherwise, display the component.
 */
const PublicRoute = ({ component: Component, ...rest }:any) => {
  return (
    <Route
      {...rest}
      render={(props:any) => {
        if (Authorization.isLoggedIn()) {
          return <Redirect to={{ pathname: '/dashboard' }} />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PublicRoute;
