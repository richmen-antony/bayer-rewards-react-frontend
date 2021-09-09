import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import "../../assets/scss/scanLogs.scss";
import Loader from "../../utility/widgets/loader";
import Pagination from "../../utility/widgets/pagination";
import moment from "moment";
import SimpleDialog from "../../container/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import NoImage from "../../assets/images/Group_4736.svg";
import OrderTable from "./Order";
import ExpandWindowImg from "../../assets/images/expand-window.svg";
import CalenderIcon from "../../assets/icons/calendar.svg";
import { sortBy } from "../../utility/base/utils/tableSort";
import { Button } from "reactstrap";
import _ from "lodash";
import { downloadCsvFile, ErrorMsg } from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import { invokeGetAuthService } from "../../utility/base/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import { getLocalStorageData } from "../../utility/base/localStore";
import { CustomButton } from "../../utility/widgets/button";
import Filter from "../../container/grid/Filter";
import { Alert } from "../../utility/widgets/toaster";
import ReactSelect from "../../utility/widgets/dropdown/ReactSelect";
import ConsolidatedScans from "../consolidatedScans";

type PartnerTypes = {
	type: String;
};

interface IProps {
	onChange?: any;
	placeholder?: any;
	value?: any;
	id?: any;
	onClick?: any;
	// any other props that come into the component
}

const ref = React.createRef();
const Input = React.forwardRef(({ onChange, placeholder, value, id, onClick }: IProps, ref: any) => (
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

const popupHeader = {
	title: "Maria Joseph",
	sub: "Retailer",
};

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
		// boxShadow: "0px 3px 6px #c7c7c729",
		// border: "1px solid #89D329",
		// borderRadius: "50px",
	},
	// button: {
	//   boxShadow: "0px 3px 6px #c7c7c729",
	//   border: "1px solid #89D329",
	//   borderRadius: "50px",
	// },
}))(MuiDialogActions);

type Props = {};

type States = {
	showPopup: boolean;
	showProductPopup: boolean;
	[key: string]: any;
	isAsc: Boolean;
	partnerType: PartnerTypes;
};

let levelsName: any = [];
/**
 * SendGoods Class Component
 * @param props
 * @param states
 */
class SendGoods extends Component<Props, States> {
	tableCellIndex: any;
	timeOut: any;
	paginationRef: any;
	closeToggle: any;
	constructor(props: any) {
		super(props);
		this.state = {
			showPopup: false,
			showProductPopup: false,
			isAsc: true,
			selectIndex: "",
			isRendered: false,
			allScanLogs: [],
			actions: ["All", "Distributor", "Retailer"],
			dropDownValue: "Select action",
			scanType: ["All", "Send Goods", "Receive Goods", "Sell to Farmers"],
			productCategories: ["ALL", "HYBRID", "CORN SEED", "HERBICIDES", "FUNGICIDES", "INSECTICIDES"],
			status: ["ALL", "VALID", "INVALID"],
			// status: ["ALL", "FULFILLED", "EXPIRED", "DUPLICATE"],
			list: ["ALL", "Distributor", "Retailer"],
			selectedFilters: {
				productgroup: "ALL",
				scanstatus: "ALL",
				ordereddatefrom: new Date().setDate(new Date().getDate() - 30),
				ordereddateto: new Date(),
				retailer: "ALL",
				partnerType: "Retailers",
				scannedPeriod: "",
				scandatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
				scandateto: moment(new Date()).format("YYYY-MM-DD"),
				batchno: "ALL",
				soldtoid: "ALL",
			},
			dateErrMsg: "",
			searchText: "",
			totalData: 0,
			isFiltered: false,
			userRole: "",
			tooltipOpen: false,
			isLoader: false,
			dropdownOpenFilter: false,
			accordionView: false,
			accordionId: "",
			// value: 0,
			value: moment(),
			lastUpdatedDateErr: "",
			farmerOptions: [],
			retailerOptions: [],
			loggedUserInfo: {},
			inActiveFilter: false,
			partnerTypeList: ["Distributors"],
			partnerType: {
				type: "Distributors",
			},
			scannedPeriodsList: [
				{ label: "Today", from: moment(new Date()).format("YYYY-MM-DD"), to: moment(new Date()).format("YYYY-MM-DD") },
				{
					label: "This week (Sun - Sat)",
					from: moment().startOf("week").format("YYYY-MM-DD"),
					to: moment().endOf("week").format("YYYY-MM-DD"),
				},
				{
					label: "Last 30 days",
					from: moment().subtract(30, "days").format("YYYY-MM-DD"),
					to: moment(new Date()).format("YYYY-MM-DD"),
				},
				{
					label: "This year (Jan - Dec)",
					from: moment().startOf("year").format("YYYY-MM-DD"),
					to: moment().endOf("year").format("YYYY-MM-DD"),
				},
				{
					label: "Prev. year (Jan - Dec)",
					from: moment().subtract(1, "years").startOf("year").format("YYYY-MM-DD"),
					to: moment().subtract(1, "years").endOf("year").format("YYYY-MM-DD"),
				},
				{ label: "Custom", value: "" },
			],
			scanTypeList: ["SG - ST", "SG - D2R"],
			selectedScanType: "SG - ST",
			activeSortKeyIcon: "labelid",
		};
		this.timeOut = 0;
	}
	componentDidMount() {
		let data: any = getLocalStorageData("userData");
		let userData = JSON.parse(data);
		this.setState(
			{
				loggedUserInfo: userData,
			},
			() => {
				this.getScanLogs();
				//API to get country and language settings
				this.getCountryList();
				this.getHierarchyDatas();
				this.getBatchList();
				this.getPartnerList();
			}
		);
	}
	getCountryList() {
		let res = [
			{ value: "India", label: "India" },
			{ value: "Malawi", label: "Malawi" },
		];
		this.setState({ countryList: res });
	}

