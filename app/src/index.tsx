import React ,{Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
// import store from './store/store';
import { store } from './redux/store/index';
import PrivateRoute from './routes/privateRoute';
import PublicRoute from './routes/publicRoute';
import { ROUTE } from './routes/routes'
import Layout from "./container/Layout";
import  Loader from './utility/widgets/loader';
import { ToastContainer } from "react-toastify";
import { clearLocalStorageData } from './utility/base/localStore';
import Cookies from 'js-cookie';
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './assets/scss/index.scss';

/**
 * Create the routes dynamically
 *
 * @return route component
 */
 const setRoutes = () => {
  const routes = ROUTE;
  return routes.map((route, index) =>
    route.private ? (
      <PrivateRoute
        key={index}
        path={route.path}
        meta={route.meta}
        exact={route.exact}
        component={route.component}
        role={route.role}
      />
    ) : (
      <PublicRoute
        key={index}
        path={route.path}
        meta={route.meta}
        exact={route.exact}
        component={route.component}
      />
    )
  );
};

// Define Type html tag section declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      h8: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      h7: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
const getLData = localStorage.getItem('userData');
const getCData = Cookies.get('userData');
console.log(getCData, 'getCData f');

  let isLoggedIn = false;
  if(getCData){
    isLoggedIn = JSON.parse(getCData).isRemember;
  }
  if(!isLoggedIn && !getLData){
    Cookies.remove('userData');
    clearLocalStorageData('userData');
  }
const app = (
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Layout>
      <ToastContainer />
        <Switch>{setRoutes()}</Switch>
      </Layout>
    </Suspense>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>

);

ReactDOM.render(app, document.getElementById('root'));


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
