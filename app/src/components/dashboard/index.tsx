import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import adduser from "../../assets/icons/add-user.svg";
import userlist from "../../assets/images/user-list.png";
import CustomCard from "../../containers/components/card";
import "../../assets/scss/rsmDashboard.scss";
import { getLocalStorageData } from "../../utility/base/localStore";
import { apiURL } from "../../utility/base/utils/config";
import { invokeGetAuthService } from "../../utility/base/service";
import BarCodeIcon from "../../assets/icons/barcode.svg";
import orderHistoryIcon from "../../assets/icons/order_history_blue.svg";
import country from "../../assets/images/country-devadmin.svg";

type Props = {
	location?: any;
	history?: any;
};

type States = {
	scanLogCount: number;
	usersCount: number;
	isLoader: boolean;
	userRole: any;
	adminUsersCount: number;
	adminOrderHistoryCount: number;
	adminScanLogCount: number;
	trueValues: any;
};

class Dashboard extends Component<Props, States> {
	constructor(props: any) {
		super(props);
		this.state = {
			userRole: "",
			scanLogCount: 0,
			usersCount: 0,
			isLoader: false,
			adminUsersCount: 0,
			adminOrderHistoryCount: 0,
			adminScanLogCount: 0,
			trueValues: [],
		};
	}
	componentDidMount() {
		let data: any = getLocalStorageData("userData");
		let userData = JSON.parse(data);
		if (userData?.role) this.setState({ userRole: userData?.role });

		if (userData?.role === "ADMIN") this.getAdminDashboardDetails();
		if (userData?.role === "RSM") this.getrsmDashboardDetails();
	}
	getrsmDashboardDetails = () => {
		const { rsmDashboard } = apiURL;
		let obj: any = getLocalStorageData("userData");
		let userData = JSON.parse(obj);
		//localStorage
		let availableFeature: any = userData?.features;
		let truthyValues: any = Object.keys(availableFeature).filter((e) => availableFeature[e]);
		this.setState({
			trueValues: truthyValues,
		});

		const data = {
			region: userData?.geolevel1,
			countrycode: userData?.countrycode,
		};
		this.setState({ isLoader: true });
		invokeGetAuthService(rsmDashboard, data).then((response) => {
			let res = Object.keys(response.body).length !== 0 ? response.body : "";
			this.setState({
				usersCount: res.usercount,
				scanLogCount: res.scanlogscount,
			});
		});
	};
	getAdminDashboardDetails = () => {
		const { adminUserCount } = apiURL;
		let obj: any = getLocalStorageData("userData");
		let userData = JSON.parse(obj);
		const data = {
			// region: userData?.geolevel1 ,
			countrycode: userData?.countrycode,
		};
		invokeGetAuthService(adminUserCount, data)
			.then((response: any) => {
				let res = Object.keys(response.body).length !== 0 ? response.body : "";
				this.setState({
					isLoader: false,
				});
				this.setState({
					adminUsersCount: res?.usercount,
					adminOrderHistoryCount: res?.advisororderlogscount,
					adminScanLogCount: res?.scanlogscount,
				});
			})
			.catch((error: any) => {
				this.setState({ isLoader: false });
				console.log(error, "error");
			});
	};
	/**
	 * Navigate the scanlogs page
	 */
	cardClick = () => {
		this.props.history.push("./scanlogs");
	};
	/**
	 * Navigate the create User page
	 */
	cardCreateUserClick = () => {
		this.props.history.push("./createUser");
	};
	/**
	 * Navigate the user list page
	 */
	totalUserClick = () => {
		this.props.history.push("./userList");
	};
	handleNavigateOrder = () => {
		this.props.history.push("./order");
	};
	/**
	 * Navigate the dev config page
	 */
	handleNavigateDevConfig = () => {
		this.props.history.push("./devconfig");
	};
	render() {
		return (
			<AUX>
				<div className="card card-main" data-testid="dashboard">
					{this.state.userRole === "RSM" ? (
						<div className="dashboard">
							{/* {this.state.trueValues.includes("Scan logs") ? ( */}
							<div style={{ marginRight: "30px" }}>
								<CustomCard icon={BarCodeIcon} border="1px solid #FFA343" background="#FFF4E7" cardClick={() => this.cardClick()}>
									<span className="count">{this.state.scanLogCount}</span>
									<br />
									<span className="title">Scan Logs</span>
								</CustomCard>
							</div>
							{/* ) : null} */}
							<div>
								<CustomCard icon={userlist} border="1px solid #206BDD" background="#DFE8FA">
									<span className="count">{this.state.usersCount}</span>
									<br />
									<span className="title">Total Users</span>
								</CustomCard>
							</div>
						</div>
					) : (
						this.state.userRole === "ADMIN" && (
							<div className="dashboard">
								<div className="card-list">
									<CustomCard
										icon={adduser}
										border="1px solid #FFA343"
										background="#FFF4E7"
										cardClick={() => this.cardCreateUserClick()}
									>
										<span className="title">Create New User</span>
									</CustomCard>
								</div>
								<div className="card-list">
									<CustomCard icon={userlist} border="1px solid #206BDD" background="#DFE8FA" cardClick={() => this.totalUserClick()}>
										<span className="count">{this.state.adminUsersCount}</span>
										<br />
										<span className="title">Total Users</span>
									</CustomCard>
								</div>
								<div className="card-list">
									<CustomCard
										icon={orderHistoryIcon}
										border="1px solid #b6d0ea"
										background="#f8f9fa"
										cardClick={() => this.handleNavigateOrder()}
									>
										<span className="count">{this.state.adminOrderHistoryCount}</span>
										<br />
										<span className="title">Total Orders</span>
									</CustomCard>
								</div>
								<div className="card-list">
									<CustomCard icon={BarCodeIcon} border="1px solid #b2ebf2" background="#f0f8ff" cardClick={() => this.cardClick()}>
										<span className="count">{this.state.adminScanLogCount}</span>
										<br />
										<span className="title">Scan Logs</span>
									</CustomCard>
								</div>
							</div>
						)
					)}
					{this.state.userRole === "DEVADMIN" && (
						<div className="dashboard">
							<div style={{ marginRight: "30px" }}>
								<CustomCard
									icon={country}
									border="1px solid #FFA343"
									background="#FFF4E7"
									cardClick={() => this.handleNavigateDevConfig()}
								>
									<span className="title">Dev Admin</span>
								</CustomCard>
							</div>
						</div>
					)}
				</div>
			</AUX>
		);
	}
}

export default Dashboard;
