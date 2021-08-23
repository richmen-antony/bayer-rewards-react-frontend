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
import NativeDropdown from "../../utility/widgets/dropdown/NativeSelect";
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
			status: ["ALL", "VALID", "EXPIRED"],
			// status: ["ALL", "FULFILLED", "EXPIRED", "DUPLICATE"],
			list: ["ALL", "Distributor", "Retailer"],
			selectedFilters: {
				productgroup: "ALL",
				status: "ALL",
				ordereddatefrom: new Date().setMonth(new Date().getMonth() - 3),
				ordereddateto: new Date(),
				retailer: "ALL",
				partnerType: "Retailers",
				scannedPeriod: "Today",
				scandateto:new Date().setMonth(new Date().getMonth() - 3),
				scandatefrom:new Date().setMonth(new Date().getMonth() - 3)

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
				{ label: "Today",from: moment(new Date).format("YYYY-MM-DD"),to: moment(new Date).format("YYYY-MM-DD")},
				{ label: "This week (Sun - Sat)", from:moment().startOf('week').format('YYYY-MM-DD'),to:moment().endOf('week').format('YYYY-MM-DD') },
				{ label: "Last 30 days", from :moment().subtract(30, 'days').format("YYYY-MM-DD"),to:moment(new Date).format("YYYY-MM-DD")},
				{ label: "This year (Jan - Dec)", from :moment().startOf('year').format("YYYY-MM-DD"),to:moment().endOf("year").format("YYYY-MM-DD")},
				{ label: "Prev. year (Jan - Dec)",from:moment().subtract(1, 'years').startOf('year').format("YYYY-MM-DD"), to :moment().subtract(1, 'years').endOf('year').format("YYYY-MM-DD")},
				{ label: "Custom", value: "" },
			],
			scanTypeList: ["SG - ST", "SG - D2R"],
			selectedScanType: "SG - ST",
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
				this.getRetailerList();
				//API to get country and language settings
				this.getCountryList();
				this.getHierarchyDatas();
			}
		);
	}
	getCountryList() {
		let res = [
			{ value: "India", text: "India" },
			{ value: "Malawi", text: "Malawi" },
		];
		this.setState({ countryList: res });
	}
	/**
	 * Retailer and Farmer dropdown list value
	 * @param condIf
	 */
	getRetailerList = (condIf?: any) => {
		const { rsmRetailerList } = apiURL;
		const { selectedFilters } = this.state;
		let queryParams = {
			region: this.state.loggedUserInfo?.geolevel1,
			countrycode: this.state.loggedUserInfo?.countrycode,
			retailerid: selectedFilters.retailer === "ALL" ? null : selectedFilters.retailer,
		};
		let oneTimeUpdate = selectedFilters.retailer !== "ALL" && condIf ? true : false;
		invokeGetAuthService(rsmRetailerList, queryParams)
			.then((response) => {
				if (response.data) {
					const { farmers, retailers } = response.data;
					const farmerOptions =
						farmers?.length > 0
							? farmers.map((val: any) => {
									return { value: val.farmerid, text: val.farmername };
							  })
							: [];

					const retailerOptions =
						retailers?.length > 0
							? retailers.map((val: any) => {
									return { value: val.userid, text: val.username };
							  })
							: [];
					const retailerList =
						oneTimeUpdate && this.state.retailerOptions.length ? this.state.retailerOptions : retailerOptions;
					this.setState({
						isLoader: false,
						farmerOptions,
						retailerOptions: retailerList,
					});
				}
			})
			.catch((error) => {
				this.setState({ isLoader: false });
				ErrorMsg(error);
				console.log("error", error);
			});
	};
	getScanLogs = (defaultPageNo?: any) => {
		const { getScanLog } = apiURL;
		const { state, setDefaultPage } = this.paginationRef;
		const pageNo = !defaultPageNo ? 1 : state.pageNo;

		// set default pagination number 1 and  call the method
		if (!defaultPageNo) {
			setDefaultPage();
		}
		this.setState({ isLoader: true });
		const { selectedFilters, isFiltered, selectedScanType} = this.state;
		let data = {
			page: pageNo,
			searchtext: this.state.searchText || null,
			rowsperpage: state.rowsPerPage,
			isfiltered: this.state.isFiltered,
			// region: this.state.loggedUserInfo?.geolevel1,
			countrycode: this.state.loggedUserInfo?.countrycode,
			scantype:selectedScanType=== "SG - ST" ? "SCAN_OUT_ST_D2D":"SCAN_OUT_D2R"
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			filter.ordereddatefrom = moment(filter.ordereddatefrom).format("YYYY-MM-DD");
			filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.partnerType = null;
			data = { ...data, ...filter };
		}

		invokeGetAuthService(getScanLog, data)
			.then((response) => {
				let data = response?.body && Object.keys(response?.body).length !== 0 ? response.body.rows : [];
				this.setState({
					isLoader: false,
					allScanLogs: data,
				});
				const total = response.body?.totalrows;
				this.setState({ totalData: Number(total) });
			})
			.catch((error) => {
				this.setState({ isLoader: false, allScanLogs: [] }, () => {});
				ErrorMsg(error);
				console.log("error", error);
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
	handleUpdateRetailer(value: any) {
		this.setState({
			retailerPopupData: value,
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
	}

	toggleFilter = () => {
		this.setState((prevState) => ({
			dropdownOpenFilter: !prevState.dropdownOpenFilter,
		}));
	};

	handleFilterChange = (e: any, name: string, item: any,itemList?:any) => {
		e.stopPropagation();
		let val = this.state.selectedFilters;
		let flag = false;
		console.log("item",itemList&&itemList);
		// this.state.dateErrMsg = '';
		if (name === "type") {
			val[name] = e.target.value;
			flag = true;
		} else if (name==="scannedPeriod" && item!=="Custom") {
			val["scandatefrom"]=itemList?.from;
			val["scandatefto"]=itemList?.to;
			val[name] = item;
			flag = true;
		}
		else {
			val[name] = item;
			
			flag = true;
		}
		if (flag) {
			console.log({val});
			this.setState({ selectedFilters: val });
		}
	};

	resetFilter = (e?: any) => {
		let today = new Date();
		let conditionIsFilter = this.state.searchText ? true : false;
		this.setState(
			{
				selectedFilters: {
					productgroup: "ALL",
					status: "ALL",
					ordereddatefrom: today.setMonth(today.getMonth() - 3),
					ordereddateto: new Date(),
					lastmodifiedfrom: today.setMonth(today.getMonth() - 3),
					lastmodifiedto: new Date(),
					farmer: "ALL",
					retailer: "ALL",
					partnerType: "Retailers",
					scannedPeriod: "Today",
				},
				isFiltered: conditionIsFilter,
				dateErrMsg: "",
				lastUpdatedDateErr: "",
			},
			() => {
				this.getScanLogs();
				this.toggleFilter();
				this.getRetailerList();
			}
		);
	};

	applyFilter = () => {
		this.setState({ isFiltered: true, inActiveFilter: false }, () => {
			this.getScanLogs();
			this.toggleFilter();

			// this.resetFilter();
		});
	};
	toggle = () => {
		this.setState({ tooltipOpen: !this.state.tooltipOpen });
	};

	download = () => {
		const { downloadScanlogs } = apiURL;

		let data = {
			region: this.state.loggedUserInfo?.geolevel1,
			countrycode: this.state.loggedUserInfo?.countrycode,
			isfiltered: this.state.isFiltered,
			searchtext: this.state.searchText,
		};
		if (this.state.isFiltered) {
			let filter = { ...this.state.selectedFilters };
			filter.ordereddatefrom = moment(filter.ordereddatefrom).format("YYYY-MM-DD");
			filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
			filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format("YYYY-MM-DD");
			filter.lastmodifiedto = moment(filter.lastmodifiedto).format("YYYY-MM-DD");
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.farmer = filter.farmer === "ALL" ? null : filter.farmer;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.status = filter.status === "ALL" ? null : filter.status;

			data = { ...data, ...filter };
		}
		invokeGetAuthService(downloadScanlogs, data)
			.then((response) => {
				const data = response;
				downloadCsvFile(data, "scanlogs.csv");
			})
			.catch((error) => {
				console.log({ error });
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

	filterScans = (filterValue: any) => {
		this.setState(
			{ isFiltered: true, inActiveFilter: false, selectedFilters: { ...this.state.selectedFilters, retailer: filterValue } },
			() => {
				this.getScanLogs();
				this.handleClosePopup();
				let condIf = "retailer";
				this.getRetailerList(condIf);
			}
		);
	};

	handlePartnerChange = (name: string) => {
		this.setState(
			{
				partnerType: {
					type: name,
				},
			},
			() => {
				this.getScanLogs();
			}
		);
	};
	handleButtonChange = (name: string, value: string) => {
		this.setState({
			[name]: value,
		});
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
					levelsName.push(item.locationhiername.toLowerCase());
					let locationhierlevel = item.locationhierlevel;
					let geolevels = "geolevel" + locationhierlevel;
					levels.push(geolevels);
				});
				let levelsData: any = [];
				locationData?.length > 0 &&
					locationData.forEach((item: any, index: number) => {
						if (index > 0) {
							let locationhierlevel = item.locationhierlevel;
							let geolevels = "geolevel" + locationhierlevel;
							let obj = { name: item.locationhiername, geolevels };
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
			let level1Info = { text: item.name, code: item.code, value: item.name };
			level1Options.push(level1Info);
		});
		let setFormArray: any = [];
		this.state.geographicFields?.forEach((list: any, i: number) => {
			setFormArray.push({
				name: list,
				placeHolder: true,
				value: list === "geolevel0" ? this.state.loggedUserInfo?.country : "",
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
			let filteredLevel1 = geolevel1List?.filter((level1: any) => level1.name === value);
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
			let geolevel3Obj = [{ text: "ALL", code: "ALL", name: "ALL", value: "ALL" }];
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
			this.setState((prevState: any) => ({
				dynamicFields: dynamicFieldVal,
				selectedFilters: {
					...prevState.selectedFilters,
					geolevel3: "ALL",
				},
			}));
		}
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
			farmerOptions,
			retailerOptions,
		} = this.state;

		const pageNumbers = [];
		const pageData = Math.ceil(this.state.totalData / this.state.rowsPerPage);
		for (let i = 1; i <= pageData; i++) {
			pageNumbers.push(i);
		}
		const fields = this.state.dynamicFields;
		console.log({ fields });
		const locationList = fields?.map((list: any, index: number) => {
			let nameCapitalized = levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
			return (
				<React.Fragment key={`geolevels` + index}>
					{index !== 0 && list.name !== "geolevel3" && list.name !== "geolevel4" && list.name !== "geolevel5" && (
						<div className="col" style={{ marginBottom: "5px" }}>
							<NativeDropdown
								name={list.name}
								label={nameCapitalized}
								options={list.options}
								handleChange={(e: any) => {
									e.stopPropagation();
									list.value = e.target.value;
									this.getOptionLists("manual", list.name, e.target.value, index);
									//   this.handleUpdateDropdown(e.target.value, list.name);
								}}
								value={list.value}
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
								toolTipText="Search applicable for Customer Name, Product Name"
								condType="Scan Type"
								condTypeList={this.state.scanTypeList}
								buttonChange={this.handleButtonChange}
								condSelectedButton={this.state.selectedScanType}
							>
								<div className="form-group" onClick={(e) => e.stopPropagation()}>
									<NativeDropdown
										name="retailer"
										value={selectedFilters.retailer}
										label={"Retailer"}
										handleChange={(e: any) => this.handleSelect(e, "retailer")}
										options={retailerOptions}
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
											<NativeDropdown
												name="region"
												value={selectedFilters.region}
												label={"Batch #"}
												handleChange={(e: any) => this.handleSelect(e, "region")}
												options={farmerOptions}
												defaultValue="ALL"
												id="region-test"
												dataTestId="region-test"
											/>
										</div>
										<div className="col">
											<NativeDropdown
												name="region"
												value={selectedFilters.region}
												label={"Label ID"}
												handleChange={(e: any) => this.handleSelect(e, "region")}
												options={farmerOptions}
												defaultValue="ALL"
												id="region-test"
												dataTestId="region-test"
											/>
										</div>
										
									</div>
								</div>
								<label className="font-weight-bold pt-2"> Scan Status</label>
								<div className="pt-1">
									{this.state.status.map((item: any, statusIndex: number) => (
										<span className="mr-2" key={statusIndex}>
											<Button
												color={
													selectedFilters.status === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"
												}
												size="sm"
												onClick={(e) => this.handleFilterChange(e, "status", item)}
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
													selectedFilters.scannedPeriod === item.label
														? "btn activeColor rounded-pill"
														: "btn rounded-pill boxColor"
												}
												size="sm"
												onClick={(e) => this.handleFilterChange(e, "scannedPeriod", item.label,item)}
												style={{ marginBottom: "5px" }}
											>
												{item.label}
											</Button>
										</span>
									))}
								</div>
								{selectedFilters.scannedPeriod === "Custom" && (
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
													value={selectedFilters.ordereddatefrom}
													dateFormat="dd-MM-yyyy"
													customInput={<Input ref={ref} />}
													selected={selectedFilters.ordereddatefrom}
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
													value={selectedFilters.ordereddateto}
													dateFormat="dd-MM-yyyy"
													customInput={<Input ref={ref} />}
													selected={selectedFilters.ordereddateto}
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
							</Filter>
							<div className="scanlog-container">
								<table className="table">
									<thead>
										<tr>
											<th style={{ width: "12%" }} onClick={(e) => this.handleSort(e, "advisororderid", allScanLogs, isAsc)}>
												LABEL/BATCH ID
												{this.tableCellIndex !== undefined ? (
													this.tableCellIndex === 0 ? (
														<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
													) : null
												) : (
													<i className={"fas fa-sort-up ml-2"}></i>
												)}
											</th>
											<th style={{ width: "18%" }} onClick={(e) => this.handleSort(e, "username", allScanLogs, isAsc)}>
												CUSTOMER NAME/ID
												{this.tableCellIndex === 1 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th
												style={{ width: "16%" }}
												onClick={(e) => this.handleSort(e, "totalorderedquantity", allScanLogs, isAsc)}
											>
												PRODUCT NAME
												{this.tableCellIndex === 3 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "12%" }} onClick={(e) => this.handleSort(e, "totalcost", allScanLogs, isAsc)}>
												CHANNEL TYPE
												{this.tableCellIndex === 4 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "advisorname", allScanLogs, isAsc)}>
												SCANNED ON
												{this.tableCellIndex === 5 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "farmername", allScanLogs, isAsc)}>
												SCANNED BY
												{this.tableCellIndex === 6 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											{this.state.selectedScanType === "SG - D2R" && (
												<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "orderstatus", allScanLogs, isAsc)}>
													STORE NAME
													{this.tableCellIndex === 7 ? (
														<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
													) : null}
												</th>
											)}
											<th
												style={{ width: "10%" }}
												onClick={(e) => this.handleSort(e, "lastupdateddate", allScanLogs, isAsc)}
											>
												REGION
												{this.tableCellIndex === 8 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th
												style={{ width: "15%" }}
												onClick={(e) => this.handleSort(e, "lastupdateddate", allScanLogs, isAsc)}
											>
												EXPIRY DATE
												{this.tableCellIndex === 8 ? (
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
															this.showPopup(event, "showProductPopup");
															this.updateOrderData(value);
														}}
														style={{ cursor: "pointer" }}
														key={i}
													>
														<td>
															{value.advisororderid}
															<p>
																<span
																	className={`status-label ${value.orderstatus === "FULFILLED" ? "active" : "inactive"}`}
																>
																	Valid
																</span>{" "}
																- #234524
															</p>
														</td>
														<td
															onClick={(event) => {
																this.showPopup(event, "showPopup");
																this.handleUpdateRetailer(value);
															}}
														>
															<div className="retailer-id">
																<p
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	<span style={{ flex: "1", whiteSpace: "nowrap" }}>
																		{_.startCase(_.toLower(value.username))}
																		<img className="retailer-icon" src={ExpandWindowImg} alt="" />
																	</span>
																</p>
																<label>{value.userid + "- Retailer"}</label>
															</div>
														</td>
														<td>
															<div className="retailer-id">
																<p
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	<span style={{ flex: "1", whiteSpace: "nowrap" }}>
																		{_.startCase(_.toLower(value.username))}
																		<img className="retailer-icon" src={ExpandWindowImg} alt="" />
																	</span>
																</p>
																<label>{value.userid + "- Corn"}</label>
															</div>
														</td>
														<td>{"MK " + value.totalcost}</td>
														<td>{moment(value.lastupdateddate).format("DD/MM/YYYY")}</td>
														<td>
															<div className="farmer-id">
																<p>{_.startCase(_.toLower(value.farmername))}</p>
																<label>{value.farmerid}</label>
															</div>
														</td>
														{this.state.selectedScanType === "SG - D2R" && <td>{value.storename}</td>}
														<td>{value.geolevel1}</td>
														<td>{moment(value.lastupdateddate).format("DD/MM/YYYY")}</td>
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
							totalLabel={"Sales"}
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
											{retailerPopupData.username}, <label>{popupHeader?.sub}</label>{" "}
										</p>
									</div>
									<div className="popup-content-row">
										<div className="content-list">
											<label>Username</label>
											<p>{retailerPopupData.userid}</p>
										</div>
										<div className="content-list">
											<label>Account Name</label>
											<p>{retailerPopupData.accountname}</p>
										</div>
										<div className="content-list">
											<label>Phone Number</label>
											<p>{retailerPopupData.phonenumber}</p>
										</div>
										{this.state.locationData?.length > 0 &&
											this.state.locationData.map((location: any, locationIndex: number) => {
												return (
													<div className="content-list" key={locationIndex}>
														<label>{_.startCase(_.toLower(location.name))}</label>
														<p>{retailerPopupData[location.geolevels]}</p>
													</div>
												);
											})}
										<div className="content-list">
											<label>Postal Code</label>
											<p>{retailerPopupData.billingzipcode}</p>
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
								handleClick={() => this.filterScans(retailerPopupData.userid)}
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
