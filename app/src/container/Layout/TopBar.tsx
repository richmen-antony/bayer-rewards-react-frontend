import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import logo from "../../assets/icons/bayer_logo.svg";
import menuIcon from "../../assets/icons/menu_icon.svg";
import bell from "../../assets/icons/bell_icon.svg";
import userImg from "../../assets/images/user.png";

import "../../assets/scss/layout.scss";
import {
  setLocalStorageData,
  getLocalStorageData,
  clearLocalStorageData,
} from "../../utility/base/localStore";
import Cookies from "js-cookie";
import DropdownArrow from "../../assets/images/down-arrow.svg";
import BayerRewardsImg from "../../assets/icons/logo.svg";
import IndiaFLag from "../../assets/icons/india_flag.svg";
import MalawiFlag from "../../assets/icons/malawi_flag.svg";
import Authorization from "../../utility/authorization";

type Props = {
  history?: any;
};
type States = {
  dropdownOpenprofile: boolean;
  dropdownOpenNotification: boolean;
  userData: any;
};
class TopBar extends Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      dropdownOpenprofile: false,
      dropdownOpenNotification: false,
      userData: "",
    };
  }
  componentDidMount() {
    let data: any = getLocalStorageData("userData");
    if (data)
      this.setState({
        userData: JSON.parse(data),
      });
  }

  toggleprofile = () => {
    this.setState((prevState) => ({
      dropdownOpenprofile: !prevState.dropdownOpenprofile,
    }));
  };
  toggleNotofication = () => {
    this.setState((prevState) => ({
      dropdownOpenNotification: !prevState.dropdownOpenNotification,
    }));
  };
  handleChange = (value: any) => {
    // setLocalStorageData("isLoggedOut", true);
    // clearLocalStorageData("userData");
    // Cookies.remove("userData");
    Authorization.logOut();
    this.props.history.push("/landing");
  };

  render() {
    const { dropdownOpenprofile, dropdownOpenNotification, userData } =
      this.state;
    return (
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo">
            <span>
              <img src={BayerRewardsImg} alt="Logo" height="80" />
            </span>
            <i>
              <img src={BayerRewardsImg} alt="Logo" height="50" />
            </i>
          </div>
        </div>

        <nav className="navbar-custom">
          <ul className="list-inline menu-left mb-0">
            <li className="float-left center button-menu-mobile open-left waves-effect">
              <img src={menuIcon} alt="Logo" />
            </li>
          </ul>

          <ul className="navbar-right d-flex list-inline float-right mb-0">
            <li className="dropdown notification-list">
              {/* <Dropdown isOpen={dropdownOpenNotification} toggle={this.toggleNotofication}>
                                <DropdownToggle className="nav-link dropdown-toggle testflag arrow-none waves-effect" tag="a">
                                  
                                    <img src={bell} alt="User" width="20" />
                                    <span className="badge badge-pill badge-danger noti-icon-badge">1</span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu dropdown-menu-right dropdown-menu-lg">
                                    <h6 className="dropdown-item-text">
                                        Notifications (1)
                                </h6>
                                    <DropdownItem >
                                        <Link id="ex" to="#" className="dropdown-item text-center text-success">
                                            Scanned successfully <i className="fi-arrow-right"></i>
                                        </Link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown> */}
            </li>

            <div className="profileSettings">
              <div className="flag-img">
              <img
                        src={
                          userData.countrycode === "MW" ? MalawiFlag : IndiaFLag
                        }
                        alt="user"
                        className="rounded-circle nav-pro-img"
                        width={50}
                        height={50}
                      />
              </div>
                  
              <Dropdown
                isOpen={dropdownOpenprofile}
                toggle={this.toggleprofile}
              >
                <DropdownToggle
                  className="dropdown-toggle testflag nav-link arrow-none waves-effect nav-user"
                  tag="a"
                >
                  <div className="profileToggle">
                    <div className="profileImg">
                      <div className="content">
                        <h4 className="title">{userData.username}</h4>

                        {/* <span>{userData.email}</span> */}
                      </div>
                      <img
                        src={DropdownArrow}
                        style={{ width: "20%", height: "20%" }}
                      />
                    </div>

                    <div>
                      <span className="mdi mdi-chevron-down "></span>
                    </div>
                  </div>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <i className="fa fa-user-circle"></i>{" "}
                    <span className="ml-1">{userData.fullname}</span>{" "}
                  </DropdownItem>
                  <DropdownItem onClick={() => this.handleChange("logout")}>
                    <i className="fa fa-sign-out-alt text-danger"></i>{" "}
                    <span className="ml-1"> Logout </span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <div style={{ paddingLeft: "20px", paddingTop: "8px" }}>
                <img src={logo} alt="Logo" height="50" />
              </div>
            </div>
          </ul>
        </nav>
      </div>
    );
  }
}

export default TopBar;
