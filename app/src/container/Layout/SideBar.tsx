import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import AUX from "../../hoc/Aux_";
import homeIcon from "../../assets/icons/home_icon.svg";
import addUserIcon from "../../assets/icons/add_user_icon.svg";
import userListIcon from "../../assets/icons/list_user_icon.svg";
import scanLogsIcon from "../../assets/icons/scan_logs_icon.svg";
import pointLogsIcon from "../../assets/icons/points_log_icon.svg";
import coachIcon from "../../assets/icons/coach_walker_icon.svg";
import helpCenterIcon from "../../assets/icons/help_icon.svg";
import logoutIcon from "../../assets/icons/logout_icon.svg";
import lLogo from "../../assets/icons/large_logo_holder.svg";
import leftArrow from "../../assets/icons/left_arrow.svg";
import country from '../../assets/images/country.svg';
import { setLocalStorageData, getLocalStorageData, clearLocalStorageData } from '../../utility/base/localStore';
import Cookies from 'js-cookie';
import { Scrollbars } from 'react-custom-scrollbars';

type Props = {
  history?: any;
};
type States = {
  activeTab: any;
  userRole: any;
};
interface IProps {
  style : any;
}

class Sidebar extends Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: "dashboard",
      userRole: "",
    };
    console.log(this.props, "test");
    // $("body").toggleClass("");
    $("body").addClass("enlarged");
  }

  componentDidMount() {
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
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
  logout = () => {
    setLocalStorageData("isLoggedOut", true);
    clearLocalStorageData("userData");
    Cookies.remove("userData");
    this.props.history.push("/landing");
  };

  render() {
    console.log(this.state, "state");
    const { activeTab } = this.state;
    const scrollHeight = {
      height: `calc(100vh - 156px)`,
    };
    return (
      <AUX>
        <div className="left side-menu ">
          <img className="sideMenuLine" src={lLogo} alt="" />
          <div className="sideMenuNav">
            <Scrollbars
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
            >
              <div id="sidebar-menu" className="">
                <ul className="metismenu" id="side-menu">
                  <li className="d-flex">
                    <span
                      className={
                        window.location.pathname.indexOf('dashboard') > -1
                          ? "waves-effect active"
                          : "waves-effect"
                      }
                    ></span>
                    <Link
                      to="/dashboard"
                      onClick={() => this.setActiveTab("dashboard")}
                    >
                      <img src={homeIcon} alt="User" width="16" />{" "}
                      <span> Dashboard </span>
                    </Link>
                  </li>

                  {this.state.userRole === "ADMIN" && (
                    <>
                      <li className="menu-title">MANAGEMENT</li>
                      
                                      <li className="d-flex">
                    <span className={activeTab === 'devconfig' ? 'waves-effect active' : 'waves-effect'}></span>
                    <Link to="/devconfig" className={activeTab === 'devconfig' ? 'waves-effect active' : 'waves-effect'} onClick={() => this.setActiveTab('devconfig')}>
                        <img src={country} alt="User" width="16" /> <span> Dev Config </span>
                    </Link>
                </li>

                      
                      <li className="d-flex">
                        <span
                          className={
                            window.location.pathname.indexOf('createUser') > -1
                              ? "waves-effect active"
                              : "waves-effect"
                          }
                        ></span>
                        <Link
                          to="/createUser"
                          onClick={() => this.setActiveTab("createUser")}
                        >
                          <img src={addUserIcon} alt="User" width="16" />{" "}
                          <span> Create a new user </span>
                        </Link>
                      </li>

                      <li className="d-flex">
                        <span
                          className={
                            window.location.pathname.indexOf('userList') > -1
                              ? "waves-effect active"
                              : "waves-effect"
                          }
                        ></span>
                        <Link
                          to="/userList"
                          onClick={() => this.setActiveTab("userList")}
                        >
                          <img src={userListIcon} alt="User" width="16" />{" "}
                          <span> User List </span>
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

                  <li className="menu-title">LOGS</li>
                  {this.state.userRole === "RSM" && (
                    <>
                      <li className="d-flex">
                        <span
                          className={
                            window.location.pathname.indexOf('scanlogs') > -1
                              ? "waves-effect active"
                              : "waves-effect"
                          }
                        ></span>
                        <Link
                          to="/scanLogs"
                          onClick={() => this.setActiveTab("scanLogs")}
                        >
                          <img src={scanLogsIcon} alt="Sacn" width="16" />{" "}
                          <span> Scan logs </span>
                        </Link>
                      </li>
                      <li className="d-flex">
                        <span
                          className={
                            window.location.pathname.indexOf('pointLogs') > -1
                              ? "waves-effect active"
                              : "waves-effect"
                          }
                        ></span>
                        <Link
                          to="/pointLogs"
                          onClick={() => this.setActiveTab("pointLogs")}
                        >
                          <img src={pointLogsIcon} alt="Points" width="16" />{" "}
                          <span> Point logs </span>
                        </Link>
                      </li>{" "}
                    </>
                  )}

                  <li className="menu-title">HELP</li>
                  <li className="d-flex">
                    <span
                      className={
                        window.location.pathname.indexOf('coachWalker') > -1
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
                        window.location.pathname.indexOf('helpCenter') > -1
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
                  </li>
                  <li className="d-flex" style={{ paddingTop: '10px'}}>
                    <span
                      className={
                        window.location.pathname.indexOf('landing') > -1
                          ? "waves-effect active"
                          : "waves-effect"
                      }
                    ></span>
                    <Link
                      to=""
                      onClick={this.logout}
                    >
                      <img src={logoutIcon} alt="Help Center" width="16" />{" "}
                      <span> Logout </span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="clearfix"></div>
            </Scrollbars>
          </div>
        </div>
      </AUX>
    );
  }
}

export default Sidebar;