	getScanLogs = (defaultPageNo?: any) => {
		const { getScanLog } = apiURL;
		const { state, setDefaultPage } = this.paginationRef;
		const pageNo = !defaultPageNo ? 1 : state.pageNo;

		// set default pagination number 1 and  call the method
		if (!defaultPageNo) {
			setDefaultPage();
		}
		this.setState({ isLoader: true });
		const { selectedFilters, isFiltered, selectedScanType } = this.state;
		let data = {
			page: pageNo,
			searchtext: this.state.searchText || null,
			rowsperpage: state.rowsPerPage,
			isfiltered: this.state.isFiltered,
			countrycode: this.state.loggedUserInfo?.countrycode,
			scantype: selectedScanType === "SG - ST" ? "SCAN_OUT_ST_D2D" : "SCAN_OUT_D2R",
			soldbyrole: "DISTRIBUTOR",
			soldbygeolevel1: this.state.loggedUserInfo?.role ==="ADMIN" ? null:this.state.loggedUserInfo?.geolevel1,
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			let startDate = filter.scannedPeriod === "Custom" ? filter.ordereddatefrom : filter.scannedPeriod==="" ?null:filter.scandatefrom;
			let endDate = filter.scannedPeriod === "Custom" ? filter.ordereddateto : filter.scannedPeriod==="" ?null:filter.scandateto;
			filter.scandatefrom =  startDate ?moment(startDate).format("YYYY-MM-DD") :null;
			filter.scandateto = endDate?moment(endDate).format("YYYY-MM-DD"):null;
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.scanstatus = filter.scanstatus === "ALL" ? null : filter.scanstatus;
			filter.soldbygeolevel1 = filter.geolevel1 === "ALL" ? null : filter.geolevel1 || data.soldbygeolevel1;
			filter.soldbygeolevel2 = filter.geolevel2 === "ALL" ? null : filter.geolevel2;
			filter.batchno = filter.batchno === "ALL" ? null : filter.batchno;
			filter.soldtoid = filter.soldtoid === "ALL" ? null : filter.soldtoid;
			filter.partnerType = null;
			filter.scannedPeriod = null;
			filter.ordereddatefrom = null;
			filter.ordereddateto = null;
			filter.geolevel1 = null;
			filter.geolevel2 = null;
			data = { ...data, ...filter };
		}

		invokeGetAuthService(getScanLog, data)
			.then((response) => {
				let data = response?.body && Object.keys(response?.body).length !== 0 ? response.body.rows : [];
				this.setState({
					isLoader: false,
					allScanLogs: data,
				});
				const total = response?.totalrows;
				this.setState({ totalData: Number(total) });
			})
			.catch((error) => {
				this.setState({ isLoader: false, allScanLogs: [] }, () => {});
				ErrorMsg(error);
			});
	};

	handleClosePopup = () => {
		this.setState({ showPopup: false });
	};

	showPopup = (e: any, key: keyof States) => {
		e.stopPropagation();
		this.setState<never>({
			[key]: true,
		});
	};
	handleCloseProductPopup = () => {
		this.setState({ showProductPopup: false });
	};
	updateOrderData = (value: any) => {
		this.setState({
			orderData: value,
		});
	};
	handleUpdateRetailer(value: any, name: string) {
		this.setState({
			retailerPopupData: value,
			condFilterScan: name,
		});
	}
	handleSearch = (e: any) => {
		let searchText = e.target.value;
		this.setState({ searchText: searchText, isFiltered: true, inActiveFilter: false });
		if (this.timeOut) {
			clearTimeout(this.timeOut);
		}
		if (searchText.length >= 3 || searchText.length === 0) {
			this.timeOut = setTimeout(() => {
				this.getScanLogs();
			}, 1000);
		}
	};
	onSort = (name: string, datas: any, isAsc: Boolean) => {
		let response = sortBy(name, datas);
		this.setState({ allScanLogs: response, isAsc: !isAsc });
	};

	handleSort(e: any, columnname: string, data: any, isAsc: Boolean) {
		this.tableCellIndex = e.currentTarget.cellIndex;
		this.onSort(columnname, data, isAsc);
		this.setState({
			activeSortKeyIcon: columnname,
		});
	}

