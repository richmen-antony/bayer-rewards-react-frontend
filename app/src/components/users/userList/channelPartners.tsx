import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import MuiButton from "@material-ui/core/Button";
import AUX from "../../../hoc/Aux_";
import Pagination from "../../../utility/widgets/pagination";
import AdminPopup from "../../../container/components/dialog/AdminPopup";
import Edit from "../../../assets/images/edit.svg";
import EditDisabled from "../../../assets/icons/edit_disabled.svg";
import NotActivated from "../../../assets/images/not_activated.svg";
import Check from "../../../assets/images/check.svg";
import Cancel from "../../../assets/images/cancel.svg";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import NoImage from "../../../assets/images/no_image.svg";
import blackmockup from "../../../assets/icons/black-mockup.svg";
import ArrowIcon from "../../../assets/icons/dark bg.svg";
import ExpandWindowImg from "../../../assets/images/expand-window.svg";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import { apiURL } from "../../../utility/base/utils/config";
import { patterns } from "../../../utility/base/utils/patterns";
import { invokeGetAuthService, invokePostAuthService } from "../../../utility/base/service";
import { Alert } from "../../../utility/widgets/toaster";
import { getLocalStorageData } from "../../../utility/base/localStore";
import { allowAlphabetsNumbers } from "../../../utility/base/utils/";
import { Input } from "../../../utility/widgets/input";
import CustomSwitch from "../../../container/components/switch";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loader from "../../../utility/widgets/loader";
import _ from "lodash";
import Filter from "../../../container/grid/Filter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "reactstrap";
import CalenderIcon from "../../../assets/icons/calendar.svg";
import moment from "moment";
import { sortBy } from "../../../utility/base/utils/tableSort";
import NativeDropdown from "../../../utility/widgets/dropdown/NativeSelect";

type PartnerTypes = {
	type: String;
  };
type Props = {
	location?: any;
	history?: any;
	onRef:any;
};
type States = {
	isLoader: boolean;
	deActivatePopup: boolean;
	staffPopup: boolean;
	deleteStaffPopup: boolean;
	userList: any;
	status: String;
	geographicFields: Array<any>;
	dynamicFields: Array<any>;
	countryList: Array<any>;
	isRendered: boolean;
	userName: String;
	activateUser: any;
	userData: any;
	isStaff: boolean;
	searchText: string;
	dropdownOpenFilter: boolean;
	selectedFilters: any;
	dateErrMsg: string;
	list: Array<any>;
	userStatus: Array<any>;
	isFiltered: boolean;
	inActiveFilter:boolean;
	allChannelPartners: Array<any>;
	totalData: number;
	isAsc: boolean;
	partnerType: PartnerTypes;
	geolevel1List: Array<any>;
	level1Options: Array<any>;
	level2Options: Array<any>;
	level3Options: Array<any>;
};

let levelsName: any = [];

let phoneLength = process.env.REACT_APP_STAGE === "dev" || process.env.REACT_APP_STAGE === "int" ? 10 : 9;

const DialogContent = withStyles((theme: Theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
		justifyContent: "center",
		marginTop: "30px",
	},
	button: {
		boxShadow: "0px 3px 6px #c7c7c729",
		border: "1px solid #89D329",
		borderRadius: "50px",
	},
}))(MuiDialogActions);
interface IProps {
	onChange?: any;
	placeholder?: any;
	value?: any;
	id?: any;
	onClick?: any;
	// any other props that come into the component
}
const ref = React.createRef();
const DateInput = React.forwardRef(({ onChange, placeholder, value, id, onClick }: IProps, ref: any) => (
	<div style={{ border: "1px solid grey", borderRadius: "4px" }}>
		<img src={CalenderIcon} style={{ padding: "2px 5px" }} alt="Calendar" />
		<input
			style={{
				border: "none",
				width: "120px",
				height: "31px",
				outline: "none",
			}}
			onChange={onChange}
			placeholder={placeholder}
			value={value}
			id={id}
			onClick={onClick}
			ref={ref}
		/>
	</div>
));

class ChannelPartners extends Component<Props, States> {
	tableCellIndex: any;
	loggedUserInfo: any;
	getStoreData: any;
	timeOut: any;
	paginationRef:any;
	closeToggle: any;
	constructor(props: any) {
		super(props);
		const dataObj: any = getLocalStorageData("userData");
		const loggedUserInfo = JSON.parse(dataObj);
		this.getStoreData = {
			country: loggedUserInfo?.geolevel0,
			countryCode: loggedUserInfo?.countrycode,
			Language: "EN-US",
		};
		this.state = {
			isLoader: false,
			deActivatePopup: false,
			staffPopup: false,
			deleteStaffPopup: false,
			status: "",
			geographicFields: [],
			dynamicFields: [],
			countryList: [],
			isRendered: false,
			userName: "",
			activateUser: true,
			userList: {},
			userData: {
				staffdetails: [],
				ownerRows: [
					{
						firstname: "",
						lastname: "",
						mobilenumber: "",
						email: "",
						active: true,
						errObj: {
							firstnameErr: "",
							lastnameErr: "",
							mobilenumberErr: "",
							emailErr: "",
						},
					},
				],
			},
			isStaff: false,
			searchText: "",
			dropdownOpenFilter: false,
			selectedFilters: {
				geolevel1: "ALL",
				geolevel2: "ALL",
				geolevel3: "ALL",
				status: "ALL",
				lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
				lastmodifieddateto: new Date(),
			},
			dateErrMsg: "",
			list: ["Retailer", "Distributor"],
			userStatus: ["ALL", "Active", "Inactive", "Pending", "Declined"],
	        isFiltered: false,
			inActiveFilter:false,
			allChannelPartners:[],
			totalData: 0,
			isAsc:false,
			partnerType: {
				type: "Retailer",
			},
			geolevel1List: [],
			level1Options: [],
			level2Options: [],
			level3Options: [],

		};
		this.generateHeader = this.generateHeader.bind(this);
		this.timeOut = 0;
	}
	componentDidMount() {
		this.getChannelPartnersList()
		//API to get country and language settings
		this.getCountryList();
		this.getHierarchyDatas();
		// this.getGeographicFields();
		let data: any = getLocalStorageData("userData");
		let userData = JSON.parse(data);
		if (userData?.username) this.setState({ userName: userData.username });
		// assign a refrence
		this.props.onRef && this.props.onRef(this);
		
	}
	getChannelPartnersList = (defaultPageNo?: number) => {
		this.setState({
		  allChannelPartners: [],
		  dropdownOpenFilter: false,
		  dateErrMsg: "",
		});
		const { channelPartnersList } = apiURL;
		const {state,setDefaultPage}= this.paginationRef;
		const pageNo=  !defaultPageNo ? 1 : state.pageNo;

		// set default pagination number 1 and  call the method
		if(!defaultPageNo){
			setDefaultPage();
		}
         
		this.setState({ isLoader: true});
		let {
		  status,
		  lastmodifieddatefrom,
		  lastmodifieddateto,
		  geolevel1,
		  geolevel2,
		  geolevel3,
		}: any = this.state.selectedFilters;
		
		let data = {
		  countrycode: this.getStoreData.countryCode,
		  page:  pageNo,
		  searchtext: this.state.searchText,
		  isfiltered: this.state.isFiltered,
		  rowsperpage: state.rowsPerPage,
		  usertype: "EXTERNAL",
		  partnertype:
			this.state.partnerType.type === "Distributor"
			  ? "DISTRIBUTOR"
			  : this.state.partnerType.type === "ALL"
			  ? "ALL"
			  : "RETAILER",
		};
		if (this.state.isFiltered) {
		  let filter = {
			status: status,
			lastmodifieddatefrom: moment(lastmodifieddatefrom).format("YYYY-MM-DD"),
			lastmodifieddateto: moment(lastmodifieddateto).format("YYYY-MM-DD"),
			geolevel1: geolevel1,
			geolevel2: geolevel2,
			geolevel3: geolevel3,
		  };
		  data = { ...data, ...filter };
		}
		invokeGetAuthService(channelPartnersList, data)
		  .then((response) => {
			this.setState({
			  isLoader: false,
			  allChannelPartners:
				Object.keys(response.body).length !== 0 ? response.body.rows : [],
			});
			const total = response.totalrows;
			this.setState({ totalData: Number(total) });
		  })
		  .catch((error) => {
			this.setState({ isLoader: false });
			// let message = error.message
			// Alert("warning", message);
		  });
	  };
	
