import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Router } from "./router";
import * as React from "react";

// To enable isRemember Need to logged out
import { getLocalStorageData } from "./utility/base/localStore";
import Authorization from "./utility/authorization";

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

function App() {
  // To enable isRemember Need to logged out
  let data: any = getLocalStorageData("userData");
  let userinfo = JSON.parse(data);
  window.onbeforeunload = function (e: any) {
    if (userinfo?.isRemember === false) Authorization.logOut();
  };

  return (
    <>
      <ToastContainer />
      <Router />
    </>
  );
}

// interface PersonInfoProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {

// }
export default App;