	handleFilterChange = (e: any, name: string, item: any, itemList?: any) => {
		e.stopPropagation();
		let val = this.state.selectedFilters;
		let flag = false;
		// this.state.dateErrMsg = '';
		if (name === "type") {
			val[name] = e.target.value;
			flag = true;
		} else if (name === "scannedPeriod" && item !== "Custom") {
			val["scandatefrom"] = itemList?.from;
			val["scandateto"] = itemList?.to;
			val[name] = item;
			flag = true;
		} else {
			val[name] = item;

			flag = true;
		}
		if (flag) {
			this.setState({ selectedFilters: val });
		}
	};

	resetFilter = (e?: any) => {
		let conditionIsFilter = this.state.searchText ? true : false;
		const options = [{ value: "ALL", label: "ALL" }];
		this.getDynamicOptionFields("reset");
		this.setState(
			{
				selectedFilters: {
					productgroup: "ALL",
					scanstatus: "ALL",
					ordereddatefrom: new Date().setDate(new Date().getDate() - 30),
					ordereddateto: new Date(),
					scandatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
					scandateto: moment(new Date()).format("YYYY-MM-DD"),
					retailer: "ALL",
					partnerType: "Retailers",
					scannedPeriod: "",
					batchno: "ALL",
					soldtoid: "ALL",
				},
				isFiltered: conditionIsFilter,
				dateErrMsg: "",
				lastUpdatedDateErr: "",
				selectedBatchOptions: options,
				selectedCustomerOptions: options,
				selectedGeolevel1Options: options,
				selectedGeolevel2Options: options,
			},
			() => {
				this.getScanLogs();
				// this.getRetailerList();
			}
		);
	};

	applyFilter = () => {
		this.setState({ isFiltered: true, inActiveFilter: false }, () => {
			this.getScanLogs();
			this.closeToggle();
		});
	};
	toggle = () => {
		this.setState({ tooltipOpen: !this.state.tooltipOpen });
	};

	download = () => {
		const { downloadAllScanLogs } = apiURL;

		let data = {
			countrycode: this.state.loggedUserInfo?.countrycode,
			isfiltered: this.state.isFiltered,
			searchtext: this.state.searchText || null,
			scantype: this.state.selectedScanType === "SG - ST" ? "SCAN_OUT_ST_D2D" : "SCAN_OUT_D2R",
			soldbyrole: "DISTRIBUTOR",
			soldbygeolevel1: this.state.loggedUserInfo?.role ==="ADMIN" ? null:this.state.loggedUserInfo?.geolevel1,
		};
		if (this.state.isFiltered) {
			let filter = { ...this.state.selectedFilters };
			let startDate = filter.scannedPeriod === "Custom" ? filter.ordereddatefrom : filter.scannedPeriod==="" ?null:filter.scandatefrom;
			let endDate = filter.scannedPeriod === "Custom" ? filter.ordereddateto : filter.scannedPeriod==="" ?null:filter.scandateto;
			filter.scandatefrom =  startDate ?moment(startDate).format("YYYY-MM-DD") :null;
			filter.scandateto = endDate?moment(endDate).format("YYYY-MM-DD"):null;
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.scanstatus = filter.scanstatus === "ALL" ? null : filter.scanstatus;
			filter.soldbygeolevel1 = filter.geolevel1 === "ALL" ? null : filter.geolevel1 || data.soldbygeolevel1;
			filter.soldbygeolevel2 = filter.geolevel2 === "ALL" ? null : filter.geolevel2;
			filter.batchno = filter.batchno === "ALL" ? null : filter.batchno;
			filter.soldtoid = filter.soldtoid === "ALL" ? null : filter.soldtoid;
			filter.partnerType = null;
			filter.scannedPeriod = null;
			filter.ordereddatefrom = null;
			filter.ordereddateto = null;
			filter.geolevel1 = null;
			filter.geolevel2 = null;
			data = { ...data, ...filter };
		}
		invokeGetAuthService(downloadAllScanLogs, data)
			.then((response) => {
				const data = response;
				downloadCsvFile(data, `ScanLog_${this.state.selectedScanType}`);
			})
			.catch((error) => {
				ErrorMsg(error);
			});
	};
	handleDateChange = (date: any, name: string) => {
		let val = this.state.selectedFilters;

		// order date - check End date
		if (name === "ordereddateto") {
			if (date >= val.ordereddatefrom) {
				this.setState({
					dateErrMsg: "",
				});
			} else if (date <= val.ordereddatefrom) {
				this.setState({
					dateErrMsg: "Scanned End Date should be greater than  Scanned Start Date",
				});
			} else {
				this.setState({
					dateErrMsg: "Scanned Start Date should be lesser than  Scanned End Date",
				});
			}
		}
		// order date - check Start date
		if (name === "ordereddatefrom") {
			if (date <= val.ordereddateto) {
				this.setState({
					dateErrMsg: "",
				});
			} else if (date >= val.ordereddateto) {
				this.setState({
					dateErrMsg: "Scanned Start Date should be lesser than Scanned End Date",
				});
			} else {
				this.setState({
					dateErrMsg: "Ordered Start Date should be greater than Ordered End Date",
				});
			}
		}
		this.setState({
			selectedFilters: { ...this.state.selectedFilters, [name]: date },
		});
	};