	toggleFilter = (e: any) => {
		this.setState((prevState) => ({
			dropdownOpenFilter: !prevState.dropdownOpenFilter,
		}));
	};
	handleFilterChange = (e: any, name: string, item: any) => {
		e.stopPropagation();
		let val = this.state.selectedFilters;
		let flag = false;
		if (name === "type") {
			val[name] = e.target.value;
			flag = true;
		} else if (name === "lastmodifieddatefrom") {
			if (e.target.value <= val.lastmodifieddateto) {
				val[name] = e.target.value;
				flag = true;
			} else {
				this.setState({
					dateErrMsg: "Start date should be lesser than End Date",
				});
			}
		} else if (name === "endDate") {
			if (e.target.value > new Date().toISOString().substr(0, 10)) {
				this.setState({
					dateErrMsg: "End Date should not be greater than todays date",
				});
			} else if (e.target.value <= val.lastmodifieddatefrom) {
				this.setState({
					dateErrMsg: "End Date should be greater than Start Date",
				});
			} else {
				val[name] = e.target.value;
				flag = true;
			}
		} else {
			val[name] = item;
			flag = true;
		}
		if (flag) {
			this.setState({ selectedFilters: val }, () => {});
		}
	};

	getCountryList() {
		let res = [
			{ value: "India", text: "India" },
			{ value: "Malawi", text: "Malawi" },
		];
		this.setState({ countryList: res });
	}

	getGeographicFields() {
		this.setState({ isLoader: true });
		const { getTemplateData } = apiURL;
		let data = {
		  countryCode: this.getStoreData.countryCode,
		};
		invokeGetAuthService(getTemplateData, data)
		  .then((response: any) => {
			let locationData = response.body[0].locationhierarchy;
			let levels: any = [];
			locationData.forEach((item: any) => {
			  levelsName.push(item.locationhiername.toLowerCase());
			  let locationhierlevel = item.locationhierlevel;
			  let geolevels = "geolevel" + locationhierlevel;
			  levels.push(geolevels);
			});
			this.setState(
			  {
				isLoader: false,
				geographicFields: levels,
			  },
			  () => {
				this.getDynamicOptionFields();
			  }
			);
		  })
		  .catch((error: any) => {
			this.setState({ isLoader: false });
			let message = error.message;
			Alert("warning", message);
		  });
	}
	getHierarchyDatas() {
	//To get all level datas
	this.setState({ isLoader: true });
	const { getHierarchyLevels } = apiURL;
	let countrycode = {
		countryCode: this.getStoreData.countryCode,
	};
	invokeGetAuthService(getHierarchyLevels, countrycode)
		.then((response: any) => {
		let geolevel1 =
			Object.keys(response.body).length !== 0
			? response.body.geolevel1
			: [];
		this.setState({ isLoader: false, geolevel1List: geolevel1 },()=>{
			this.getGeographicFields();
		});
		})
		.catch((error: any) => {
		this.setState({ isLoader: false });
		let message = error.message;
		Alert("warning", message);
		});
	}
	getDynamicOptionFields = (reset?: string) => {
		let level1List = this.state.geolevel1List;
		if (!reset) {
			let allItem = { code: "ALL", name: "ALL", geolevel2: [] };
			level1List.unshift(allItem);
		}
		this.setState({ geolevel1List: level1List });
		let level1Options: any = [];
		this.state.geolevel1List?.forEach((item: any) => {
			let level1Info = { text: item.name, code: item.code, value: item.name };
			level1Options.push(level1Info);
		});
		let setFormArray: any = [];
		this.state.geographicFields?.forEach((list: any, i: number) => {
			setFormArray.push({
			name: list,
			placeHolder: true,
			value: list === "geolevel0" ? this.getStoreData.country : "",
			options:
				list === "geolevel0"
				? this.state.countryList
				: list === "geolevel1"
				? level1Options
				: [{ text: "ALL", name: "ALL" }],
			error: "",
			});
		});
		this.setState({ dynamicFields: setFormArray });
	};

	getOptionLists = (cron: any, type: any, value: any, index: any) => {
	let geolevel1List = this.state.geolevel1List;
	this.setState({ level1Options: geolevel1List });
	let dynamicFieldVal = this.state.dynamicFields;
	if (type === "geolevel1") {
		let filteredLevel1 = geolevel1List?.filter(
		(level1: any) => level1.name === value
		);
		let level2Options: any = [];
		filteredLevel1[0]?.geolevel2?.forEach((item: any) => {
		let level1Info = { text: item.name, value: item.name, code: item.code };
		level2Options.push(level1Info);
		});
		let geolevel1Obj = {
		text: "ALL",
		value: "ALL",
		code: "ALL",
		};
		let geolevel3Obj = [
		{ text: "ALL", code: "ALL", name: "ALL", value: "ALL" },
		];
		level2Options.unshift(geolevel1Obj);
		dynamicFieldVal[index + 1].options = level2Options;
		this.setState({ dynamicFields: dynamicFieldVal });
		dynamicFieldVal[index + 2].options = geolevel3Obj;
		dynamicFieldVal[index].value = value;
		dynamicFieldVal[index + 1].value = "ALL";
		dynamicFieldVal[index + 2].value = "ALL";
		this.setState((prevState: any) => ({
		dynamicFields: dynamicFieldVal,
		selectedFilters: {
			...prevState.selectedFilters,
			geolevel2: "ALL",
			geolevel3: "ALL",
		},
		}));
	} else if (type === "geolevel2") {
		let filteredLevel2: any = [];
		filteredLevel2 = geolevel1List?.filter(
		(level1: any) => level1.name === dynamicFieldVal[1].value
		);
		let geolevel3: any = [];
		let level2List = filteredLevel2[0]?.geolevel2.filter(
		(level2Info: any) => level2Info.name === value
		);
		level2List[0]?.geolevel3?.forEach((item: any) => {
		let geolevel3Info = {
			text: item.name,
			value: item.name,
			code: item.code,
		};
		geolevel3.push(geolevel3Info);
		});
		let geolevel3Obj = {
		text: "ALL",
		code: "ALL",
		name: "ALL",
		value: "ALL",
		};
		geolevel3.unshift(geolevel3Obj);
		dynamicFieldVal[index + 1].options = geolevel3;
		dynamicFieldVal[index].value = value;
		dynamicFieldVal[index + 1].value = "ALL";
		this.setState((prevState: any) => ({
		dynamicFields: dynamicFieldVal,
		selectedFilters: {
			...prevState.selectedFilters,
			geolevel3: "ALL",
		},
		}));
	} else if (type === "geolevel3") {
		dynamicFieldVal[index].value = value;
		this.setState({ dynamicFields: dynamicFieldVal });
	}
	};

	handleSort(e: any, columnname: string, allChannelPartners: any, isAsc: boolean) {
		this.tableCellIndex = e.currentTarget.cellIndex;
		this.onSort(columnname, allChannelPartners, isAsc);
	}

