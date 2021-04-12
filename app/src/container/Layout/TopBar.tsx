import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import logo from '../../assets/icons/bayer_logo.svg';
import menuIcon from '../../assets/icons/menu_icon.svg';
import bell from '../../assets/icons/bell_icon.svg';
import userImg from '../../assets/images/user.png';

import '../../assets/scss/layout.scss';
import { setLocalStorageData, getLocalStorageData, clearLocalStorageData } from '../../utility/base/localStore';
import Cookies from 'js-cookie';

type Props = {
    history?: any;
}
type States = {
    dropdownOpenprofile: boolean;
    dropdownOpenNotification: boolean;
    userData: any;
}
class TopBar extends Component<Props,States> {

    constructor(props: any) {
        super(props);
        this.state = {
            dropdownOpenprofile: false,
            dropdownOpenNotification: false,
            userData: ""
        };
    }
    componentDidMount() {
        let data: any = getLocalStorageData('userData')
        this.setState({
            userData: JSON.parse(data)
        });
    }

    
    toggleprofile = () => {
        this.setState(prevState => ({
            dropdownOpenprofile: !prevState.dropdownOpenprofile
        }));
    }
    toggleNotofication = () => {
        this.setState(prevState => ({
            dropdownOpenNotification: !prevState.dropdownOpenNotification
        }));
    }
    handleChange = (value: any) => {
        console.log(this.props.history, 'history');
        setLocalStorageData('isLoggedOut', true);
        clearLocalStorageData('userData');
        Cookies.remove('userData');
        this.props.history.push('/landing');
    }

    render() {
        const {dropdownOpenprofile, dropdownOpenNotification, userData } = this.state;
        return (
            <div className="topbar">

                <div className="topbar-left">
                    <div className="logo">
                        <span>
                            <img src={logo} alt="Logo" height="40" />
                            <span className="ml-3">
                                Rewards
                            </span>
                        </span>
                        <i>
                            <img src={logo} alt="Logo" height="30" />
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
                            <Dropdown isOpen={dropdownOpenNotification} toggle={this.toggleNotofication}>
                                <DropdownToggle className="nav-link dropdown-toggle testflag arrow-none waves-effect" tag="a">
                                    {/* <i className="mdi mdi-bell-outline noti-icon"></i> */}
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
                            </Dropdown>

                        </li>

                        <div className="profileSettings">
                            <Dropdown isOpen={dropdownOpenprofile} toggle={this.toggleprofile}>
                                <DropdownToggle className="dropdown-toggle testflag nav-link arrow-none waves-effect nav-user" tag="a">
                                    <div className="profileToggle">

                                        <div className="profileImg">
                                            <img src={userImg} alt="user" className="rounded-circle nav-pro-img" />
                                            <div className="content">
                                                <h4 className="title">{userData.username}</h4>
                                                <span>{userData.email}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="mdi mdi-chevron-down "></span>
                                        </div>
                                    </div>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => this.handleChange('profile')}><i className="fa fa-user-circle"></i> <span className="ml-1">{userData.fullname}</span> </DropdownItem>
                                    <DropdownItem onClick={() => this.handleChange('logout')}><i className="fa fa-sign-out-alt text-danger"></i> <span className="ml-1"> Logout </span></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </ul>

                </nav>
            </div>
        );
    }
}

export default TopBar;