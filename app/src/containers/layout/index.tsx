import React from "react";
import { withRouter } from "react-router-dom";
import AUX from "../../hoc/Aux_";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import Authorization from "../../utility/authorization";

function Layout(props: any, currentLocale?: any, handleChange?: any) {
  return Authorization.isLoggedIn() ? (
    <AUX>
      <div id="wrapper">
        <TopBar
          currentLocale={currentLocale}
          handleChange={handleChange}
          {...props}
        />
        <SideBar {...props} />
        <div className="content-page">
          <div className="content">{props.children}</div>
        </div>
      </div>
    </AUX>
  ) : (
    props.children
  );
}
export default withRouter(Layout);