	createUserClick = () => {
		const { history } = this.props;
		if (history) history.push("./createUser");
	};
	handleSearch = (e: any) => {
		let searchText = e.target.value;
		this.setState({ searchText: searchText});
		if (this.timeOut) {
		  clearTimeout(this.timeOut);
		}
		if (searchText.length >= 3 || searchText.length === 0) {
		  this.setState({ isFiltered: true,inActiveFilter:false  });
		  this.timeOut = setTimeout(() => {
		    this.getChannelPartnersList();
		  }, 1000);
		}
	};
	generateHeader(allChannelPartners: any, isAsc: boolean) {
		let staticColumn: number = 3;
		let res = [];
		res.push(
			<th style={{ width: "9%" }} onClick={(e) => this.handleSort(e, "username", allChannelPartners, isAsc)} key="username">
				{"USER NAME"}
				{this.tableCellIndex !== undefined ? (
					this.tableCellIndex === 0 ? (
						<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i>
					) : null
				) : (
					<i className={"fas fa-sort-up ml-3"}></i>
				)}
			</th>
		);
		res.push(
			<th
				style={{ width: "10%" }}
				onClick={(e) => this.handleSort(e, "ownerphonenumber", allChannelPartners, isAsc)}
				key="ownerphonenumber"
			>
				{"MOBILE#"}
				{this.tableCellIndex === 1 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
			</th>
		);
		res.push(
			<th
				style={{ width: "12%" }}
				onClick={(e) => this.handleSort(e, "whtaccountname", allChannelPartners, isAsc)}
				key="whtaccountname"
			>
				{"STORE NAME"}
				{this.tableCellIndex === 2 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
			</th>
		);
		res.push(
			<th
				style={{ width: "12%" }}
				onClick={(e) => this.handleSort(e, "ownerfirstname", allChannelPartners, isAsc)}
				key="ownerfirstname"
			>
				{"OWNER NAME"}
				{this.tableCellIndex === 3 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null}
			</th>
		);

		for (var i = 1; i < this.state.geographicFields.length; i++) {
			if (i <= staticColumn) {
				let columnname: string = "";
				let geolevelsname: string = "";
				columnname = levelsName[i].toUpperCase();
				geolevelsname = this.state.geographicFields[i].toLowerCase();
				res.push(
					<th
						key={`geolevels` + i}
						style={{ width: "8%" }}
						onClick={(e) => this.handleSort(e, "delivery" + geolevelsname, allChannelPartners, isAsc)}
					>
						{columnname}
						{this.tableCellIndex === i + staticColumn ? (
							<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i>
						) : null}
					</th>
				);
			}
		}
		// let nextIndex: number =
		//   staticColumn + (this.state.geographicFields.length - 1);
		if (this.state.partnerType.type === 'Retailer') {
			res.push(
				<th style={{ width: "8%", cursor: "default" }} key="staff">
					{"STAFF COUNT"}
				</th>
			);
		}

		res.push(
			<th style={{ width: "10%", cursor: "default" }} key="status">
				{"STATUS"}
			</th>
		);
		res.push(
			<th style={{ width: "9%", cursor: "default" }} key="updatedBy">
				{"UPDATED BY"}
			</th>
		);
		res.push(<th style={{ width: "7%", cursor: "default" }} key="default"></th>);

		return res;
	}
	handlePartnerChange = (name: string) => {
		this.setState(
		  {
			partnerType: {
			  type: name,
			},
		  },
		  () => {
			this.getChannelPartnersList();
		  }
		);
	  };
	handleClosePopup = () => {
		this.setState({ deActivatePopup: false, staffPopup: false });
	};
	handleCloseStaffPopup = () => {
		this.setState({ deleteStaffPopup: false });
	};

	showPopup = (e: any, key: keyof States) => {
		e.stopPropagation();
		this.setState<never>({
			[key]: true,
		});
	};

	editStaff = (data: any) => {
		let passData: any = JSON.parse(JSON.stringify(data));
		let activeStatus = passData.userstatus === "INACTIVE" || passData.userstatus === "DECLINED" ? false : true;
		this.setState(
			{
				userList: passData,
				status: data.userstatus,
				activateUser: activeStatus,
				staffPopup: true,
			},
			() => {
				const userFields = this.state.userList;
				let ownerInfo = {
					errObj: {
						emailErr: "",
						firstnameErr: "",
						lastnameErr: "",
						mobilenumberErr: "",
					},
					firstname: userFields.ownerfirstname,
					active: userFields.userstatus === "ACTIVE" || userFields.userstatus === "PENDING" ? true : false,
					lastname: userFields.ownerlastname,
					mobilenumber: userFields.ownerphonenumber,
					email: userFields.owneremail,
				};

				let userDataList = this.state.userData;
				userDataList.ownerRows[0] = ownerInfo;
				let userinfo = {
					ownerRows: userDataList.ownerRows,
					countrycode: userFields.countrycode,
					locale: userFields.locale,
					rolename: userFields.rolename,
					username: userFields.username,
					shippingstreet: userFields.shippingstreet,
					shippingcity: userFields.shippingcity,
					shippingstate: userFields.shippingstate,
					shippingzipcode: userFields.shippingzipcode,
					taxid: userFields.taxid,
					whtaccountname: userFields.whtaccountname,
					whtownername: userFields.whtownername,
					billingstreet: userFields.billingstreet,
					billinggeolevel4: userFields.billinggeolevel4,
					billinggeolevel2: userFields.billinggeolevel2,
					billingzipcode: userFields.billingzipcode,
					staffdetails: userFields.staffdetails,
					iscreatedfrommobile: userFields.iscreatedfrommobile,
				};
				if (userinfo) {
					userinfo.staffdetails.forEach((staffInfo: any) => {
						let errObjd = {
							errObj: {
								emailErr: "",
								firstnameErr: "",
								lastnameErr: "",
								mobilenumberErr: "",
								isPhoneEdit: staffInfo.mobilenumber ? false : true,
							},
						};
						staffInfo = Object.assign(staffInfo, errObjd);
					});
				}
				this.setState({
					userData: userinfo,
					isStaff: userFields.storewithmultiuser,
					isRendered: true,
				});
			}
		);
	};

	submitUpdateUser = (e: any) => {
		e.target.disabled = true;
		this.setState({ isLoader: true });
		const { updateUser } = apiURL;
		let geoFields: any = {};
		this.state.dynamicFields.forEach((list: any, i: number) => {
			geoFields[list.name] = list.value;
		});
		let newUserList = JSON.parse(JSON.stringify(this.state.userData));
		let formValid = this.checkValidation();
		if (formValid) {
			if (this.state.isStaff) {
				newUserList.staffdetails.forEach((item: any, index: number) => {
					delete item.errObj;
					// item.active = item.active ? 'ACTIVE' : 'INACTIVE'
				});
			} else {
				newUserList.staffdetails = [];
				this.setState((prevState: any) => ({
					userData: {
						...prevState.userData,
						staffdetails: newUserList.staffdetails,
					},
				}));
			}
			this.setState({ isLoader: true });
			let userData = this.state.userList;

			let data = {
				countrycode: this.getStoreData.countryCode,
				ownerfirstname: newUserList.ownerRows[0].firstname,
				ownerlastname: newUserList.ownerRows[0].lastname,
				ownerphonenumber: newUserList.ownerRows[0].mobilenumber,
				owneremail: newUserList.ownerRows[0].email,
				locale: "English (Malawi)",
				usertype: userData.rolename === "Area Sales Agent" ? "INTERNAL" : "EXTERNAL",
				rolename: userData.rolename,
				username: userData.username,
				accounttype: userData.rolename,
				userstatus: newUserList.ownerRows[0].active ? "ACTIVE" : "INACTIVE",
				storewithmultiuser: this.state.isStaff ? true : false,
				iscreatedfrommobile: userData.iscreatedfrommobile,
				whtaccountname: userData.whtaccountname,
				taxid: userData.taxid,
				whtownername: userData.whtownername,
				deliverygeolevel0: this.getStoreData.countryCode,
				deliverygeolevel1: userData.deliverygeolevel1,
				deliverygeolevel2: userData.deliverygeolevel2,
				deliverygeolevel3: userData.deliverygeolevel3,
				deliverygeolevel4: userData.deliverygeolevel4,
				deliverygeolevel5: userData.deliverygeolevel5,
				deliverystreet: userData.deliverystreet,
				deliveryzipcode: userData.deliveryzipcode,
				billinggeolevel0: this.getStoreData.countryCode,
				billinggeolevel1: userData.billinggeolevel1,
				billinggeolevel2: userData.billinggeolevel2,
				billinggeolevel3: userData.billinggeolevel3,
				billinggeolevel4: userData.billinggeolevel4,
				billinggeolevel5: userData.billinggeolevel5,
				billingstreet: userData.billingstreet,
				billingzipcode: userData.billingzipcode,
				staffdetails: newUserList.staffdetails,
			};
			const userDetails = {
				isedit: true,
				lastupdatedby: this.state.userName.toUpperCase(),
				lastupdateddate: new Date().toJSON(),
			};

			invokePostAuthService(updateUser, data, userDetails)
				.then((response: any) => {
					this.setState({
						isLoader: false,
					});
					// toastSuccess("User Updated Successfully");
					Alert("success", "User Updated Successfully");
					this.handleClosePopup();
					this.getChannelPartnersList();
				})
				.catch((error: any) => {
					this.setState({ isLoader: false });
					let message = error.message;
					if (message === "Retailer with the same Mobilenumber exists") {
						message = "User with same Mobilenumber exists";
					}
					this.setState({ isRendered: true, staffPopup: false }, () => {
						// toastInfo(message);
						Alert("info", message);
					});
				});
		}
	};

	changeStatus = () => {
		const { deactivateChannelPartner, activateChannelPartner } = apiURL;
		const { username, userstatus }: any = this.state.userList;
		this.setState({ isLoader: true });
		if (userstatus === "PENDING") {
			// redirect add user page
			this.props.history.push({
				pathname: "/createUser",
				page: "validate",
				state: { userFields: this.state.userList },
			});
		} else {
			let condUrl;
			if (userstatus === "INACTIVE" || userstatus === "DECLINED") {
				condUrl = activateChannelPartner;
			} else if (userstatus === "ACTIVE") {
				condUrl = deactivateChannelPartner;
			}

			let obj: any = {};
			obj.lastupdatedby = this.state.userName.toUpperCase();
			obj.lastupdateddate = new Date().toJSON();
			obj.username = username;

			invokePostAuthService(condUrl, obj)
				.then((response: any) => {
					this.setState({
						isLoader: false,
					});
					// toastSuccess("User Status Changed Successfully");
					Alert("success", "User Status Changed Successfully");
					this.handleClosePopup();
					this.getChannelPartnersList();
				})
				.catch((error: any) => {
					this.setState({ isLoader: false });
					let message = error.message;
					Alert("warning", message);
				});
		}
	};
	editUser = (list: any) => {
		this.getCurrentUserData(list, true);
	};

	getCurrentUserData = (data: any, edit?: boolean) => {
		let passData: any = { ...data };
		let activeStatus = passData.userstatus === "INACTIVE" || passData.userstatus === "DECLINED" ? false : true;
		this.setState(
			{
				userList: passData,
				status: data.userstatus,
				activateUser: activeStatus,
			},
			() => {
				if (edit) {
					this.props.history.push({
						pathname: "/createUser",
						page: "edit",
						state: { userFields: this.state.userList },
					});
				}
			}
		);
	};

	handleChange = (idx: any, e: any, key: string, type: string, val: any) => {
		const { allChannelPartners } = this.state;
		let owners = this.state.userData.ownerRows;
		let staffs = this.state.userData.staffdetails;

		const isOwnerPhoneEists = owners.filter((items: any) => items.mobilenumber === val);
		const isStaffPhoneEists = staffs.filter((items: any) => items.mobilenumber === val);

		let allowners = allChannelPartners;
		let allstaffs = _(allowners).flatMap("staffdetails").value();

		const isOwnerPhoneEistsInDB = allowners.filter((items: any) => items.ownerphonenumber === val);
		const isStaffPhoneEistsInDB = allstaffs.filter((items: any) => items.mobilenumber === val);

		if (type === "owner") {
			let owners = this.state.userData.ownerRows;
			if (key === "phone") {
				if (val) {
					if (val.length !== phoneLength) {
						owners[idx].errObj.mobilenumberErr = `Please enter ${phoneLength} Digit`;
					} else if (
						isStaffPhoneEists.length ||
						isOwnerPhoneEists.length ||
						isOwnerPhoneEistsInDB.length ||
						isStaffPhoneEistsInDB.length
					) {
						owners[idx].errObj.mobilenumberErr = "Phone Number Exists";
					} else {
						owners[idx].errObj.mobilenumberErr = "";
					}
				} else {
					owners[idx].errObj.mobilenumberErr = "Please enter the mobile number";
				}
			} else if (e.target.name === "active") {
				owners[idx][e.target.name] = e.target.checked;
			} else {
				let { name, value } = e.target;
				owners[idx][name] = value;
			}
			this.setState((prevState: any) => ({
				userData: {
					...prevState.userData,
					ownerRows: owners,
				},
			}));
			if (e.target?.name) {
				if (e.target?.name === "firstname") {
					owners[idx].errObj.firstNameErr = owners[idx].firstname ? "" : "Please enter the First Name";
				} else if (e.target?.name === "lastname") {
					owners[idx].errObj.lastNameErr = owners[idx].lastname ? "" : "Please enter the last Name";
				}
			}
		} else if (type === "staff") {
			let staffs = this.state.userData.staffdetails;
			if (key === "phone") {
				if (val) {
					if (val.length !== phoneLength) {
						staffs[idx].errObj.mobilenumberErr = `Please enter ${phoneLength} Digit`;
					} else if (
						isStaffPhoneEists.length ||
						isOwnerPhoneEists.length ||
						isOwnerPhoneEistsInDB.length ||
						isStaffPhoneEistsInDB.length
					) {
						staffs[idx].errObj.mobilenumberErr = "Phone Number Exists";
					} else {
						staffs[idx].errObj.mobilenumberErr = "";
					}
				} else {
					staffs[idx].errObj.mobilenumberErr = "Please enter the mobile number";
				}
				staffs[idx]["mobilenumber"] = val;
			} else if (e.target.name === "active") {
				staffs[idx][e.target.name] = e.target.checked;
			} else {
				let { name, value } = e.target;
				staffs[idx][name] = value;
			}
			this.setState((prevState: any) => ({
				userData: {
					...prevState.userData,
					staffdetails: staffs,
				},
			}));
			if (e.target?.name) {
				if (e.target?.name === "firstname") {
					staffs[idx].errObj.firstNameErr = staffs[idx].firstname ? "" : "Please enter the First Name";
				} else if (e.target?.name === "lastname") {
					staffs[idx].errObj.lastNameErr = staffs[idx].lastname ? "" : "Please enter the last Name";
				}
			}
		} else {
			let datas = this.state.userData;
			let { name, value } = e.target;
			datas[name] = value;
			this.setState({ userData: datas });
		}
	};
	handleAddRow = (type: string) => {
		const item = {
			firstname: "",
			lastname: "",
			mobilenumber: "",
			email: "",
			active: true,
			errObj: {
				firstnameErr: "",
				lastnameErr: "",
				mobilenumberErr: "",
				emailErr: "",
				isPhoneEdit: true,
			},
		};
		let usersObj = this.state.userData;
		if (type === "owner") {
			usersObj.ownerRows.push(item);
			this.setState({ userData: usersObj });
		} else {
			usersObj.staffdetails.push(item);
			this.setState({ userData: usersObj });
		}
	};

	handleRemoveSpecificRow = (idx: any, type: string) => () => {
		let userObj = this.state.userData;
		if (type === "owner") {
			userObj.ownerRows.splice(idx, 1);
			this.setState({ userData: userObj });
		} else {
			userObj.staffdetails.splice(idx, 1);
			this.setState({ userData: userObj });
		}
	};
	enableStoreStaff = (e: any) => {
		let isStaff = e.target.checked;
		let userData = this.state.userData;
		if (isStaff) {
			userData.staffdetails.push({
				firstname: "",
				lastname: "",
				mobilenumber: "",
				email: "",
				active: true,
				isowner: false,
				errObj: {
					firstnameErr: "",
					lastnameErr: "",
					mobilenumberErr: "",
					emailErr: "",
					isPhoneEdit: true,
				},
			});
			this.setState((prevState: any) => ({
				isStaff: isStaff,
				userData: {
					...prevState.userData,
					staffdetails: userData.staffdetails,
				},
			}));
		} else {
			this.setState({ deleteStaffPopup: true });
		}
	};

	validateEmail = (value: any, idx: number, type: string) => {
		let ownerRows = [...this.state.userData.ownerRows];
		let staffdetails = [...this.state.userData.staffdetails];

		if (type === "staff") {
			if (patterns.emailFormat.test(value)) {
				staffdetails[idx].errObj.emailErr = "";
			} else if (value === "") {
				ownerRows[idx].errObj.emailErr = "";
			} else {
				staffdetails[idx].errObj.emailErr = "Please enter a valid email";
			}
		}
		if (type === "owner") {
			if (patterns.emailFormat.test(value)) {
				ownerRows[idx].errObj.emailErr = "";
			} else if (value === "") {
				ownerRows[idx].errObj.emailErr = "";
			} else {
				ownerRows[idx].errObj.emailErr = "Please enter a valid email";
			}
		}
		this.setState((prevState: any) => ({
			userData: {
				...prevState.userData,
				ownerRows: ownerRows,
				staffdetails: staffdetails,
			},
			isRendered: true,
		}));
	};
	checkValidation = () => {
		let formValid = true;
		let userData = this.state.userData;
		userData.ownerRows.forEach((userInfo: any, idx: number) => {
			let errObj: any = {
				firstNameErr: "",
				lastNameErr: "",
				emailErr: userInfo.errObj.emailErr,
				mobilenumberErr: userInfo.errObj.mobilenumberErr,
			};

			errObj.firstNameErr = userInfo.firstname ? "" : "Please enter the First Name";
			errObj.lastNameErr = userInfo.lastname ? "" : "Please enter the last Name";

			if (userInfo.mobilenumber && errObj.mobilenumberErr !== "Phone Number Exists") {
				errObj.mobilenumberErr = userInfo.mobilenumber.length === phoneLength ? "" : `Please enter ${phoneLength} Digit`;
			} else {
				errObj.mobilenumberErr =
					errObj.mobilenumberErr === "Phone Number Exists" ? errObj.mobilenumberErr : "Please enter the mobile number";
			}

			userData.ownerRows[idx].errObj = errObj;
			if (
				errObj.firstNameErr !== "" ||
				errObj.lastNameErr !== "" ||
				errObj.mobilenumberErr !== "" ||
				errObj.emailErr !== ""
			) {
				formValid = false;
			}
			this.setState((prevState: any) => ({
				userData: {
					...prevState.userData,
					ownerRows: userData.ownerRows,
				},
			}));
		});

		userData.staffdetails?.forEach((userInfo: any, idx: number) => {
			let errObj: any = {
				firstNameErr: "",
				lastNameErr: "",
				emailErr: userInfo.errObj.emailErr,
				mobilenumberErr: userInfo.errObj.mobilenumberErr,
				isPhoneEdit: userInfo.errObj.isPhoneEdit ? true : false,
			};
			errObj.firstNameErr = userInfo.firstname ? "" : "Please enter the First Name";
			errObj.lastNameErr = userInfo.lastname ? "" : "Please enter the last Name";

			if (userInfo.mobilenumber && errObj.mobilenumberErr !== "Phone Number Exists") {
				errObj.mobilenumberErr = userInfo.mobilenumber.length === phoneLength ? "" : `Please enter ${phoneLength} Digit`;
			} else {
				errObj.mobilenumberErr =
					errObj.mobilenumberErr === "Phone Number Exists" ? errObj.mobilenumberErr : "Please enter the mobile number";
			}

			userData.staffdetails[idx].errObj = errObj;
			if (
				errObj.firstNameErr !== "" ||
				errObj.lastNameErr !== "" ||
				errObj.mobilenumberErr !== "" ||
				errObj.emailErr !== ""
			) {
				formValid = false;
			}
			this.setState((prevState: any) => ({
				userData: {
					...prevState.userData,
					staffdetails: userData.staffdetails,
				},
			}));
		});
		return formValid;
	};

	deleteStaff = () => {
		let userData = this.state.userData;
		userData.staffdetails = [];
		this.setState((prevState: any) => ({
			isStaff: false,
			userData: {
				...prevState.userData,
				staffdetails: userData.staffdetails,
			},
			deleteStaffPopup: false,
		}));
	};
	handleDateChange = (date: any, name: string) => {
		let val = this.state.selectedFilters;
		// to date
		if (name === "lastmodifieddateto") {
			if (date >= val.lastmodifieddatefrom) {
				this.setState({
					dateErrMsg: "",
				});
			} else if (date <= val.lastmodifieddatefrom) {
				this.setState({
					dateErrMsg: "End Date should be greater than Start Date",
				});
			} else {
				this.setState({
					dateErrMsg: "Start Date should be lesser than  End Date",
				});
			}
		}
		// from date
		if (name === "lastmodifieddatefrom") {
			if (date <= val.lastmodifieddateto) {
				this.setState({
					dateErrMsg: "",
				});
			} else if (date >= val.lastmodifieddateto) {
				this.setState({
					dateErrMsg: "Start Date should be lesser than End Date",
				});
			} else {
				this.setState({
					dateErrMsg: "Start Date should be greater than  End Date",
				});
			}
		}

		this.setState({
			selectedFilters: { ...this.state.selectedFilters, [name]: date },
		});
	};
	
	handleUpdateDropdown = (value: string, label: any) => {
		this.setState((prevState: any) => ({
		  selectedFilters: {
			...prevState.selectedFilters,
			[label.toLocaleLowerCase()]: value,
		  },
		}));
	  };

	
	onSort = (name: string, data: any, isAsc: boolean) => {
		let response = sortBy(name, data);
		this.setState({ allChannelPartners: response, isAsc: !isAsc });
	  };
	  applyFilter = () => {
		if(this.state.dateErrMsg === ''){
		  this.setState({ isFiltered: true,inActiveFilter:false }, () => {
			this.getChannelPartnersList();
			this.closeToggle();
		  });
		}
	  };
	 
	  resetFilter = (e: any) => {
		e.stopPropagation();
		this.getDynamicOptionFields("reset");
		this.setState(
		  {
			selectedFilters: {
			  geolevel1: "ALL",
			  geolevel2: "ALL",
			  geolevel3: "ALL",
			  status: "ALL",
			  lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
			  lastmodifieddateto: new Date(),
			},
			isFiltered: false,
			dateErrMsg: ""
		  },
		  () => {
			
		  }
		);
		
	  };

	  
	render() {

		const {totalData, isAsc,isLoader, selectedFilters, userList, userData, isStaff, dateErrMsg,allChannelPartners } = this.state;

		let data: any = getLocalStorageData("userData");
		let loggedUserInfo = JSON.parse(data);
		let countryCodeLower = loggedUserInfo?.countrycode && _.toLower(loggedUserInfo.countrycode);

		const fields = this.state.dynamicFields;
		const locationList = fields?.map((list: any, index: number) => {
		  let nameCapitalized =
			levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
		  return (
			<React.Fragment key={`geolevels` + index}>
			  <div className="country" style={{ marginBottom: "5px" }}>
				{index !== 0 && (
				  <div>
					{list.name !== "geolevel4" && list.name !== "geolevel5" && (
					  <NativeDropdown
						name={list.name}
						label={nameCapitalized}
						options={list.options}
						handleChange={(e: any) => {
						  e.stopPropagation();
						  list.value = e.target.value;
						  this.getOptionLists(
							"manual",
							list.name,
							e.target.value,
							index
						  );
						  this.handleUpdateDropdown(e.target.value, list.name);
						}}
						value={list.value}
						id="geolevel-test"
						dataTestId="geolevel-test"
					  />
					)}
				  </div>
				)}
			  </div>
			</React.Fragment>
		  );
		});
		return (
			<AUX>
				{isLoader && <Loader />}
				<Filter
					handleSearch={this.handleSearch}
					searchText={this.state.searchText}
					partnerTypeList={this.state.list}
					selectedPartnerType={this.state.partnerType}
					handlePartnerChange={this.handlePartnerChange}
					toolTipText="Search applicable for User Name, Account Name and Owner Name"
					onClose={(node: any) => {
						this.closeToggle = node;
					}}
				>
					<div onClick={(e) => e.stopPropagation()}>
						<label className="font-weight-bold">Status</label>
						<div className="pt-1">
							{this.state.userStatus.map((item, index) => (
								<span className="mr-2" key={`status` + index}>
									<Button
										color={selectedFilters.status === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"}
										size="sm"
										onClick={(e) => this.handleFilterChange(e, "status", item)}
									>
										{item}
									</Button>
								</span>
							))}
						</div>
					</div>
					<div className="form-group">{locationList}</div>
					<label className="font-weight-bold pt-2" htmlFor="update-date">
						Last Modified Date
					</label>
					<div className="d-flex">
						<div className="user-filter-date-picker">
							<DatePicker
								id="update-date"
								value={selectedFilters.lastmodifieddatefrom}
								dateFormat="dd-MM-yyyy"
								customInput={<DateInput ref={ref} />}
								selected={selectedFilters.lastmodifieddatefrom}
								onChange={(date: any) => this.handleDateChange(date, "lastmodifieddatefrom")}
								showMonthDropdown
								showYearDropdown
								dropdownMode="select"
								maxDate={new Date()}
							/>
						</div>
						<div className="p-2">-</div>
						<div className="user-filter-date-picker">
							<DatePicker
								value={selectedFilters.lastmodifieddateto}
								dateFormat="dd-MM-yyyy"
								customInput={<DateInput ref={ref} />}
								selected={selectedFilters.lastmodifieddateto}
								onChange={(date: any) => this.handleDateChange(date, "lastmodifieddateto")}
								showMonthDropdown
								showYearDropdown
								dropdownMode="select"
								maxDate={new Date()}
							/>
						</div>
					</div>
					{dateErrMsg && (
                                <span className="error">{dateErrMsg} </span>
                              )}

					<div className="filterFooter pt-3">
						<button
							className="cus-btn-user-filter reset"
							  onClick={(e) => this.resetFilter(e)}
						>
							Reset All
						</button>
						<button
							className="cus-btn-user-filter"
							  onClick={this.applyFilter}
						>
							Apply
							<span>
								<img src={ArrowIcon} alt="" className="arrow-i" /> <img src={RtButton} alt="" className="layout" />
							</span>
						</button>
					</div>
				</Filter>
				{this.state.deleteStaffPopup ? (
					<AdminPopup open={this.state.deleteStaffPopup} onClose={this.handleCloseStaffPopup} maxWidth={"600px"}>
						<DialogContent>
							<div className="popup-container">
								<div className="popup-content">
									<div className={`popup-title`}></div>
								</div>
								<div style={{ textAlign: "center" }}>
									<label style={{ fontSize: "16px", marginTop: "11px" }}>
										Are you sure you want to delete store's staff?
									</label>
								</div>
								<DialogActions>
									<MuiButton
										autoFocus
										onClick={this.handleCloseStaffPopup}
										className="admin-popup-btn close-btn"
										style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329", borderRadius: "50px" }}
									>
										Cancel
									</MuiButton>
									<MuiButton
										onClick={this.deleteStaff}
										className="admin-popup-btn delete"
										autoFocus
										style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329", borderRadius: "50px" }}
									>
										DELETE
									</MuiButton>
								</DialogActions>
							</div>
						</DialogContent>
					</AdminPopup>
				) : (
					""
				)}
				{this.state.deActivatePopup ? (
					<AdminPopup open={this.state.deActivatePopup} onClose={this.handleClosePopup} maxWidth={"600px"}>
						<DialogContent>
							<div className="popup-container">
								<div className="popup-content">
									<div className={`popup-title`}>
										<p>
											{_.startCase(_.toLower(userList?.whtaccountname)) || ""},{" "}
											<label>{_.startCase(_.toLower(userList?.rolename))}</label>{" "}
										</p>
									</div>
								</div>
								<div style={{ textAlign: "center" }}>
									<label>
										{userList.userstatus === "ACTIVE" ||
										userList.userstatus === "INACTIVE" ||
										userList.userstatus === "DECLINED" ? (
											<span>
												Are you sure you want to change &nbsp;
												<strong>
													{_.startCase(_.toLower(userList?.whtownername))} -{" "}
													{_.startCase(_.toLower(userList?.whtaccountname))}
												</strong>
												&nbsp; account to
												{userList.userstatus === "ACTIVE" ? (
													<span> Inactive </span>
												) : userList.userstatus === "INACTIVE" || userList.userstatus === "DECLINED" ? (
													<span> active</span>
												) : (
													""
												)}
												?
											</span>
										) : userList.userstatus === "PENDING" ? (
											<span>
												Would you like to validate & approve&nbsp;
												<strong>
													{_.startCase(_.toLower(userList?.whtownername))} -{" "}
													{_.startCase(_.toLower(userList?.whtaccountname))}
												</strong>
												&nbsp;account to use Bayer Rewards mobile application?
											</span>
										) : (
											""
										)}
									</label>
								</div>
								<DialogActions>
									<MuiButton
										autoFocus
										onClick={this.handleClosePopup}
										className="admin-popup-btn close-btn"
										style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329", borderRadius: "50px" }}
									>
										Cancel
									</MuiButton>
									<MuiButton
										onClick={this.changeStatus}
										className="admin-popup-btn filter-scan"
										autoFocus
										style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329", borderRadius: "50px" }}
									>
										{userList.userstatus === "ACTIVE" ||
										userList.userstatus === "INACTIVE" ||
										userList.userstatus === "DECLINED"
											? "Change"
											: userList.userstatus === "PENDING"
											? "Validate & Approve"
											: ""}
									</MuiButton>
								</DialogActions>
							</div>
						</DialogContent>
					</AdminPopup>
				) : (
					""
				)}
				{this.state.staffPopup ? (
					<AdminPopup open={this.state.staffPopup} onClose={this.handleClosePopup} maxWidth={"1300px"}>
						<DialogContent>
							{isLoader && <Loader />}
							<div className="popup-container">
								<div className="popup-content">
									<div className={`popup-title`}>
										<p>
											{_.startCase(_.toLower(userList?.whtaccountname)) || ""},{" "}
											<label>{_.startCase(_.toLower(userList?.rolename))}</label>{" "}
										</p>
									</div>
									<>
										<div className="personal">
											<>
												<div
													className="row"
													style={{
														display: "flex",
														alignItems: "center",
														marginTop: "8px",
													}}
												>
													<div className="col-sm-3" style={{ marginLeft: "46px" }}>
														<label className="font-weight-bold">
															Has store staff?(Max 4)
															<input
																type="checkbox"
																style={{ marginLeft: "10px" }}
																checked={isStaff}
																onChange={(e: any) => {
																	this.enableStoreStaff(e);
																}}
																disabled={this.state.userList?.storewithmultiuser ? true : false}
															/>
															<span className="checkmark"></span>
														</label>
													</div>
												</div>
												<div
													style={{
														maxHeight: "280px",
														overflowY: "auto",
														overflowX: "hidden",
													}}
												>
													<div style={{ marginLeft: "35px" }}>
														{/* <Table borderless> */}
														<table className="table table-borderless">
															<thead>
																<tr>
																	<th>Type</th>
																	<th>First Name</th>
																	<th>Last Name</th>
																	<th>Mobile Number</th>
																	<th>Email(Optional)</th>
																	<th>Active?</th>
																</tr>
															</thead>
															<tbody>
																{userData.ownerRows?.map((item: any, idx: number) => (
																	<tr key={`ownerRows` + idx}>
																		{idx === 0 ? <td className="font-weight-bold">Owner</td> : <td>{null}</td>}
																		<td>
																			<Input
																				type="text"
																				className="form-control"
																				name="firstname"
																				placeHolder="Eg: Keanu"
																				value={item.firstname}
																				onChange={(e: any) => this.handleChange(idx, e, "", "owner", "")}
																				onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
																			/>
																			{item.errObj?.firstNameErr && (
																				<span className="error">{item.errObj.firstNameErr} </span>
																			)}
																		</td>
																		<td>
																			<Input
																				type="text"
																				className="form-control"
																				name="lastname"
																				placeHolder="Eg: Reeves"
																				value={item.lastname}
																				onChange={(e: any) => this.handleChange(idx, e, "", "owner", "")}
																				onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
																			/>
																			{item.errObj?.lastNameErr && <span className="error">{item.errObj.lastNameErr} </span>}
																		</td>
																		<td>
																			<div style={{ display: "flex" }}>
																				<div className="flagInput">
																					<PhoneInput
																						placeholder="Mobile Number"
																						inputProps={{
																							name: "mobilenumber",
																							required: true,
																							maxLength:
																								process.env.REACT_APP_STAGE === "dev" ||
																								process.env.REACT_APP_STAGE === "int"
																									? 12
																									: 11,
																						}}
																						country={countryCodeLower}
																						value={item.mobilenumber}
																						disabled={true}
																						onChange={(value, e) => this.handleChange(idx, e, "phone", "owner", value)}
																						onlyCountries={[countryCodeLower]}
																						autoFormat
																						disableDropdown
																						disableCountryCode
																					/>
																					{item.errObj?.mobilenumberErr && (
																						<span className="error">{item.errObj.mobilenumberErr} </span>
																					)}
																				</div>
																			</div>
																		</td>
																		<td>
																			<Input
																				type="text"
																				className="form-control"
																				name="email"
																				placeHolder="Eg: abc@mail.com"
																				value={item.email}
																				onChange={(e: any) => this.handleChange(idx, e, "", "owner", "")}
																				onKeyUp={(e: any) => this.validateEmail(e.target.value, idx, "owner")}
																			/>
																			{item.errObj?.emailErr && <span className="error">{item.errObj.emailErr} </span>}
																		</td>
																		<td
																			style={{
																				display: "flex",
																			}}
																		>
																			<div>
																				<CustomSwitch
																					checked={item.active}
																					onChange={(e: any) => this.handleChange(idx, e, "", "owner", "")}
																					name="active"
																				/>
																			</div>
																			<div style={{ visibility: "hidden" }}>
																				{idx === userData.ownerRows.length - 1 && userData.ownerRows.length < 4 ? (
																					(() => {
																						if (idx === 0 && idx === userData.ownerRows.length - 1) {
																							return (
																								<div>
																									<img
																										style={{
																											width: "50px",
																											height: "50px",
																										}}
																										src={AddBtn}
																										alt=""
																										onClick={() => this.handleAddRow("owner")}
																									/>
																								</div>
																							);
																						} else if (idx > 0 && idx === userData.ownerRows.length - 1) {
																							return (
																								<div>
																									<img
																										style={{
																											width: "50px",
																											height: "50px",
																											display: !this.state.userList?.storewithmultiuser ? "block" : "none",
																										}}
																										src={RemoveBtn}
																										alt=""
																										onClick={this.handleRemoveSpecificRow(idx, "owner")}
																									/>
																									<img
																										style={{
																											width: "50px",
																											height: "50px",
																										}}
																										src={AddBtn}
																										alt=""
																										onClick={() => this.handleAddRow("owner")}
																									/>
																								</div>
																							);
																						}
																					})()
																				) : (
																					<img
																						style={{
																							width: "50px",
																							height: "50px",
																							display: !this.state.userList?.storewithmultiuser ? "block" : "none",
																						}}
																						src={RemoveBtn}
																						alt=""
																						onClick={this.handleRemoveSpecificRow(idx, "owner")}
																					/>
																				)}
																			</div>
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													</div>
													<div style={{ marginTop: "-10px" }}>{isStaff ? <hr /> : <></>}</div>
													<div style={{ marginRight: "0px", marginLeft: "35px" }}>
														<table className="table table-borderless">
															<thead style={{ display: "none" }}>
																<tr>
																	<th>Type</th>
																	<th>First Name</th>
																	<th>Last Name</th>
																	<th>Mobile Number</th>
																	<th>Email(Optional)</th>
																	<th>Active?</th>
																</tr>
															</thead>
															<tbody>
																{isStaff &&
																	userData.staffdetails?.map((item: any, staffidx: number) => (
																		<tr key={`staffRows` + staffidx}>
																			{staffidx === 0 ? (
																				<td className="font-weight-bold">
																					Store <br />
																					Staffs
																				</td>
																			) : (
																				<td>{null}</td>
																			)}
																			<td>
																				<Input
																					type="text"
																					className="form-control"
																					name="firstname"
																					placeHolder="Eg: Keanu"
																					value={item.firstname}
																					onChange={(e: any) => this.handleChange(staffidx, e, "", "staff", "")}
																					onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
																				/>
																				{item.errObj.firstNameErr && (
																					<span className="error">{item.errObj.firstNameErr} </span>
																				)}
																			</td>
																			<td>
																				<Input
																					type="text"
																					className="form-control"
																					name="lastname"
																					placeHolder="Eg: Reeves"
																					value={item.lastname}
																					onChange={(e: any) => this.handleChange(staffidx, e, "", "staff", "")}
																					onKeyPress={(e: any) => allowAlphabetsNumbers(e)}
																				/>
																				{item.errObj.lastNameErr && (
																					<span className="error">{item.errObj.lastNameErr} </span>
																				)}
																			</td>
																			<td>
																				<div style={{ display: "flex" }}>
																					<div className="flagInput">
																						<PhoneInput
																							placeholder="Mobile Number"
																							inputProps={{
																								name: "mobilenumber",
																								required: true,
																								maxLength:
																									process.env.REACT_APP_STAGE === "dev" ||
																									process.env.REACT_APP_STAGE === "int"
																										? 12
																										: 11,
																							}}
																							country={countryCodeLower}
																							value={item.mobilenumber}
																							disabled={!item.errObj.isPhoneEdit ? true : false}
																							onChange={(value, e) =>
																								this.handleChange(staffidx, e, "phone", "staff", value)
																							}
																							onlyCountries={[countryCodeLower]}
																							autoFormat
																							disableDropdown
																							disableCountryCode
																						/>
																						{item.errObj.mobilenumberErr && (
																							<span className="error">{item.errObj.mobilenumberErr} </span>
																						)}
																					</div>
																				</div>
																			</td>
																			<td>
																				<Input
																					type="text"
																					className="form-control"
																					name="email"
																					placeHolder="Eg.abc@mail.com"
																					value={item.email}
																					onChange={(e: any) => this.handleChange(staffidx, e, "", "staff", "")}
																					onKeyUp={(e: any) => this.validateEmail(e.target.value, staffidx, "staff")}
																				/>
																				{item.errObj.emailErr && <span className="error">{item.errObj.emailErr} </span>}
																			</td>
																			<td
																				style={{
																					display: "flex",
																				}}
																			>
																				<div>
																					<CustomSwitch
																						checked={userData.ownerRows[0].active ? item.active : false}
																						onChange={(e: any) => this.handleChange(staffidx, e, "", "staff", "")}
																						name="active"
																					/>
																				</div>
																				<div>
																					{/* {idx ===
                                              userData.staffdetails.length -
                                                1 &&
                                            userData.staffdetails.length < 4 ? (
                                              <img
                                                style={{
                                                  width: "50px",
                                                  height: "50px",
                                                }}
                                                src={AddBtn}
                                                onClick={() =>
                                                  this.handleAddRow("staff")
                                                }
                                              />
                                            ) : (
                                              <img
                                                style={{
                                                  width: "50px",
                                                  height: "50px",
                                                }}
                                                src={RemoveBtn}
                                                onClick={this.handleRemoveSpecificRow(
                                                  idx,
                                                  "staff"
                                                )}
                                              />
                                            )} */}

																					{staffidx === userData.staffdetails.length - 1 &&
																					userData.staffdetails.length < 4 ? (
																						(() => {
																							if (staffidx === 0 && staffidx === userData.staffdetails.length - 1) {
																								return (
																									<div>
																										<img
																											style={{
																												width: "50px",
																												height: "50px",
																											}}
																											src={AddBtn}
																											alt=""
																											onClick={() => this.handleAddRow("staff")}
																										/>
																									</div>
																								);
																							} else if (staffidx > 0 && staffidx === userData.staffdetails.length - 1) {
																								return (
																									<div>
																										<img
																											style={{
																												width: "50px",
																												height: "50px",
																												display: !this.state.userList?.storewithmultiuser ? "block" : "none",
																											}}
																											src={RemoveBtn}
																											alt=""
																											onClick={this.handleRemoveSpecificRow(staffidx, "staff")}
																										/>
																										<img
																											style={{
																												width: "50px",
																												height: "50px",
																											}}
																											src={AddBtn}
																											alt=""
																											onClick={() => this.handleAddRow("staff")}
																										/>
																									</div>
																								);
																							}
																						})()
																					) : (
																						<img
																							style={{
																								width: "50px",
																								height: "50px",
																								display: !this.state.userList?.storewithmultiuser ? "block" : "none",
																							}}
																							src={RemoveBtn}
																							alt=""
																							onClick={this.handleRemoveSpecificRow(staffidx, "staff")}
																						/>
																					)}
																				</div>
																			</td>
																		</tr>
																	))}
															</tbody>
														</table>
													</div>
												</div>
											</>
										</div>
									</>
								</div>
								<div></div>
								<DialogActions>
									<button
										onClick={this.handleClosePopup}
										className="cus-btn-user reset buttonStyle"
										style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329", borderRadius: "50px" }}
									>
										Cancel
									</button>
									<button
										onClick={(e: any) => {
											this.submitUpdateUser(e);
										}}
										className="cus-btn-user buttonStyle"
										style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329", borderRadius: "50px" }}
									>
										Update
										<span className="staffcount">
											<img src={ArrowIcon} alt="" className="arrow-i" /> <img src={RtButton} alt="" className="layout" />
										</span>
									</button>
								</DialogActions>
							</div>
						</DialogContent>
					</AdminPopup>
				) : (
					""
				)}

				<div className="user-table">
					<table>
						<thead>
							<tr>{this.generateHeader(allChannelPartners, isAsc)}</tr>
						</thead>
						<tbody>
							{allChannelPartners?.length > 0 ? (
								allChannelPartners?.map((list: any, i: number) => {
									return (
										<AUX key={`channelpartners` + i}>
											<tr
												// style={
												// 	list.userstatus === "ACTIVE"
												// 		? { borderLeft: "8px solid #89D329" }
												// 		: list.userstatus === "INACTIVE"
												// 		? { borderLeft: "8px solid #FF0000" }
												// 		: list.userstatus === "PENDING"
												// 		? { borderLeft: "8px solid #FFB43C" }
												// 		: { borderLeft: "8px solid #FF0000" }
												// }
											>
												<td style={{  }}>{list.username}</td>
												<td style={{  }}>{list.ownerphonenumber} </td>
												<td style={{ textAlign: "left"}}>{_.startCase(_.toLower(list.whtaccountname))} </td>
												<td style={{ textAlign: "left"}}>
													{_.startCase(_.toLower(list.ownerfirstname)) + " " + _.startCase(_.toLower(list.ownerlastname))}{" "}
												</td>
												<td style={{ textAlign: "left" }}>{list.deliverygeolevel1} </td>
												<td style={{ textAlign: "left" }}>{list.deliverygeolevel2}</td>
												<td style={{ textAlign: "left" }}>{list.deliverygeolevel3} </td>
												{ this.state.partnerType.type === 'Retailer' && 
												<td style={{ textAlign: "center" }}>
													<div className="retailer-id">
														<p>
															{list.staffdetails?.length}
															<img
																data-testid="expand-window"
																className="retailer-icon"
																style={{
																	cursor:
																		list.userstatus === "DECLINED" || list.userstatus === "PENDING" ? "default" : "pointer",
																}}
																alt="expand-window"
																onClick={(event) => {
																	list.userstatus === "DECLINED" || list.userstatus === "PENDING"
																		? event.preventDefault()
																		: this.editStaff(list);
																}}
																src={ExpandWindowImg}
															></img>
														</p>
													</div>
												</td> 
												}
												<td >
													<span
														onClick={(event: any) => {
															this.showPopup(event, "deActivatePopup");
															this.getCurrentUserData(list);
														}}
														className={`status ${
															list.userstatus === "ACTIVE"
																? "active"
																: list.userstatus === "INACTIVE"
																? "inactive"
																: list.userstatus === "PENDING"
																? "pending"
																: list.userstatus === "DECLINED"
																? "declined"
																: ""
														}`}
														style={{ fontStyle: "12px", height: "30px" }}
													>
														<img
															style={{ marginRight: "6px" }}
															alt=""
															src={
																list.userstatus === "ACTIVE"
																	? Check
																	: list.userstatus === "INACTIVE"
																	? Cancel
																	: list.userstatus === "PENDING"
																	? NotActivated
																	: list.userstatus === "DECLINED"
																	? NotActivated
																	: ""
															}
															width="17"
														/>
														{_.startCase(_.toLower(list.userstatus))}
													</span>
												</td>
												<td style={{ textAlign: "center"}}>{list.lastupdatedby}</td>
												<td >
												{ this.state.partnerType.type === 'Retailer' && 
													<img
														data-testid="edit-icon"
														aria-label="edit-icon"
														className="edit"
														style={{
															cursor:
																list.userstatus === "DECLINED" || list.userstatus === "PENDING" ? "default" : "pointer",
														}}
														src={list.userstatus === "DECLINED" || list.userstatus === "PENDING" ? EditDisabled : Edit}
														alt="edit-icon"
														width="20"
														onClick={(event) => {
															list.userstatus === "DECLINED" || list.userstatus === "PENDING"
																? event.preventDefault()
																: this.editUser(list);
														}}
													/> }
													{list.iscreatedfrommobile && <img src={blackmockup} alt="" width="20" height="25" />}
												</td>
											</tr>
										</AUX>
									);
								})
							) : (
								<tr style={{ height: "250px" }}>
									<td colSpan={10} className="no-records">
										No records found
									</td>
								</tr>
							)}
						</tbody>
					</table>
					<div className="add-plus-icon" onClick={() => this.createUserClick()}>
						<img data-testid="floating-add" src={AddBtn} alt={NoImage} />
					</div>
				</div>
				<div>
						<Pagination
							totalData={totalData}
							data={allChannelPartners}
							totalLabel={"Users"}
							getRecords={this.getChannelPartnersList}
							onRef={(node:any)=>{
								this.paginationRef= node;
							}}
						/>
					</div>
			</AUX>
		);
	}
}

export default withRouter(ChannelPartners);
