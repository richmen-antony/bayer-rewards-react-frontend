import React, { Component } from 'react';

import AUX from "../../hoc/Aux_";
import adduser from "../../assets/icons/add-user.svg";
import userlist from "../../assets/images/user-list.png";
// import leftArrow from "../../assets/icons/left_arrow.svg";
import CustomCard from "../../container/components/card";
import "../../assets/scss/rsmDashboard.scss";
import { getLocalStorageData, clearLocalStorageData } from '../../utility/base/localStore';
import { apiURL } from "../../utility/base/utils/config";
import {
  invokeGetAuthService,
  invokeGetService,
} from "../../utility/base/service";
import BarCodeIcon from "../../assets/icons/barcode.svg";

type Props = {
  location?: any;
  history?: any;
}

type States = {
  scanLogCount: number;
  usersCount: number;
  isLoader: boolean;
  userRole: any;
  adminUsersCount: number;
}

class Dashboard extends Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      userRole: "",
      scanLogCount: 0,
      usersCount: 121,
      isLoader: false,
      adminUsersCount: 0
    };
  }
  componentDidMount() {
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
    this.setState({
      userRole: userData.role,
    });
    this.getDashboardDetails();
    this.getAdminDashboardDetails();
  }
  getDashboardDetails = () => {
    const { rsmDashboard } = apiURL;
    this.setState({ isLoader: true });
    invokeGetAuthService(rsmDashboard).then((response) => {
      let res = Object.keys(response.body).length !== 0 ? response.body : "";
      this.setState({
        usersCount: res.usercount,
        scanLogCount: res.scanlogscount,
      });
    });
  };
  getAdminDashboardDetails = () => {
    const { adminUserCount } = apiURL;
    invokeGetAuthService(adminUserCount)
      .then((response: any) => {
        let res = Object.keys(response.body).length !== 0 ? response.body : "";
        this.setState({
          isLoader: false,
        });
        this.setState({
          adminUsersCount: res.usercount
        });
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        console.log(error, "error");
      });
    }

  cardClick = () => {
    this.props.history.push("./scanlogs");
  };
  cardCreateUserClick = () => {
    this.props.history.push("./createUser");
  };
  totalUserClick = () => {
    this.props.history.push("./userList");
  };

  render() {
    return (
      <AUX>
        <div className="card card-main">
          {this.state.userRole === "RSM" ? (
            <div className="dashboard">
              <div style={{ marginRight: "30px" }} >
                <CustomCard
                  icon={BarCodeIcon}
                  border="1px solid #FFA343"
                  background="#FFF4E7"
                  cardClick={() => this.cardClick()}
                >
                  <div style={{ fontSize: "24px" }}>
                    {this.state.scanLogCount}
                  </div>
                  <div style={{ fontSize: "18px" }}>Scan Logs</div>
                </CustomCard>
                
              </div>
              <div>
                <CustomCard
                  icon={userlist}
                  border="1px solid #206BDD"
                  background="#DFE8FA"
                >
                  <div style={{ fontSize: "24px" }}>
                    {this.state.usersCount}
                  </div>
                  <div style={{ fontSize: "18px" }}>Total Users</div>
                </CustomCard>
              </div>
              </div>
          ) : (
              <div className="dashboard">
                <div style={{ marginRight: "30px" }}>
                  <CustomCard
                    icon={adduser}
                    border="1px solid #FFA343"
                    background="#FFF4E7"
                    cardClick={() => this.cardCreateUserClick()}
                  >
                    <div style={{ fontSize: "18px", marginTop: "15px" }}>
                      Create New User
                  </div>
                  </CustomCard>
                </div>
                <div>
                  <CustomCard
                    icon={userlist}
                    border="1px solid #206BDD"
                    background="#DFE8FA"
                    cardClick={() => this.totalUserClick()}
                  >
                    <div style={{ fontSize: "24px" }}>
                      {this.state.adminUsersCount}
                    </div>
                    <div style={{ fontSize: "18px", marginTop: "15px" }}>Total Users</div>
                  </CustomCard>
                </div>
              </div>
            )}
        </div>
      </AUX>
    );
  }
}

export { Dashboard };
