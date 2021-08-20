import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import AUX from "../../hoc/Aux_";
import homeIcon from "../../assets/icons/home_icon.svg";
import addUserIcon from "../../assets/icons/add_user_icon.svg";
import userListIcon from "../../assets/icons/list_user_icon.svg";
import scanLogsIcon from "../../assets/icons/scan_logs_icon.svg";
import logoutIcon from "../../assets/icons/logout_icon.svg";
import lLogo from "../../assets/icons/large_logo_holder.svg";
import NoImage from "../../assets/images/no_image.svg";
import country from "../../assets/images/country.svg";
import {
  getLocalStorageData,
} from "../../utility/base/localStore";
import Authorization from "../../utility/authorization";
import { AppContext } from "../../container/context";

type Props = {
  history?: any;
};
type States = {
  activeTab: any;
  userRole: any;
};
// interface IProps {
//   style: any;
// }

class Sidebar extends Component<Props, States> {
  static contextType = AppContext
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: "dashboard",
      userRole: "",
    };
    // $("body").toggleClass("");
    $("body").addClass("enlarged");
  }

  componentDidMount() {
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
    userData?.role &&
    this.setState({
      userRole: userData.role,
    });
    $(".button-menu-mobile").on("click", (event: any) => {
      event.preventDefault();
      $("body").toggleClass("enlarged");
    });
  }
  setActiveTab = (tab: any) => {
    this.setState({ activeTab: tab });
  };
  /**
   * To logout page and check the unsaved change value for Prompt 
   */
  logout = () => {
    const {promptMode} =this.context;
    if(!promptMode)
    Authorization.logOut();
    
  };

  render() {
    const { activeTab } = this.state;
    // const scrollHeight = {
    //   height: `calc(100vh - 156px)`,
    // };
    return (
      <AUX>
        <div className="left side-menu ">
          <img className="sideMenuLine" src={lLogo} data-testid="left-logo" alt={NoImage} />
          <div className="sideMenuNav">
            {/* <Scrollbars
              style={scrollHeight}
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              thumbMinSize={10}
              renderThumbVertical={({ style, ...props }: IProps) => (
                <div
                  {...props}
                  style={{
                    ...style,
                    backgroundColor: "#10384F",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "4px",
                  }}
                />
              )}
              {...this.props}
            > */}
            <div id="sidebar-menu" className="">
              <ul className="metismenu" id="side-menu">
                  <li className="d-flex">
                    <span
                      className={
                        window.location.pathname.indexOf("dashboard") > -1
                          ? "waves-effect active"
                          : "waves-effect"
                      }
                    ></span>
                    <Link
                      to="/dashboard"
                      onClick={() => this.setActiveTab("dashboard")}
                    >
                      <img src={homeIcon} alt={NoImage} width="16" data-testid="dashboard-icon" />{" "}
                      <span> Dashboard </span>
                    </Link>
                  </li>
             

                {this.state.userRole === "ADMIN" && (
                  <>
                    <li className="menu-title">MANAGEMENT</li>
                    <li className="d-flex">
                      <span
                        className={
                          window.location.pathname.indexOf("createUser") > -1
                            ? "waves-effect active"
                            : "waves-effect"
                        }
                      ></span>
                      <Link
                        to="/createUser"
                        onClick={(e:any) => (window.location.pathname.indexOf("createUser") > -1) ? e.preventDefault(): this.setActiveTab("createUser")}
                      >
                        <img src={addUserIcon} alt={NoImage} width="16" data-testid="createuser-icon" />{" "}
                        <span> Create New User </span>
                      </Link>
                    </li>

                    <li className="d-flex">
                      <span
                        className={
                          window.location.pathname.indexOf("userList") > -1
                            ? "waves-effect active"
                            : "waves-effect"
                        }
                      ></span>
                      <Link
                        to="/userList"
                        onClick={() => this.setActiveTab("userList")}
                      >
                        <img src={userListIcon} alt={NoImage} width="16" data-testid="listuser-icon" />{" "}
                        <span> User List </span>
                      </Link>
                    </li>
                    <li className="d-flex">
                      <span
                        className={
                          window.location.pathname.indexOf("order") > -1
                            ? "waves-effect active"
                            : "waves-effect"
                        }
                      ></span>
                      <Link
                        to="/order"
                        onClick={() => this.setActiveTab("order")}
                      >
                        <img src={scanLogsIcon} alt={NoImage} width="16" data-testid="order-icon" />{" "}
                        <span> Order History </span>
                      </Link>
                    </li>
                    {/* <li className="d-flex">
                                                <span className={activeTab === 'configurations' ? 'waves-effect active' : 'waves-effect'}></span>
                                                <Link to="/configurations" className={activeTab === 'configurations' ? 'waves-effect active' : 'waves-effect'} onClick={() => this.setActiveTab('configurations')}>
                                                    <img src={pointLogsIcon} alt="User" width="16" /> <span> Configurations </span>
                                                </Link>
                                            </li> */}
                  </>
                )}

                {this.state.userRole === "DEVADMIN" && (
                  <>
                    <li className="menu-title">MANAGEMENT</li>
                    <li className="d-flex">
                      <span
                        className={
                          window.location.pathname.indexOf("devconfig") > -1
                            ? "waves-effect active"
                            : "waves-effect"
                        }
                      ></span>

                      <Link
                        to="/devconfig"
                        className={
                          activeTab === "devconfig"
                            ? "waves-effect active"
                            : "waves-effect"
                        }
                        onClick={() => this.setActiveTab("devconfig")}
                      >
                        <img src={country} alt="User" width="16" />{" "}
                        <span> Dev Config </span>
                      </Link>
                    </li>
                  </>
                )}

                {this.state.userRole === "RSM" && (
                  <>
                    <li className="menu-title">LOGS</li>
                    <li className="d-flex">
                      <span
                        className={
                          window.location.pathname.indexOf("scanlogs") > -1
                            ? "waves-effect active"
                            : "waves-effect"
                        }
                      ></span>
                      <Link
                        to="/scanlogs"
                        onClick={() => this.setActiveTab("scanlogs")}
                      >
                        <img src={scanLogsIcon} alt="Sacn" width="16" />{" "}
                        <span> Scan Logs </span>
                      </Link>
                    </li>
                    {/* <li className="d-flex">
                      <span
                        className={
                          window.location.pathname.indexOf("consolidatedScans") > -1
                            ? "waves-effect active"
                            : "waves-effect"
                        }
                      ></span>
                      <Link
                        to="/consolidatedScans"
                        onClick={() => this.setActiveTab("consolidatedScans")}
                      >
                        <img src={scanLogsIcon} alt="Consolidated Scans" width="16" />{" "}
                        <span> Consolidated Sales </span>
                      </Link>
                    </li>{" "} */}
                  </>
                )}

                {/* <li className="menu-title">HELP</li>
                <li className="d-flex">
                  <span
                    className={
                      window.location.pathname.indexOf("coachWalker") > -1
                        ? "waves-effect active"
                        : "waves-effect"
                    }
                  ></span>
                  <Link
                    to="/coachWalker"
                    onClick={() => this.setActiveTab("coachWalker")}
                  >
                    <img src={coachIcon} alt="Coach Walker" width="16" />{" "}
                    <span> Coach walker </span>
                  </Link>
                </li>
                <li className="d-flex">
                  <span
                    className={
                      window.location.pathname.indexOf("helpCenter") > -1
                        ? "waves-effect active"
                        : "waves-effect"
                    }
                  ></span>
                  <Link
                    to="/helpCenter"
                    onClick={() => this.setActiveTab("helpCenter")}
                  >
                    <img src={helpCenterIcon} alt="Help Center" width="16" />{" "}
                    <span> Help center </span>
                  </Link>
                </li> */}
              </ul>
            </div>

            <div className="clearfix"></div>
            {/* </Scrollbars> */}
          </div>
          <div id="sidebar-menu" className="">
            <ul className="metismenu" id="side-menu">
              <li className="d-flex">
                <span
                  className={
                    window.location.pathname.indexOf("landing") > -1
                      ? "waves-effect active"
                      : "waves-effect"
                  }
                ></span>
                <Link to="/landing" onClick={this.logout}>
                  <img src={logoutIcon} alt={NoImage} width="16" data-testid="logout-icon" />{" "}
                  <span> Logout </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </AUX>
    );
  }
}

export default Sidebar;