	handleSelect = (event: any, name: string) => {
		this.setState({
			selectedFilters: {
				...this.state.selectedFilters,
				[name]: event.target.value,
			},
		});
	};
	handleReactSelect = (selectedOption: any, e: any, optionName: string) => {
		let condOptionName = optionName.includes("geolevel") ? "selected" + _.capitalize(optionName) + "Options" : optionName;
		this.setState({
			selectedFilters: {
				...this.state.selectedFilters,
				[e.name]: selectedOption.value,
			},
			[condOptionName]: selectedOption,
		});
	};

	filterScans = (filterValue: any) => {
		let name = this.state.condFilterScan === "customer" ? "soldtoid" : "soldbyid";
		const {retailerOptions,distributorOptions,selectedCustomerOptions} =this.state;
		let options=selectedCustomerOptions ? {...selectedCustomerOptions} :{label:"ALL",value:"ALL"};
		let filters = { ...this.state.selectedFilters };
		let searchText = this.state.searchText;
		if (name === "soldtoid") {
			filters[name] = filterValue;
			// filters["soldbyid"] = null;
			if(this.state.selectedScanType === "SG - D2R"){
				const data=retailerOptions?.length>0&&retailerOptions.filter((el:any)=>el.value===filterValue);
				if(data?.length>0)
				options={...data[0]}
			}else{
				const data=distributorOptions?.length>0&&distributorOptions.filter((el:any)=>el.value===filterValue);
				if(data?.length>0)
				options={...data[0]}
			}
		}
		if (name === "soldbyid") {
			searchText = filterValue;
		}

		this.setState({ isFiltered: true, inActiveFilter: false, selectedFilters: { ...filters }, searchText,selectedCustomerOptions:options }, () => {
			this.getScanLogs();
			this.handleClosePopup();
		});
	};

