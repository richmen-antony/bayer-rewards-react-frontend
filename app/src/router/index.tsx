import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import  Loader from '../utility/widgets/loader';

const Components = lazy(() => import("../boostrap"));

function Router() {
  return (
    <Suspense fallback={ <Loader />}>
      <Switch>
        <Route path="/" render={() => <Components />} />
      </Switch>
    </Suspense>
  );
}

export { Router };
