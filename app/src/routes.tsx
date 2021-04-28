
import React, {Component, lazy, Suspense } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import AUX from './hoc/Aux_';
import TopBar from './container/Layout/TopBar';
import SideBar from './container/Layout/SideBar';

const Dashboard = lazy(() =>
  import('./components/dashboard/index')
    .then(({ Dashboard }) => ({ default: Dashboard }))
);
const ScanLogs = lazy(() =>
  import('./components/scanLogs/index')
);

const Configurations = lazy(() =>
  import('./components/configurations/index')
    .then(({ Configurations }) => ({ default: Configurations }))
);

const CreateUser = lazy(() =>
  import('./components/users/createUser')
    .then(({ CreateUser }) => ({ default: CreateUser }))
);


const  UserList = lazy(() =>
  import('./components/users/userList')
    .then(({ UserList }) => ({ default: UserList }))
);

class MyApp extends Component<any, any> {
  constructor(props: any){
    super(props)
    this.state = {
      path: this.props.match.path
    }
    console.log(this.props.location.pathname, 'propsss');
  }

  render() {
    return (
      <AUX>
        <div id="wrapper">
            <TopBar  {...this.props} />
            <SideBar {...this.props} />
            <div className="content-page">
              <div className="content">
                  <Suspense fallback={<p>...</p>}>
                    <Switch>
                      <Route exact path={`/`}>
                        <Redirect to={`/dashboard`} />
                      </Route>
                      <Route path={`/dashboard`} component={Dashboard} />
                      <Route path={`/configurations`} component={Configurations} />
                      <Route path={`/scanLogs`} component={ScanLogs} />
                      <Route path={`/createUser`} component={CreateUser} />
                      <Route path={`/userList`} component={UserList} />
                      {/* <Route path={`${path}/userList`} component={Contacts} /> */}
                      {/* <Route path='*' render={() => <Error404 />} /> */}
                    </Switch>
                  </Suspense>
              </div>
            </div>
        </div>
      </AUX> 
    );
  }
}

const AppHome = withRouter(MyApp);

export { AppHome };