	handlePartnerChange = (name: string) => {
		let oneTimeAPI = false;
		if (name !== this.state.partnerType.type) {
			oneTimeAPI = true;
		}
		this.setState(
			{
				partnerType: {
					type: name,
				},
			},
			() => {
				oneTimeAPI && this.getScanLogs();
			}
		);
	};
	/**
	 * Handle scan type
	 * @param name
	 * @param value
	 */
	handleButtonChange = (name: string, value: string) => {
		let oneTimeAPI = false;
		let customerOptions=this.state.selectedCustomerOptions;
		const filters ={...this.state.selectedFilters}
		if (value !== this.state[name]) {
			oneTimeAPI = true;
			customerOptions={value:"ALL",label:"ALL"}
		    filters['soldtoid'] = null;
		}
		this.setState(
			{
				[name]: value,
				selectedCustomerOptions: customerOptions,
				selectedFilters:filters
			},
			() => {
				if (oneTimeAPI) {
					this.getScanLogs();
					this.getPartnerList();
				}
			}
		);
	};
	getGeographicFields() {
		this.setState({ isLoader: true });
		const { getTemplateData } = apiURL;
		let data = {
			countryCode: this.state.loggedUserInfo?.countrycode,
		};
		invokeGetAuthService(getTemplateData, data)
			.then((response: any) => {
				let locationData = response.body[0].locationhierarchy;
				let levels: any = [];
				locationData.forEach((item: any) => {
					levelsName.push(item.name.toLowerCase());
					let locationhierlevel = item.level;
					let geolevels = "geolevel" + locationhierlevel;
					levels.push(geolevels);
				});
				let levelsData: any = [];
				locationData?.length > 0 &&
					locationData.forEach((item: any, index: number) => {
						if (index > 0) {
							let locationhierlevel = item.level;
							let geolevels = "geolevel" + locationhierlevel;
							let obj = { name: item.name, geolevels };
							levelsData.push(obj);
						}
					});
				this.setState(
					{
						isLoader: false,
						geographicFields: levels,
						locationData: levelsData,
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
			countryCode: this.state.loggedUserInfo?.countrycode,
		};
		invokeGetAuthService(getHierarchyLevels, countrycode)
			.then((response: any) => {
				let geolevel1 = Object.keys(response.body).length !== 0 ? response.body.geolevel1 : [];
				this.setState({ isLoader: false, geolevel1List: geolevel1 }, () => {
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
			let level1Info = { label: item.name, code: item.code, value: item.name };
			level1Options.push(level1Info);
		});
		

		let setFormArray: any = [];
		let localObj: any = getLocalStorageData("userData");
		let userData = JSON.parse(localObj);
		
		let userrole = userData?.role;
		let level2Options: any = [];
		if (userrole === "RSM" ){
			let filteredLevel1:any = this.state.geolevel1List?.filter((list:any) => list.name === userData?.geolevel1);
			filteredLevel1[0]?.geolevel2?.forEach((item: any) => {
				let level2Info = { label: item.name, value: item.name, code: item.code };
				level2Options.push(level2Info);
			});
			let geolevel2Obj = {
				label: "ALL",
				value: "ALL",
				code: "ALL",
			};
			level2Options.unshift(geolevel2Obj);
		} else {
			let level1Info = { label: "ALL", value :"ALL" };
			level2Options.push(level1Info);
		}
		let usergeolevel1 = userData?.geolevel1;
		let geolevel1Obj = { label : usergeolevel1, value : usergeolevel1};
		this.state.geographicFields?.forEach((list: any, i: number) => {
			setFormArray.push({
				name: list,
				placeHolder: true,
				value: list ===  "geolevel1" && (userrole === "RSM") ? geolevel1Obj : {label: "ALL",value: "ALL"},
				options:
					list === "geolevel0"
						? this.state.countryList
						: list === "geolevel1"
						? level1Options
						: list === "geolevel2"
						? level2Options
						: [{ label: "ALL", name: "ALL" }],
				error: "",
			});
		});
		this.setState({ dynamicFields: setFormArray });
	};

	getOptionLists = (cron: any, type: any, value: any, index: any) => {
		let newvalue = {label : value, name : value};
		let geolevel1List = this.state.geolevel1List;
		this.setState({ level1Options: geolevel1List });
		let dynamicFieldVal = this.state.dynamicFields;
		if (type === "geolevel1") {
			let filteredLevel1 = geolevel1List?.filter((level1: any) => level1.name === value);
			let level2Options: any = [];
			filteredLevel1[0]?.geolevel2?.forEach((item: any) => {
				let level1Info = { label: item.name, value: item.name, code: item.code };
				level2Options.push(level1Info);
			});
			let geolevel1Obj = {
				label: "ALL",
				value: "ALL",
				code: "ALL",
			};
			let geolevel3Obj = [{ label: "ALL", code: "ALL", name: "ALL", value: "ALL" }];
			level2Options.unshift(geolevel1Obj);
			dynamicFieldVal[index + 1].options = level2Options;
			this.setState({ dynamicFields: dynamicFieldVal });
			dynamicFieldVal[index + 2].options = geolevel3Obj;
			dynamicFieldVal[index].value = newvalue;
			dynamicFieldVal[index + 1].value = {label: "ALL",value: "ALL"};
			dynamicFieldVal[index + 2].value = {label: "ALL",value: "ALL"};
			this.setState((prevState: any) => ({
				dynamicFields: dynamicFieldVal,
				selectedFilters: {
					...prevState.selectedFilters,
					geolevel2: "ALL",
				},
				selectedGeolevel2Options: geolevel1Obj,
			}));
		} else if (type === "geolevel2") {
			dynamicFieldVal[index].value = newvalue;
			this.setState((prevState: any) => ({
				dynamicFields: dynamicFieldVal,
				selectedFilters: {
					...prevState.selectedFilters,
				},
			}));
		}
	};

	handleGeolevelDropdown = (value: string, label: any) => {
		this.setState((prevState: any) => ({
			selectedFilters: {
				...prevState.selectedFilters,
				[label.toLocaleLowerCase()]: value,
			},
		}));
	};

	getBatchList = () => {
		const { getBatchList } = apiURL;

		let countrycode = {
			countrycode: this.state.loggedUserInfo?.countrycode,
			soldbygeolevel1 : this.state.loggedUserInfo?.geolevel1,
		};
		invokeGetAuthService(getBatchList, countrycode)
			.then((response: any) => {
				let data = Object.keys(response.data).length !== 0 ? response.data : [];
				let options = [{ value: "ALL", label: "ALL" }];
				const temp =
					data?.length > 0
						? data.map((val: any) => {
								return { value: val.batchno, label: val.batchno };
						  })
						: [];
				const list = [...options, ...temp];
				this.setState({ isLoader: false, batchOptions: list });
			})
			.catch((error: any) => {
				this.setState({ isLoader: false });
				let message = error.message;
				Alert("warning", message);
			});
	};
	getPartnerList = () => {
		const { getPartnerList } = apiURL;
		let countrycode = {
			countrycode: this.state.loggedUserInfo?.countrycode,
			soldtorole: this.state.selectedScanType === "SG - D2R" ? "RETAILER" : "DISTRIBUTOR",
			isfiltered: true,
			soldbygeolevel1: this.state.loggedUserInfo?.geolevel1,
		};
		let condName = this.state.selectedScanType === "SG - D2R" ? "retailerOptions" : "distributorOptions";
		invokeGetAuthService(getPartnerList, countrycode)
			.then((response: any) => {
				let data = Object.keys(response.data).length !== 0 ? response.data : [];
				let options = [{ value: "ALL", label: "ALL" }];
				const temp =
					data?.length > 0
						? data.map((val: any) => {
								return { value: val.soldtoid, label: val.soldtoname };
						  })
						: [];
				const list = [...options, ...temp];
				this.setState({ isLoader: false, [condName]: list });
			})
			.catch((error: any) => {
				this.setState({ isLoader: false });
				let message = error.message;
				Alert("warning", message);
			});
	};
	render() {
		const {
			retailerPopupData,
			showProductPopup,
			isAsc,
			allScanLogs,
			selectedFilters,
			isLoader,
			dateErrMsg,
			searchText,
			totalData,
			lastUpdatedDateErr,
			retailerOptions,
			condFilterScan,
			batchOptions,
			distributorOptions,
			activeSortKeyIcon,
			selectedBatchOptions,
			selectedCustomerOptions,
			loggedUserInfo
		} = this.state;
		const fields = this.state.dynamicFields;
		const locationList = fields?.map((list: any, index: number) => {
			let nameCapitalized = levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
			return (
				<React.Fragment key={`geolevels` + index}>
					{index !== 0 && list.name !== "geolevel3" && list.name !== "geolevel4" && list.name !== "geolevel5" && (
						<div className="col" style={{ marginBottom: "5px" }}>
							<ReactSelect
								name={list.name}
								label={`Scanned by - ${nameCapitalized === "Add" ? "ADD" : nameCapitalized}`}
								options={list.options}
								handleChange={(selectedOptions: any, e: any) => {
									list.value = selectedOptions.value;
									this.getOptionLists("manual", list.name, selectedOptions.value, index);
									this.handleReactSelect(selectedOptions, e, list.name);
									// this.handleGeolevelDropdown(selectedOptions.value, list.name);
								}}
								value={list.value}
								isDisabled = {list.name === "geolevel1" }
								id="geolevel-test"
								dataTestId="geolevel-test"
							/>
						</div>
					)}
				</React.Fragment>
			);
		});
		return (
			<AUX>
				{isLoader && <Loader />}
				<div>
					<div>
						<div className="scanlog-table">
							<Filter
								handleSearch={this.handleSearch}
								searchText={searchText}
								download={this.download}
								partnerTypeList={this.state.partnerTypeList}
								isDownload={true}
								selectedPartnerType={this.state.partnerType}
								handlePartnerChange={this.handlePartnerChange}
								toolTipText={`Search applicable for Label,Customer Name,Product Name,Channel Type,${this.state.selectedScanType === "SG - D2R" ?"Store Name":""} and ScannedBy.`}
								condType="Scan Type"
								condTypeList={this.state.scanTypeList}
								buttonChange={this.handleButtonChange}
								condSelectedButton={this.state.selectedScanType}
								onClose={(node: any) => {
									this.closeToggle = node;
								}}
							>
								<div className="form-group" onClick={(e) => e.stopPropagation()}>
									<ReactSelect
										name="soldtoid"
										value={selectedCustomerOptions}
										label={`Customer Name (${this.state.selectedScanType === "SG - D2R" ? "Retailer" : "Distributor"})`}
										handleChange={(selectedOptions: any, e: any) =>
											this.handleReactSelect(selectedOptions, e, "selectedCustomerOptions")
										}
										options={this.state.selectedScanType === "SG - D2R" ? retailerOptions : distributorOptions}
										defaultValue="ALL"
										id="retailer-test"
										dataTestId="retailer-test"
									/>
								</div>
								<label className="pt-2">Product Group</label>
								<div className="form-group pt-1">
									{this.state.productCategories.map((item: any, i: number) => (
										<span className="mr-2 chipLabel" key={i}>
											<Button
												color={
													selectedFilters.productgroup === item
														? "btn activeColor rounded-pill"
														: "btn rounded-pill boxColor"
												}
												size="sm"
												onClick={(e) => this.handleFilterChange(e, "productgroup", item)}
												style={{ marginBottom: "5px" }}
											>
												{item}
											</Button>
										</span>
									))}
								</div>
								<div className="form-group container" onClick={(e) => e.stopPropagation()}>
									<div className="row column-dropdown">{locationList}</div>
								</div>
								<div className="form-group container" onClick={(e) => e.stopPropagation()}>
									<div className="row column-dropdown">
										<div className="col">
											<ReactSelect
												name="batchno"
												value={selectedBatchOptions}
												label={"Batch #"}
												handleChange={(selectedOptions: any, e: any) =>
													this.handleReactSelect(selectedOptions, e, "selectedBatchOptions")
												}
												options={batchOptions}
												defaultValue="ALL"
												id="batchno-test"
												dataTestId="batchno-test"
											/>
										</div>
									</div>
								</div>
								<label className="pt-2"> Scan Status</label>
								<div className="pt-1">
									{this.state.status.map((item: any, statusIndex: number) => (
										<span className="mr-2" key={statusIndex}>
											<Button
												color={
													selectedFilters.scanstatus === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"
												}
												size="sm"
												onClick={(e) => this.handleFilterChange(e, "scanstatus", item)}
											>
												{item}
											</Button>
										</span>
									))}
								</div>
								<label className="pt-2">Scanned Period</label>
								<div className="pt-1">
									{this.state.scannedPeriodsList.map((item: any, i: number) => (
										<span className="mr-2 chipLabel" key={i}>
											<Button
												color={
													selectedFilters.scannedPeriod === item.label
														? "btn activeColor rounded-pill"
														: "btn rounded-pill boxColor"
												}
												size="sm"
												onClick={(e) => this.handleFilterChange(e, "scannedPeriod", item.label, item)}
												style={{ marginBottom: "5px" }}
											>
												{item.label}
											</Button>
										</span>
									))}
								</div>
								{selectedFilters.scannedPeriod === "Custom" && (
									<React.Fragment>
										<label className="pt-2" htmlFor="order-date" style={{ width: "55%" }}>
											From
										</label>
										<label className="pt-2" htmlFor="order-todate">
											To
										</label>
										<div className="d-flex">
											<div className="user-filter-date-picker">
												<DatePicker
													id="order-date"
													value={selectedFilters.ordereddatefrom}
													dateFormat="dd-MM-yyyy"
													customInput={<Input ref={ref} />}
													selected={selectedFilters.ordereddatefrom}
													onChange={(date: any) => this.handleDateChange(date, "ordereddatefrom")}
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													// maxDate={new Date()}
												/>
											</div>
											<div className="p-2">-</div>

											<div className="user-filter-date-picker">
												<DatePicker
													value={selectedFilters.ordereddateto}
													dateFormat="dd-MM-yyyy"
													customInput={<Input ref={ref} />}
													selected={selectedFilters.ordereddateto}
													onChange={(date: any) => this.handleDateChange(date, "ordereddateto")}
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													// maxDate={new Date()}
												/>
											</div>
										</div>
										{dateErrMsg && <span className="error">{dateErrMsg} </span>}
									</React.Fragment>
								)}

								<div className="filterFooter pt-3">
									<button
										className="cus-btn-scanlog-filter reset"
										onClick={(e) => this.resetFilter(e)}
										data-testid="reset-all"
									>
										Reset All
									</button>
									<button
										className="cus-btn-scanlog-filter"
										onClick={this.applyFilter}
										disabled={lastUpdatedDateErr || dateErrMsg ? true : false}
										data-testid="apply"
									>
										Apply
										<span>
											<img src={ArrowIcon} className="arrow-i" alt="" /> <img src={RtButton} className="layout" alt="" />
										</span>
									</button>
								</div>
							</Filter>
							
							<div className="scanlog-container">
								<table className="table">
									<thead>
										<tr>
											<th
												style={{ width: this.state.selectedScanType === "SG - D2R" ? "12%" : "15%" }}
												onClick={(e) => this.handleSort(e, "labelid", allScanLogs, isAsc)}
											>
												LABEL/BATCH ID
												{activeSortKeyIcon === "labelid" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "soldtoname", allScanLogs, isAsc)}>
												CUSTOMER NAME/ID
												{activeSortKeyIcon === "soldtoname" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											{this.state.selectedScanType === "SG - D2R" && (
												<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "soldtostore", allScanLogs, isAsc)}>
													STORE NAME
													{activeSortKeyIcon === "soldtostore" ? (
														<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
													) : null}
												</th>
											)}
											<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "productname", allScanLogs, isAsc)}>
												PRODUCT NAME
												{activeSortKeyIcon === "productname" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "12%" }} onClick={(e) => this.handleSort(e, "channeltype", allScanLogs, isAsc)}>
												CHANNEL TYPE
												{activeSortKeyIcon === "channeltype" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "scanneddate", allScanLogs, isAsc)}>
												SCANNED ON
												{activeSortKeyIcon === "scanneddate" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "15%" }} onClick={(e) => this.handleSort(e, "soldbyname", allScanLogs, isAsc)}>
												SCANNED BY
												{activeSortKeyIcon === "soldbyname" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											{loggedUserInfo?.role==="ADMIN" &&
											 <th
												style={{ width: "10%" }}
												onClick={(e) => this.handleSort(e, "soldbygeolevel1", allScanLogs, isAsc)}
											>
												REGION
												{activeSortKeyIcon === "soldbygeolevel1" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th> 
										}
											<th
												style={{ width: loggedUserInfo?.role==="ADMIN" ? "10%" : "16%" }}
												onClick={(e) => this.handleSort(e, "expirydate", allScanLogs, isAsc)}
											>
												EXPIRY DATE
												{activeSortKeyIcon === "expirydate" ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
										</tr>
									</thead>
									<tbody>
										{allScanLogs.length > 0 ? (
											allScanLogs.map((value: any, i: number) => {
												return (
													<tr
														onClick={(event) => {
															this.updateOrderData(value);
														}}
														key={i}
													>
														<td>
															{value.labelid}
															<p>
																<span className={`status-label ${value.scanstatus === "VALID" ? "active" : "inactive"}`}>
																	{_.capitalize(value.scanstatus)}
																</span>
																- #{value.batchno}
															</p>
														</td>
														<td
															onClick={(event) => {
																this.showPopup(event, "showPopup");
																this.handleUpdateRetailer(value, "customer");
															}}
															style={{ cursor: "pointer" }}
														>
															<div className="retailer-id">
																<p
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	<span style={{ flex: "1", whiteSpace: "nowrap" }}>
																		{_.startCase(_.toLower(value.soldtoname))}
																		<img className="retailer-icon" src={ExpandWindowImg} alt="" />
																	</span>
																</p>
																<label>{value.soldtoid + " - " + _.startCase(_.toLower(value.soldtorole))}</label>
															</div>
														</td>
														{this.state.selectedScanType === "SG - D2R" && <td>{_.startCase(_.toLower(value.soldtostore))}</td>}
														<td>
															<div className="farmer-id">
																<p>{value.productname}</p>
																<label>
																	{value.productid === null
																		? ""
																		: value.productid + " - " + _.capitalize(value.productgroup)}
																</label>
															</div>
														</td>
														<td>{value.channeltype}</td>
														<td>{value.scanneddate && moment(value.scanneddate).format("DD/MM/YYYY")}</td>
														<td
															onClick={(event) => {
																this.showPopup(event, "showPopup");
																this.handleUpdateRetailer(value, "scannedBy");
															}}
															style={{ cursor: "pointer" }}
														>
															<div className="retailer-id">
																<p
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	<span style={{ flex: "1", whiteSpace: "nowrap" }}>
																		{_.startCase(_.toLower(value.soldbyname))}
																		<img className="retailer-icon" src={ExpandWindowImg} alt="" />
																	</span>
																</p>
																<label>{value.soldbyid}</label>
															</div>
														</td>
														{loggedUserInfo?.role==="ADMIN" && <td>{value.soldbygeolevel1}</td> }
														<td>{value.expirydate && moment(value.expirydate).format("DD/MM/YYYY")}</td>
													</tr>
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
							</div>
						</div>
					</div>
					<div>
						<Pagination
							totalData={totalData}
							data={allScanLogs}
							totalLabel={"Send Goods"}
							onRef={(node: any) => {
								this.paginationRef = node;
							}}
							getRecords={this.getScanLogs}
						/>
					</div>
				</div>
				{this.state.showPopup ? (
					<SimpleDialog open={this.state.showPopup} onClose={this.handleClosePopup} header={popupHeader} maxWidth={"800px"}>
						<DialogContent>
							<div className="popup-container popup-retailer">
								<div className="img">
									<img src={NoImage} alt="" />
								</div>
								<div className="popup-content">
									<div className={`popup-title`}>
										<p>
											{retailerPopupData[condFilterScan === "customer" ? "soldtoname" : "soldbyname"]},
											<label>
												{_.startCase(
													_.toLower(retailerPopupData[condFilterScan === "customer" ? "soldtorole" : "soldbyrole"])
												)}
											</label>
										</p>
									</div>
									<div className="popup-content-row">
										<div className="content-list">
											<label>Username</label>
											<p>{retailerPopupData[condFilterScan === "customer" ? "soldtoid" : "soldbyid"]}</p>
										</div>
										<div className="content-list">
											<label>Store Name</label>
											<p>{retailerPopupData[condFilterScan === "customer" ? "soldtostore" : "soldbystore"]}</p>
										</div>
										<div className="content-list">
											<label>Phone Number</label>
											<p>{retailerPopupData[condFilterScan === "customer" ? "soldtophonenumber" : "soldbyphonenumber"]}</p>
										</div>
										{this.state.locationData?.length > 0 &&
											this.state.locationData.map((location: any, locationIndex: number) => {
												let nameCapitalized = location.name === 'ADD' || location.name === 'EPA' ? location.name: _.startCase(_.toLower(location.name));
												return (
													<div className="content-list" key={locationIndex}>
														<label>{nameCapitalized}</label>
														<p>
															{
																retailerPopupData[
																	condFilterScan === "customer"
																		? "soldto" + location.geolevels
																		: "soldby" + location.geolevels
																]
															}
														</p>
													</div>
												);
											})}
										<div className="content-list">
											<label>Postal Code</label>
											<p>{retailerPopupData[condFilterScan === "customer" ? "soldtozipcode" : "soldbyzipcode"]}</p>
										</div>
									</div>
								</div>
							</div>
						</DialogContent>
						<DialogActions>
							<CustomButton
								label="Filter scans"
								style={{
									borderRadius: "30px",
									backgroundColor: "#7eb343",
									width: "190px",
									padding: "7px",
									border: "1px solid  #7eb343",
								}}
								handleClick={() =>
									this.filterScans(retailerPopupData[condFilterScan === "customer" ? "soldtoid" : "soldbyid"])
								}
							/>
						</DialogActions>
					</SimpleDialog>
				) : (
					""
				)}

				{showProductPopup ? (
					<OrderTable open={showProductPopup} close={this.handleCloseProductPopup} data={this.state.orderData} />
				) : (
					""
				)}
			</AUX>
		);
	}
}

export default SendGoods;
