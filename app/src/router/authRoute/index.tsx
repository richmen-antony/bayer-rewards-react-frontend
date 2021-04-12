import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import propTypes from "prop-types";
import Cookies from 'js-cookie';

export function AuthRoute({ component: Component }:any) {
  // const isLoggedIn = localStorage.getItem('userData');
  const isLoggedIn = Cookies.get('userData');
  console.log(isLoggedIn, 'isloggedd');
  return (
    <Route path={'/'}
      render={() => (isLoggedIn ? <Component />
        : <Redirect to={`/landing`} />)}
    />
  );
}

AuthRoute.propTypes = {
  component: propTypes.any,
  isLoggedIn: propTypes.any,
  isLoading: propTypes.any
};
