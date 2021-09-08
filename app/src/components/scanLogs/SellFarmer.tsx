import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import "../../assets/scss/scanLogs.scss";
import Loader from "../../utility/widgets/loader";
import Pagination from "../../utility/widgets/pagination";
import moment from "moment";
import CalenderIcon from "../../assets/icons/calendar.svg";
import { Button } from "reactstrap";
import { ErrorMsg } from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import { invokeGetAuthService } from "../../utility/base/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import { getLocalStorageData } from "../../utility/base/localStore";
import Filter from "../../container/grid/Filter";
import ReactSelect from "../../utility/widgets/dropdown/ReactSelect";
import AdvisorSales from "./AdvisorSales";
import WalkInSales from "./WalkInSales";
import { Alert } from "../../utility/widgets/toaster";

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
class SellFarmer extends Component<Props, States> {
	tableCellIndex: any = 0;
	timeOut: any;
	paginationRef: any;
	closeToggle: any;
	walkinSalesRef: any;
	advisorSalesRef: any;
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
			advisorStatus: ["ALL", "FULFILLED"],
			list: ["ALL", "Distributor", "Retailer"],
			selectedFilters: {
				productgroup: "ALL",
				status: "ALL",
				ordereddatefrom: new Date().setMonth(new Date().getMonth() - 3),
				ordereddateto: new Date(),
				lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 3),
				lastmodifiedto: new Date(),
				farmer: "ALL",
				retailer: "ALL",
				partnerType: "Retailers",
			},
			selectedAdvisorFilters: {
				productgroup: "ALL",
				status: "ALL",
				ordereddatefrom: new Date().setMonth(new Date().getMonth() - 3),
				ordereddateto: new Date(),
				lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 3),
				lastmodifiedto: new Date(),
				farmer: "ALL",
				retailer: "ALL",
				partnerType: "Retailers",
			},
			selectedWalkInFilters: {
				productgroup: "ALL",
				scanstatus: "ALL",
				//custom calender date values
				scannedDateFrom: new Date().setDate(new Date().getDate() - 30),
				scannedDateTo: new Date(),
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
			partnerTypeList: ["Retailers"],
			salesType: ["WALKIN_SALES", "ADVISOR_SALES"],
			partnerType: {
				type: "Retailers",
			},
			selectedSalesType: "WALKIN_SALES",
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
		};
		this.timeOut = 0;
	}
	componentDidMount() {
		let data: any = getLocalStorageData("userData");
		let userData = JSON.parse(data);
		const condSalesType=userData?.role==="RSM"? this.state.salesType: ["WALKIN_SALES"];
		this.setState(
			{
				loggedUserInfo: userData,
				salesType:condSalesType

			},
			() => {
				this.getRetailerList();
				this.getLocationHierachyOrder();
				this.getCountryList();
				this.getHierarchyDatas();
				this.getBatchList();
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

	/**
	 * Retailer and Farmer dropdown list value
	 * @param condIf
	 */
	getRetailerList = (condIf?: any) => {
		const { rsmRetailerList } = apiURL;
		const { selectedAdvisorFilters } = this.state;
		let queryParams = {
			region: this.state.loggedUserInfo?.geolevel1,
			countrycode: this.state.loggedUserInfo?.countrycode,
			retailerid: selectedAdvisorFilters.retailer === "ALL" ? null : selectedAdvisorFilters.retailer,
		};
		let oneTimeUpdate = selectedAdvisorFilters.retailer !== "ALL" && condIf ? true : false;
		invokeGetAuthService(rsmRetailerList, queryParams)
			.then((response) => {
				if (response.data) {
					const { farmers, retailers } = response.data;
					let options = [{ value: "ALL", label: "ALL" }];
					const farmerOptionsList =
						farmers?.length > 0
							? farmers.map((val: any) => {
									return { value: val.farmerid, label: val.farmername };
							  })
							: [];
					const farmerOptions = [...options, ...farmerOptionsList];
					const retailerOptionsList =
						retailers?.length > 0
							? retailers.map((val: any) => {
									return { value: val.userid, label: val.username };
							  })
							: [];
					const retailerOptions = [...options, ...retailerOptionsList];
					const retailerList =
						oneTimeUpdate && this.state.retailerOptions.length ? this.state.retailerOptions : retailerOptions;
					this.setState({
						isLoader: false,
						farmerOptions,
						retailerOptions: retailerList,
						selectedAdvisorFilters: { ...this.state.selectedAdvisorFilters, farmer: "ALL" },
					});
				}
			})
			.catch((error) => {
				this.setState({ isLoader: false });
				ErrorMsg(error);
			});
	};

	/**
	 * To get location hierachy data order list
	 */
	getLocationHierachyOrder = () => {
		const { getTemplateData } = apiURL;
		let data = {
			countryCode: this.state.loggedUserInfo?.countrycode,
		};
		invokeGetAuthService(getTemplateData, data).then((response: any) => {
			let locationData = response.body[0].locationhierarchy;
			let levels: any = [];
			locationData?.length > 0 &&
				locationData.forEach((item: any, index: number) => {
					if (index > 0) {
						let locationhierlevel = item.level;
						let geolevels = "geolevel" + locationhierlevel;
						let obj = { name: item.name, geolevels };
						levels.push(obj);
					}
				});
			this.setState({
				locationData: levels,
			});
		});
	};

	handleSearch = (e: any) => {
		let searchText = e.target.value;
		this.setState({ searchText: searchText, isFiltered: true });
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
		const { selectedSalesType, selectedAdvisorFilters, selectedWalkInFilters } = this.state;
		let val = selectedSalesType === "WALKIN_SALES" ? { ...selectedWalkInFilters } : { ...selectedAdvisorFilters };
		let flag = false;
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
			const name = selectedSalesType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
			this.setState({ [name]: val });
		}
	};
	resetFilter = (e?: any) => {
		let conditionIsFilter = this.state.searchText ? true : false;
		const { selectedSalesType } = this.state;
		const condName = selectedSalesType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
		let val =
			selectedSalesType === "WALKIN_SALES"
				? {
						productgroup: "ALL",
						scanstatus: "ALL",
						scannedDateFrom: new Date().setDate(new Date().getDate() - 30),
						scannedDateTo: new Date(),
						scandatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
						scandateto: moment(new Date()).format("YYYY-MM-DD"),
						retailer: "ALL",
						partnerType: "Retailers",
						scannedPeriod: "",
						batchno: "ALL",
				  }
				: {
						productgroup: "ALL",
						status: "ALL",
						ordereddatefrom: new Date().setMonth(new Date().getMonth() - 3),
						ordereddateto: new Date(),
						lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 3),
						lastmodifiedto: new Date(),
						farmer: "ALL",
						retailer: "ALL",
						partnerType: "Retailers",
				  };
		this.getDynamicOptionFields("reset");
		this.setState(
			{
				[condName]: { ...val },
				isFiltered: conditionIsFilter,
				dateErrMsg: "",
				lastUpdatedDateErr: "",
				ScannedDateErrMsg: "",
			},
			() => {
				// this.toggleFilter();
				this.callChildAPI();
				if (selectedSalesType === "ADVISOR_SALES") this.getRetailerList();
			}
		);
	};

	applyFilter = () => {
		this.setState({ isFiltered: true }, () => {
			this.callChildAPI();
			this.closeToggle();
		});
	};

	download = () => {
		const { selectedSalesType } = this.state;
		selectedSalesType === "WALKIN_SALES" ? this.walkinSalesRef?.download() : this.advisorSalesRef?.download();
	};
	handleDateChange = (date: any, name: string) => {
		const { selectedSalesType, selectedAdvisorFilters, selectedWalkInFilters } = this.state;
		let val = selectedSalesType === "WALKIN_SALES" ? { ...selectedWalkInFilters } : { ...selectedAdvisorFilters };
		// Custom scanned date - check End date
		if (name === "scannedDateTo") {
			if (date >= val.scannedDateFrom) {
				this.setState({
					ScannedDateErrMsg: "",
				});
			} else if (date <= val.scannedDateFrom) {
				this.setState({
					ScannedDateErrMsg: "Scanned End Date should be greater than  Scanned Start Date",
				});
			} else {
				this.setState({
					ScannedDateErrMsg: "Scanned Start Date should be lesser than  Scanned End Date",
				});
			}
		}
		// Custom scanned date - check Start date
		if (name === "scannedDateFrom") {
			if (date <= val.scannedDateTo) {
				this.setState({
					ScannedDateErrMsg: "",
				});
			} else if (date >= val.scannedDateTo) {
				this.setState({
					ScannedDateErrMsg: "Scanned Start Date should be lesser than Scanned End Date",
				});
			} else {
				this.setState({
					ScannedDateErrMsg: "Scanned Start Date should be greater than Scanned End Date",
				});
			}
		}
		// order date - check End date
		if (name === "ordereddateto") {
			if (date >= val.ordereddatefrom) {
				this.setState({
					dateErrMsg: "",
				});
			} else if (date <= val.ordereddatefrom) {
				this.setState({
					dateErrMsg: "Ordered End Date should be greater than  Ordered Start Date",
				});
			} else {
				this.setState({
					dateErrMsg: "Ordered Start Date should be lesser than  Ordered End Date",
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
					dateErrMsg: "Ordered Start Date should be lesser than Ordered End Date",
				});
			} else {
				this.setState({
					dateErrMsg: "Ordered Start Date should be greater than Ordered End Date",
				});
			}
		}
		// Last updated date - check End date
		if (name === "lastmodifiedto") {
			if (date >= val.lastmodifiedfrom) {
				this.setState({
					lastUpdatedDateErr: "",
				});
			} else if (date <= val.lastmodifiedfrom) {
				this.setState({
					lastUpdatedDateErr: "Last Updated End Date should be greater than  Last Updated Start Date",
				});
			} else {
				this.setState({
					lastUpdatedDateErr: "Last Updated Start Date should be lesser than  Last Updated End Date",
				});
			}
		}

		// Last updated date - check Start date
		if (name === "lastmodifiedfrom") {
			if (date <= val.lastmodifiedto) {
				this.setState({
					lastUpdatedDateErr: "",
				});
			} else if (date >= val.lastmodifiedto) {
				this.setState({
					lastUpdatedDateErr: "Last Updated Start Date should be lesser than Last Updated End Date",
				});
			} else {
				this.setState({
					lastUpdatedDateErr: "Last Updated Start Date should be greater than Last Updated End Date",
				});
			}
		}
		const condName = selectedSalesType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
		this.setState({
			[condName]: { ...this.state[condName], [name]: date },
		});
	};

	handleSelect = (event: any, name: string) => {
		this.setState(
			{
				selectedFilters: {
					...this.state.selectedFilters,
					[name]: event.target.value,
				},
			},
			() => {
				if (name === "retailer") {
					let condIf = "retailer";
					this.getRetailerList(condIf);
				}
			}
		);
	};

	handlePartnerChange = (name: string) => {
		this.setState({
			partnerType: {
				type: name,
			},
		});
	};

	handleButtonChange = (name: string, value: string) => {
		this.setState(
			{
				[name]: value,
			},
			() => {
				this.callChildAPI();
			}
		);
	};
	handleReactSelect = (selectedOption: any, e: any, optionName: string) => {
		const { selectedSalesType, selectedAdvisorFilters, selectedWalkInFilters } = this.state;
		const condName = selectedSalesType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
		let val = selectedSalesType === "WALKIN_SALES" ? { ...selectedWalkInFilters } : { ...selectedAdvisorFilters };
		this.setState(
			{
				[condName]: {
					...val,
					[e.name]: selectedOption.value,
				},
				[optionName]: selectedOption,
			},
			() => {
				if (e.name === "retailer") {
					let condIf = "retailer";
					this.getRetailerList(condIf);
				}
			}
		);
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
			soldbygeolevel1: this.state.loggedUserInfo?.geolevel1,
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
		let geolevel1Obj = { label: usergeolevel1, value: usergeolevel1 };
		this.state.geographicFields?.forEach((list: any, i: number) => {
			setFormArray.push({
				name: list,
				placeHolder: true,
				value: list === "geolevel1" && userrole === "RSM" ? geolevel1Obj : { label: "ALL", value: "ALL" },
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
			dynamicFieldVal[index].value = newvalue;
			dynamicFieldVal[index + 1].value = { label: "ALL", value: "ALL" };
			dynamicFieldVal[index + 2].value = { label: "ALL", value: "ALL" };
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
	handlePagination = (data: any[], total: any) => {
		this.setState({
			paginationData: data,
			totalPagination: total,
		});
	};

	hanldeUpdateFilterScan = (value: any, name: string) => {
		const { selectedSalesType, selectedAdvisorFilters, selectedWalkInFilters } = this.state;
		const condName = selectedSalesType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
		let val = selectedSalesType === "WALKIN_SALES" ? { ...selectedWalkInFilters } : { ...selectedAdvisorFilters };
		this.setState(
			{
				[condName]: {
					...val,
					[name]: value,
				},
				isFiltered: true,
			},
			() => {
				this.callChildAPI();
			}
		);
	};
	callChildAPI = () => {
		const { selectedSalesType } = this.state;
		selectedSalesType === "WALKIN_SALES" ? this.walkinSalesRef?.getWalkInSales() : this.advisorSalesRef?.getAdvisorSales();
	};
	handleUpdateSearch = (value: string) => {
		this.setState(
			{
				searchText: value,
				isFiltered: true,
			},
			() => {
				this.callChildAPI();
			}
		);
	};

	render() {
		const {
			isLoader,
			dateErrMsg,
			searchText,
			lastUpdatedDateErr,
			farmerOptions,
			retailerOptions,
			selectedSalesType,
			batchOptions,
			selectedWalkInFilters,
			selectedAdvisorFilters,
			isFiltered,
			ScannedDateErrMsg,
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
								isDisabled={list.name === "geolevel1"}
								id="geolevel-test"
								dataTestId="geolevel-test"
							/>
						</div>
					)}
				</React.Fragment>
			);
		});
		const condToolTipText=selectedSalesType === "WALKIN_SALES" ? "Label,Farmer Name,Product Name,Store Name and ScannedBy" :"Order ID, Retailer Name/ID, Farmer Name/Phone, Advisor Name/ID,Store Name"
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
								condType="Sales Type"
								condTypeList={this.state.salesType}
								isDownload={true}
								selectedPartnerType={this.state.partnerType}
								handlePartnerChange={this.handlePartnerChange}
								toolTipText={`Search applicable for ${condToolTipText}.`}
								buttonChange={this.handleButtonChange}
								condSelectedButton={this.state.selectedSalesType}
								onClose={(node: any) => {
									this.closeToggle = node;
								}}
							>
								{selectedSalesType === "WALKIN_SALES" ? (
									<React.Fragment>
										<label className="pt-2">Product Group</label>
										<div className="form-group pt-1">
											{this.state.productCategories.map((item: any, i: number) => (
												<span className="mr-2 chipLabel" key={i}>
													<Button
														color={
															selectedWalkInFilters.productgroup === item
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
														value={
															batchOptions?.length > 0 &&
															batchOptions.filter(function (option: any) {
																return option.value === selectedWalkInFilters.batchno;
															})
														}
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
															selectedWalkInFilters.scanstatus === item
																? "btn activeColor rounded-pill"
																: "btn rounded-pill boxColor"
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
															selectedWalkInFilters.scannedPeriod === item.label
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
										{selectedWalkInFilters.scannedPeriod === "Custom" && (
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
															value={selectedWalkInFilters.scannedDateFrom}
															dateFormat="dd-MM-yyyy"
															customInput={<Input ref={ref} />}
															selected={selectedWalkInFilters.scannedDateFrom}
															onChange={(date: any) => this.handleDateChange(date, "scannedDateFrom")}
															showMonthDropdown
															showYearDropdown
															dropdownMode="select"
															// maxDate={new Date()}
														/>
													</div>
													<div className="p-2">-</div>

													<div className="user-filter-date-picker">
														<DatePicker
															value={selectedWalkInFilters.scannedDateTo}
															dateFormat="dd-MM-yyyy"
															customInput={<Input ref={ref} />}
															selected={selectedWalkInFilters.scannedDateTo}
															onChange={(date: any) => this.handleDateChange(date, "scannedDateTo")}
															showMonthDropdown
															showYearDropdown
															dropdownMode="select"
															// maxDate={new Date()}
														/>
													</div>
												</div>
												{ScannedDateErrMsg && <span className="error">{ScannedDateErrMsg} </span>}
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
												disabled={ScannedDateErrMsg ? true : false}
												data-testid="apply"
											>
												Apply
												<span>
													<img src={ArrowIcon} className="arrow-i" alt="" /> <img src={RtButton} className="layout" alt="" />
												</span>
											</button>
										</div>
									</React.Fragment>
								) : (
									<React.Fragment>
										<div className="form-group" onClick={(e) => e.stopPropagation()}>
											{/* <ReactSelect
												name="retailer"
												value={selectedRetailerOptions}
												label={"Retailer"}
												handleChange={(selectedOptions: any, e: any) =>
													this.handleReactSelect(selectedOptions, e, "selectedRetailerOptions")
												}
												// handleChange={(e: any) => this.handleSelect(e, "retailer")}
												options={retailerOptions}
												defaultValue="ALL"
												id="retailer-test"
												dataTestId="retailer-test"
											/> */}
											<ReactSelect
												name="retailer"
												value={
													retailerOptions?.length > 0 &&
													retailerOptions.filter(function (option: any) {
														return option.value === selectedAdvisorFilters.retailer;
													})
												}
												label={"Retailer"}
												handleChange={(selectedOptions: any, e: any) =>
													this.handleReactSelect(selectedOptions, e, "selectedRetailerOptions")
												}
												// handleChange={(e: any) => this.handleSelect(e, "retailer")}
												options={retailerOptions}
												defaultValue="ALL"
												id="retailer-test"
												dataTestId="retailer-test"
											/>
										</div>

										<div className="form-group" onClick={(e) => e.stopPropagation()}>
											{/* <ReactSelect
												name="farmer"
												value={selectedFarmerOptions}
												label={"Farmer"}
												handleChange={(selectedOptions: any, e: any) =>
													this.handleReactSelect(selectedOptions, e, "selectedFarmerOptions")
												}
												// handleChange={(e: any) => this.handleSelect(e, "farmer")}
												options={farmerOptions}
												defaultValue="ALL"
												id="farmer-test"
												dataTestId="farmer-test"
											/> */}
											<ReactSelect
												name="farmer"
												value={
													farmerOptions?.length > 0 &&
													farmerOptions.filter(function (option: any) {
														return option.value === selectedAdvisorFilters.farmer;
													})
												}
												label={"Farmer"}
												handleChange={(selectedOptions: any, e: any) =>
													this.handleReactSelect(selectedOptions, e, "selectedFarmerOptions")
												}
												// handleChange={(e: any) => this.handleSelect(e, "farmer")}
												options={farmerOptions}
												defaultValue="ALL"
												id="farmer-test"
												dataTestId="farmer-test"
											/>
										</div>

										<label className="pt-2">Product Group</label>
										<div className="pt-1">
											{this.state.productCategories.map((item: any, i: number) => (
												<span className="mr-2 chipLabel" key={i}>
													<Button
														color={
															selectedAdvisorFilters.productgroup === item
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

										<label className="pt-2">Status</label>
										<div className="pt-1">
											{this.state.advisorStatus.map((item: any, statusIndex: number) => (
												<span className="mr-2" key={statusIndex}>
													<Button
														color={
															selectedAdvisorFilters.status === item
																? "btn activeColor rounded-pill"
																: "btn rounded-pill boxColor"
														}
														size="sm"
														onClick={(e) => this.handleFilterChange(e, "status", item)}
													>
														{item}
													</Button>
												</span>
											))}
										</div>

										<label className="pt-2" htmlFor="order-date">
											Ordered Date
										</label>
										<div className="d-flex">
											<div className="user-filter-date-picker">
												<DatePicker
													id="order-date"
													value={selectedAdvisorFilters.ordereddatefrom}
													dateFormat="dd-MM-yyyy"
													customInput={<Input ref={ref} />}
													selected={selectedAdvisorFilters.ordereddatefrom}
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
													value={selectedAdvisorFilters.ordereddateto}
													dateFormat="dd-MM-yyyy"
													customInput={<Input ref={ref} />}
													selected={selectedAdvisorFilters.ordereddateto}
													onChange={(date: any) => this.handleDateChange(date, "ordereddateto")}
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													maxDate={new Date()}
												/>
											</div>
										</div>
										{dateErrMsg && <span className="error">{dateErrMsg} </span>}
										<label className="pt-2" htmlFor="update-date">
											Last Updated Date
										</label>
										<div className="d-flex">
											<div className="user-filter-date-picker">
												<DatePicker
													id="update-date"
													value={selectedAdvisorFilters.lastmodifiedfrom}
													dateFormat="dd-MM-yyyy"
													customInput={<Input ref={ref} />}
													selected={selectedAdvisorFilters.lastmodifiedfrom}
													onChange={(date: any) => this.handleDateChange(date, "lastmodifiedfrom")}
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													maxDate={new Date()}
												/>
											</div>

											<div className="p-2">-</div>
											<div className="user-filter-date-picker">
												<DatePicker
													value={selectedAdvisorFilters.lastmodifiedto}
													dateFormat="dd-MM-yyyy"
													customInput={<Input ref={ref} />}
													selected={selectedAdvisorFilters.lastmodifiedto}
													onChange={(date: any) => this.handleDateChange(date, "lastmodifiedto")}
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													maxDate={new Date()}
												/>
											</div>
										</div>
										{lastUpdatedDateErr && <span className="error">{lastUpdatedDateErr} </span>}

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
									</React.Fragment>
								)}
							</Filter>

							<div className="scanlog-container">
								{selectedSalesType === "WALKIN_SALES" ? (
									<WalkInSales
										onRef={(node: any) => {
											this.walkinSalesRef = node;
										}}
										paginationRef={this.paginationRef}
										handleUpdate={this.handlePagination}
										loggedUser={this.state.loggedUserInfo}
										searchText={searchText}
										selectedFilters={selectedWalkInFilters}
										isFiltered={isFiltered}
										updateSearch={this.handleUpdateSearch}
									/>
								) : (
									<AdvisorSales
										onRef={(node: any) => {
											this.advisorSalesRef = node;
										}}
										paginationRef={this.paginationRef}
										handleUpdate={this.handlePagination}
										loggedUser={this.state.loggedUserInfo}
										searchText={searchText}
										selectedFilters={selectedAdvisorFilters}
										isFiltered={isFiltered}
										handleFilterScan={this.hanldeUpdateFilterScan}
									/>
								)}
							</div>
						</div>
					</div>
					<div>
						<Pagination
							totalData={
								selectedSalesType === "WALKIN_SALES"
									? this.walkinSalesRef?.state?.totalWalkInData
									: this.advisorSalesRef?.state?.totalAdvisorSalesData
							}
							data={
								selectedSalesType === "WALKIN_SALES"
									? this.walkinSalesRef?.state?.allWalkInSalesData
									: this.advisorSalesRef?.state?.allAdvisorSalesData
							}
							totalLabel={"Sales"}
							onRef={(node: any) => {
								this.paginationRef = node;
							}}
							getRecords={
								selectedSalesType === "WALKIN_SALES"
									? this.walkinSalesRef?.getWalkInSales
									: this.advisorSalesRef?.getAdvisorSales
							}
						/>
					</div>
				</div>
			</AUX>
		);
	}
}

export default SellFarmer;
