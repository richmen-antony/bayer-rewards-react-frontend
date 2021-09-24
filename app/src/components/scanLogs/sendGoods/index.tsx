import React, { Component, Fragment } from "react";
import AUX from "../../../hoc/Aux_";
import "../../../assets/scss/scanLogs.scss";
import Loader from "../../../utility/widgets/loader";
import Pagination from "../../../utility/widgets/pagination";
import moment from "moment";
import CalenderIcon from "../../../assets/icons/calendar.svg";
import { Button } from "reactstrap";
import { apiURL } from "../../../utility/base/utils/config";
import { invokeGetAuthService } from "../../../utility/base/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../../assets/icons/tick.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import { getLocalStorageData } from "../../../utility/base/localStore";
import Filter from "../../../containers/grid/Filter";
import { Alert } from "../../../utility/widgets/toaster";
import ReactSelect from "../../../utility/widgets/dropdown/ReactSelect";
import Distributor from "./Distributor";
import Warehouse from "./Warehouse";

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
	distributorRef: any;
	warehouseRef: any;
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
			productCategories: ["ALL", "CORN SEED", "HERBICIDES", "FUNGICIDES", "INSECTICIDES"],
			status: ["ALL", "VALID", "INVALID"],
			// status: ["ALL", "FULFILLED", "EXPIRED", "DUPLICATE"],
			list: ["ALL", "Distributor", "Retailer"],
			selectedDistributorFilters: {
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
			selectedWarehouseFilters: {
				dispatchstatus: "ALL",
				ordereddatefrom: new Date().setDate(new Date().getDate() - 30),
				ordereddateto: new Date(),
				scannedPeriod: "",
				scandatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
				scandateto: moment(new Date()).format("YYYY-MM-DD"),
				warehouseid: "ALL",
				customerid:"ALL"
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
			scanTypeList: [	
				{ value: "SG - W2D", label: "SG - W2D" },
				{ value: "SG - W2R", label: "SG - W2R" },],
			selectedScanType: "SG - W2D",
			selectedScannedBy: "Warehouse Ops",
			activeSortKeyIcon: "labelid",
			scannedByList: [
				{ value: "Warehouse Ops", label: "Warehouse Ops" },
				{ value: "Distributor", label: "Distributor" },
			],
			distributorScanTypeList: [
				{ value: "SG - ST", label: "SG - ST" },
				{ value: "SG - D2R", label: "SG - D2R" },
			],
			warehouseScanTypeList:[
			{ value: "SG - W2D", label: "SG - W2D" },
			{ value: "SG - W2R", label: "SG - W2R" },],
			goodStatus:[ {value:"ALL",label:"ALL"},{value:"GOODS_DISPATCHED",label:"Dispatch Sent"},{value:"GOODS_RECEIVED",label:"Dispatch Received"},]

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
				//API to get country and language settings
				this.getCountryList();
				this.getHierarchyDatas();
				this.getBatchList();
				this.getPartnerList();
				this.getWarehouseOptionList();
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
				this.callChildAPI();
			}, 1000);
		}
	};

	handleFilterChange = (e: any, name: string, item: any, itemList?: any) => {
		e.stopPropagation();
		const { filter, stateFilterName } = this.activeFilter();
		let val = filter;
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
			this.setState({ [stateFilterName]: val });
		}
	};

	resetFilter = (e?: any) => {
		const { selectedScannedBy } = this.state;
		const filter= selectedScannedBy === "Distributor"
			? {
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
			  }
			: {
					dispatchstatus: "ALL",
					ordereddatefrom: new Date().setDate(new Date().getDate() - 30),
					ordereddateto: new Date(),
					scandatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
					scandateto: moment(new Date()).format("YYYY-MM-DD"),
					scannedPeriod: "",
					warehouseid: "ALL",
					customerid:"ALL"
			  };
          const {stateFilterName}= this.activeFilter();
		let conditionIsFilter = this.state.searchText ? true : false;
		const options = [{ value: "ALL", label: "ALL" }];
		this.getDynamicOptionFields("reset");
		this.setState(
			{
				[stateFilterName]:filter,
				isFiltered: conditionIsFilter,
				dateErrMsg: "",
				lastUpdatedDateErr: "",
				selectedBatchOptions: options,
				selectedCustomerOptions: options,
				selectedGeolevel1Options: options,
				selectedGeolevel2Options: options,
				// searchText:""
			},
			() => {
				this.callChildAPI();
				this.closeToggle();
				// this.getRetailerList();
			}
		);
	};

	applyFilter = () => {
		this.setState({ isFiltered: true, inActiveFilter: false }, () => {
			this.callChildAPI();
			this.closeToggle();
		});
	};
	toggle = () => {
		this.setState({ tooltipOpen: !this.state.tooltipOpen });
	};

	download = () => {
        const { selectedScannedBy } = this.state;
		selectedScannedBy === "Distributor" ? this.distributorRef?.download() : this.warehouseRef?.download();
	};
	handleDateChange = (date: any, name: string) => {
		const { selectedScannedBy } = this.state;
		const { filter, stateFilterName } = this.activeFilter();
		let val = filter;
        let condName=selectedScannedBy === "Distributor" ? "dateErrMsg":"wareHouseDateErrMsg";
		// order date - check End date
		if (name === "ordereddateto") {
			if (date >= val.ordereddatefrom) {
				this.setState({
					[condName]: "",
				});
			} else if (date <= val.ordereddatefrom) {
				this.setState({
					[condName]: "Scanned End Date should be greater than  Scanned Start Date",
				});
			} else {
				this.setState({
					[condName]: "Scanned Start Date should be lesser than  Scanned End Date",
				});
			}
		}
		// order date - check Start date
		if (name === "ordereddatefrom") {
			if (date <= val.ordereddateto) {
				this.setState({
					[condName]: "",
				});
			} else if (date >= val.ordereddateto) {
				this.setState({
					[condName]: "Scanned Start Date should be lesser than Scanned End Date",
				});
			} else {
				this.setState({
					[condName]: "Ordered Start Date should be greater than Ordered End Date",
				});
			}
		}
		this.setState({
			[stateFilterName]: { ...this.state[stateFilterName], [name]: date },
		});
	};

	handleReactSelect = (selectedOption: any, e: any, inActiveFilter?: boolean) => {
		const {scanTypeList,distributorScanTypeList,warehouseScanTypeList} =this.state;
		if (inActiveFilter) {
			//not filter activity 
			const { filter, stateFilterName } = this.activeFilter();
			let condSelectedScanType= "";
			let oneTimeAPI= false
			const filters =filter;
			if (selectedOption.value !== this.state[e.name]) {
				//If scantype update after set customer name dropdown value is all(Default vaue)
				if(stateFilterName==="selectedDistributorFilters")
				filters["soldtoid"] = "ALL";
				//If scantype update after set Distributor or Retailer dropdown value is all(Default vaue)
				if(stateFilterName==="selectedWarehouseFilters")
				filters["customerid"] = "ALL";
				oneTimeAPI= true
			}
			let scanTypeListValue:any[]=[...scanTypeList];
			if(e.name==="selectedScannedBy"){
				scanTypeListValue=selectedOption.value ==="Distributor"? [...distributorScanTypeList] :[...warehouseScanTypeList];
				condSelectedScanType=scanTypeListValue[0].value;	
			}
			if(e.name==="selectedScanType"){
				condSelectedScanType=selectedOption.value;
			}
			this.setState(
				{
					[e.name]: selectedOption.value,
					scanTypeList:scanTypeListValue,
					selectedScanType:condSelectedScanType,
					[stateFilterName]: filters,
				},
				() => {
					// when change scantype value after call the API
					if(e.name==="selectedScanType" && oneTimeAPI){
  						this.callChildAPI();
			 			this.getPartnerList();
					}
                 
				}
			);
		} else {
			//  handle filter activity on react-select
			const { filter, stateFilterName } = this.activeFilter();
			this.setState({
				[stateFilterName]: {
					...filter,
					[e.name]: selectedOption.value,
				},
			});
		}
	};
	
	/**
	 * Handle scan type
	 * @param name
	 * @param value
	 */
	handleScanTypeChange = (name: string, value: string) => {
        const { filter, stateFilterName } = this.activeFilter();
		const filters =filter;
		if (value !== this.state[name]) {
			filters["soldtoid"] = "ALL";
		}
		this.setState(
			{
				[name]: value,
				[stateFilterName]: filters,
			},
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
		if (userrole === "RSM") {
			let filteredLevel1: any = this.state.geolevel1List?.filter((list: any) => list.name === userData?.geolevel1);
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
			let level1Info = { label: "ALL", value: "ALL" };
			level2Options.push(level1Info);
		}
		let usergeolevel1 = userData?.geolevel1;
		// let geolevel1Obj = { label: usergeolevel1, value: usergeolevel1 };
		this.state.geographicFields?.forEach((list: any, i: number) => {
			setFormArray.push({
				name: list,
				placeHolder: true,
				value: list === "geolevel1" && userrole === "RSM" ? usergeolevel1 : "ALL" ,
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
		let newvalue = { label: value, name: value };
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
			dynamicFieldVal[index].value = value;
			dynamicFieldVal[index + 1].value = "ALL";
			dynamicFieldVal[index + 2].value = "ALL" ;
			this.setState((prevState: any) => ({
				dynamicFields: dynamicFieldVal,
				selectedFilters: {
					...prevState.selectedFilters,
					geolevel2: "ALL",
				},
				selectedGeolevel2Options: geolevel1Obj,
			}));
		} else if (type === "geolevel2") {
			dynamicFieldVal[index].value = value;
			this.setState((prevState: any) => ({
				dynamicFields: dynamicFieldVal,
				selectedFilters: {
					...prevState.selectedFilters,
				},
			}));
		}
	};



	getBatchList = () => {
		const { getBatchList } = apiURL;

		let countrycode = {
			countrycode: this.state.loggedUserInfo?.countrycode,
			soldbygeolevel1: this.state.loggedUserInfo?.role === "ADMIN" ? null : this.state.loggedUserInfo?.geolevel1,
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
			soldtorole: this.state.selectedScanType === "SG - D2R" || this.state.selectedScanType === "SG - W2R" ? "RETAILER" : "DISTRIBUTOR",
			isfiltered: true,
			soldbygeolevel1: this.state.loggedUserInfo?.role === "ADMIN" ? null : this.state.loggedUserInfo?.geolevel1
		};
		let condName = this.state.selectedScanType === "SG - D2R"|| this.state.selectedScanType === "SG - W2R" ? "retailerOptions" : "distributorOptions";
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

	handlePagination = () => {
		this.setState({
			pageUpdated: true,
		});
	};
	callChildAPI = () => {
		const { selectedScannedBy } = this.state;
		selectedScannedBy === "Distributor" ? this.distributorRef?.getDistributor() : this.warehouseRef?.getWarehouse();
	};
	handleUpdateSearch = (value: string,selectedFilters?:Object) => {
        const {stateFilterName}= this.activeFilter();
		this.setState(
			{
				searchText: value,
				isFiltered: true,
                [stateFilterName]:selectedFilters
			},
			() => {
				this.callChildAPI();
			}
		);
	};
	/**
	 * This method handle the get active filter and name
	 * @returns filter and name
	 */
	activeFilter = () => {
		const { selectedScannedBy, selectedDistributorFilters, selectedWarehouseFilters } = this.state;
		let filter = selectedScannedBy === "Distributor" ? { ...selectedDistributorFilters } : { ...selectedWarehouseFilters };
		let stateFilterName = selectedScannedBy === "Distributor" ? "selectedDistributorFilters" : "selectedWarehouseFilters";
		return { filter, stateFilterName };
	};
     /**
	  * This method handle get warehouse name and id list in dropdown category
	  */
	getWarehouseOptionList=()=>{
		const { getWarehouseOptionsList } = apiURL;

		let countrycode = {
			countrycode: this.state.loggedUserInfo?.countrycode,
			soldbygeolevel1: this.state.loggedUserInfo?.role === "ADMIN" ? null : this.state.loggedUserInfo?.geolevel1,
		};
		invokeGetAuthService(getWarehouseOptionsList, countrycode)
			.then((response: any) => {
				let data = Object.keys(response.body).length !== 0 ? response.body : [];
				let options = [{ value: "ALL", label: "ALL" }];
				const temp =
					data?.length > 0
						? data.map((val: any) => {
								return { value: val.warehouseid, label: val.warehousename };
						  })
						: [];
				const list = [...options, ...temp];
				this.setState({ isLoader: false, warehouseOptions: list });
			})
			.catch((error: any) => {
				this.setState({ isLoader: false });
				let message = error.message;
				Alert("warning", message);
			});

	}
	render() {
		const {
			isLoader,
			dateErrMsg,
			searchText,
			lastUpdatedDateErr,
			retailerOptions,
			batchOptions,
			distributorOptions,
			scannedByList,
			selectedScanType,
			selectedScannedBy,
			isFiltered,
			selectedDistributorFilters,
			selectedWarehouseFilters,
			warehouseOptions,
			wareHouseDateErrMsg
		} = this.state;
		const fields = this.state.dynamicFields;
		const locationList = fields?.map((list: any, index: number) => {
			let nameCapitalized = levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
			let data: any = getLocalStorageData("userData");
			let userData = JSON.parse(data);
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
									this.handleReactSelect(selectedOptions, e);
									// this.handleGeolevelDropdown(selectedOptions.value, list.name);
								}}
								value={list.value}
								isDisabled={userData?.role === "RSM" && list.name === "geolevel1"}
								id="geolevel-test"
								dataTestId="geolevel-test"
							/>
						</div>
					)}
				</React.Fragment>
			);
		});
		const { filter } = this.activeFilter();
		const condWarehouseTooptip =this.state.selectedScanType === "SG - W2R" ? "Retailer Name/ID, Store Name" : "Distributor Name/ID";
		const condDistributorTooptip =this.state.selectedScanType === "SG - W2R" ? "Store Name" : "";
		const toolTipText=  selectedScannedBy==="Distributor" ?`Label, Customer Name, Product Name, Channel Type ${condDistributorTooptip
		} and Scanned By.` : `Delivery ID, Warehouse Name/ID, ${condWarehouseTooptip} and Scanned By.`
		return (
			<AUX>
				{isLoader ? <Loader /> :
				<div>
					<div>
						<div className="scanlog-table">
							<Filter
								handleSearch={this.handleSearch}
								searchText={searchText}
								download={this.download}
								isDownload={true}
								toolTipText={`Search applicable for ${toolTipText}`}
								onClose={(node: any) => {
									this.closeToggle = node;
								}}
								isScannedBy
								scannedByList={scannedByList}
								isScanType
								scanTypeList={this.state.scanTypeList}
								handleReactSelect={this.handleReactSelect}
								selectedScannedBy={selectedScannedBy}
								selectedScanType={selectedScanType}
							>
								{selectedScannedBy === "Distributor" ? (
									<Fragment>
										<div className="form-group" onClick={(e) => e.stopPropagation()}>
											<ReactSelect
												name="soldtoid"
												value={filter.soldtoid}
												label={`Customer Name (${this.state.selectedScanType === "SG - D2R" ? "Retailer" : "Distributor"})`}
												handleChange={(selectedOptions: any, e: any) => this.handleReactSelect(selectedOptions, e)}
												options={this.state.selectedScanType === "SG - D2R" ? retailerOptions : distributorOptions}
												defaultValue="ALL"
												id="retailer-test"
												dataTestId="retailer-test"
											/>
										</div>
										<label className="font-weight-bold pt-2">Product Group</label>
										<div className="form-group pt-1">
											{this.state.productCategories.map((item: any, i: number) => (
												<span className="mr-2 chipLabel" key={i}>
													<Button
														color={
															filter.productgroup === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"
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
														value={filter.batchno}
														// value={selectedBatchOptions}
														label={"Batch #"}
														handleChange={(selectedOptions: any, e: any) => this.handleReactSelect(selectedOptions, e)}
														options={batchOptions}
														defaultValue="ALL"
														id="batchno-test"
														dataTestId="batchno-test"
													/>
												</div>
											</div>
										</div>
										<label className="font-weight-bold pt-2"> Scan Status</label>
										<div className="pt-1">
											{this.state.status.map((item: any, statusIndex: number) => (
												<span className="mr-2" key={statusIndex}>
													<Button
														color={filter.scanstatus === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"}
														size="sm"
														onClick={(e) => this.handleFilterChange(e, "scanstatus", item)}
													>
														{item}
													</Button>
												</span>
											))}
										</div>
										<label className="font-weight-bold pt-2">Scanned Period</label>
										<div className="pt-1">
											{this.state.scannedPeriodsList.map((item: any, i: number) => (
												<span className="mr-2 chipLabel" key={i}>
													<Button
														color={
															filter.scannedPeriod === item.label
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
										{filter.scannedPeriod === "Custom" && (
											<React.Fragment>
												<label className="font-weight-bold pt-2" htmlFor="order-date" style={{ width: "55%" }}>
													From
												</label>
												<label className="font-weight-bold pt-2" htmlFor="order-todate">
													To
												</label>
												<div className="d-flex">
													<div className="user-filter-date-picker">
														<DatePicker
															id="order-date"
															value={filter.ordereddatefrom}
															dateFormat="dd-MM-yyyy"
															customInput={<Input ref={ref} />}
															selected={filter.ordereddatefrom}
															onChange={(date: any) => this.handleDateChange(date, "ordereddatefrom")}
															showMonthDropdown
															showYearDropdown
															dropdownMode="select"
															 maxDate={new Date()}
														/>
													</div>
													<div className="p-2">-</div>

													<div className="user-filter-date-picker">
														<DatePicker
															value={filter.ordereddateto}
															dateFormat="dd-MM-yyyy"
															customInput={<Input ref={ref} />}
															selected={filter.ordereddateto}
															onChange={(date: any) => this.handleDateChange(date, "ordereddateto")}
															showMonthDropdown
															showYearDropdown
															dropdownMode="select"
															 maxDate={new Date()}
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
									</Fragment>
								) : (
									<Fragment>
										<div className="form-group" onClick={(e) => e.stopPropagation()}>
											<ReactSelect
												name="warehouseid"
												value={filter.warehouseid}
												label={`Warehouse Name`}
												handleChange={(selectedOptions: any, e: any) => this.handleReactSelect(selectedOptions, e)}
												options={warehouseOptions}
												defaultValue="ALL"
												id="retailer-test"
												dataTestId="retailer-test"
											/>
										</div>
										<div className="form-group" onClick={(e) => e.stopPropagation()}>
											<ReactSelect
												name="customerid"
												value={filter.customerid}
												label={this.state.selectedScanType === "SG - W2R" ?`Retailer Name` :"Distributor Name"}
												handleChange={(selectedOptions: any, e: any) => this.handleReactSelect(selectedOptions, e)}
												options={this.state.selectedScanType === "SG - W2R" ? retailerOptions : distributorOptions}
												defaultValue="ALL"
												id="retailer-test"
												dataTestId="retailer-test"
											/>
										</div>
										<div className="form-group container" onClick={(e) => e.stopPropagation()}>
											<div className="row column-dropdown">{locationList}</div>
										</div>
										<label className="font-weight-bold pt-2"> Delivery Status</label>
										<div className="pt-1">
											{this.state.goodStatus.map((item: any, statusIndex: number) => (
												<span className="mr-2" key={statusIndex}>
													<Button
														color={filter.dispatchstatus === item.value ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"}
														size="sm"
														onClick={(e) => this.handleFilterChange(e, "dispatchstatus", item.value)}
													>
														{item.label}
													</Button>
												</span>
											))}
										</div>
										<label className="font-weight-bold pt-2">Scanned Period</label>
										<div className="pt-1">
											{this.state.scannedPeriodsList.map((item: any, i: number) => (
												<span className="mr-2 chipLabel" key={i}>
													<Button
														color={
															filter.scannedPeriod === item.label
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
										{filter.scannedPeriod === "Custom" && (
											<React.Fragment>
												<label className="font-weight-bold pt-2" htmlFor="order-date" style={{ width: "55%" }}>
													From
												</label>
												<label className="font-weight-bold pt-2" htmlFor="order-todate">
													To
												</label>
												<div className="d-flex">
													<div className="user-filter-date-picker">
														<DatePicker
															id="order-date"
															value={filter.ordereddatefrom}
															dateFormat="dd-MM-yyyy"
															customInput={<Input ref={ref} />}
															selected={filter.ordereddatefrom}
															onChange={(date: any) => this.handleDateChange(date, "ordereddatefrom")}
															showMonthDropdown
															showYearDropdown
															dropdownMode="select"
															 maxDate={new Date()}
														/>
													</div>
													<div className="p-2">-</div>

													<div className="user-filter-date-picker">
														<DatePicker
															value={filter.ordereddateto}
															dateFormat="dd-MM-yyyy"
															customInput={<Input ref={ref} />}
															selected={filter.ordereddateto}
															onChange={(date: any) => this.handleDateChange(date, "ordereddateto")}
															showMonthDropdown
															showYearDropdown
															dropdownMode="select"
															 maxDate={new Date()}
														/>
													</div>
												</div>
												{wareHouseDateErrMsg && <span className="error">{wareHouseDateErrMsg} </span>}
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
												disabled={ wareHouseDateErrMsg ? true : false}
												data-testid="apply"
											>
												Apply
												<span>
													<img src={ArrowIcon} className="arrow-i" alt="" /> <img src={RtButton} className="layout" alt="" />
												</span>
											</button>
										</div>
									</Fragment>
								)}
							</Filter>

							<div className="scanlog-container">
								{selectedScannedBy === "Distributor" ? (
									<Distributor
										onRef={(node: any) => {
											this.distributorRef = node;
										}}
										paginationRef={this.paginationRef}
										handleUpdate={this.handlePagination}
										loggedUser={this.state.loggedUserInfo}
										searchText={searchText}
										selectedFilters={selectedDistributorFilters}
										isFiltered={isFiltered}
										updateSearch={this.handleUpdateSearch}
										selectedScanType={selectedScanType}
									/>
								) : (
									<Warehouse
										onRef={(node: any) => {
											this.warehouseRef = node;
										}}
										paginationRef={this.paginationRef}
										handleUpdate={this.handlePagination}
										loggedUser={this.state.loggedUserInfo}
										searchText={searchText}
										selectedFilters={selectedWarehouseFilters}
										isFiltered={isFiltered}
										updateSearch={this.handleUpdateSearch}
										selectedScanType={selectedScanType}
									/>
								)}
							</div>
						</div>
					</div>
					<div>
						<Pagination
							totalData={
								selectedScannedBy === "Distributor"
									? this.distributorRef?.state?.totalDistributorCount
									: this.warehouseRef?.state?.totalWarehouseCount
							}
							data={
								selectedScannedBy === "Distributor"
									? this.distributorRef?.state?.allDistributorData
									: this.warehouseRef?.state?.allWarehouseData
							}
							totalLabel={selectedScanType}
							onRef={(node: any) => {
								this.paginationRef = node;
							}}
							getRecords={
								selectedScannedBy === "Distributor"
									? this.distributorRef?.getDistributor
									: this.warehouseRef?.getWarehouse
							}
						/>
					</div>
				</div>
	}</AUX>
		);
	}
}

export default SendGoods;
