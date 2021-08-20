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
import maxImg from "../../assets/images/maximize.svg";
import CalenderIcon from "../../assets/icons/calendar.svg";
import ActiveIcon from "../../assets/images/check.svg";
import { sortBy } from "../../utility/base/utils/tableSort";
import { Button} from "reactstrap";
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
import { ScanlogHeader } from "../../utility/constant";
import Cancel from "../../assets/images/cancel.svg";
import PendingImg from "../../assets/images/not_activated.svg";

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

class SellFarmer extends Component<Props, States> {
	tableCellIndex: any = 0;
	timeOut: any;
	paginationRef:any;
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
			status: ["ALL", "FULFILLED"],
			// status: ["ALL", "FULFILLED", "EXPIRED", "DUPLICATE"],
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
				partnerType:"Retailers"
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
			partnerTypeList: ["Retailers"],
			salesType: ["WALKIN_SALES", "ADVISOR_SALES"],
			partnerType: {
				type: "Retailers",
			  },
			selectedSalesType:"WALKIN_SALES"
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
				this.getLocationHierachyOrder();
			}
		);
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
		const { scanLogs } = apiURL;
		const {state,setDefaultPage}= this.paginationRef;
		const pageNo=  !defaultPageNo ? 1 : state.pageNo;

		// set default pagination number 1 and  call the method
		if(!defaultPageNo){
			setDefaultPage();
		}
		this.setState({ isLoader: true });
		const { selectedFilters, isFiltered } = this.state;
		let data = {
			page: pageNo,
			searchtext: this.state.searchText,
			rowsperpage: state.rowsPerPage,
			isfiltered: this.state.isFiltered,
			region: this.state.loggedUserInfo?.geolevel1,
			countrycode: this.state.loggedUserInfo?.countrycode,
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			filter.ordereddatefrom = moment(filter.ordereddatefrom).format("YYYY-MM-DD");
			filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
			filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format("YYYY-MM-DD");
			filter.lastmodifiedto = moment(filter.lastmodifiedto).format("YYYY-MM-DD");
			filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			filter.farmer = filter.farmer === "ALL" ? null : filter.farmer;
			filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			filter.status = filter.status === "ALL" ? null : filter.status;
			filter.partnerType = null
			filter.salesType = null;
			data = { ...data, ...filter };
		}

		invokeGetAuthService(scanLogs, data)
			.then((response) => {
				this.setState({
					isLoader: false,
					allScanLogs: Object.keys(response.body).length !== 0 ? response.body.rows : [],
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
						let locationhierlevel = item.locationhierlevel;
						let geolevels = "geolevel" + locationhierlevel;
						let obj = { name: item.locationhiername, geolevels };
						levels.push(obj);
					}
				});
			this.setState({
				locationData: levels,
			});
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

	handleFilterChange = (e: any, name: string, item: any) => {
		e.stopPropagation();
		let val = this.state.selectedFilters;
		let flag = false;
		// this.state.dateErrMsg = '';
		if (name === "type") {
			val[name] = e.target.value;
			flag = true;
		} else if (name === "startDate") {
			if (e.target.value <= val.endDate) {
				val[name] = e.target.value;
				flag = true;
			} else {
				this.setState({
					dateErrMsg: "Start date should be lesser than End Date",
				});
			}
		} else if (name === "endDate") {
			if (e.target.value >= new Date().toISOString().substr(0, 10)) {
				this.setState({
					dateErrMsg: "End Date should not be greater than todays date",
				});
			} else if (e.target.value <= val.startDate) {
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
					partnerType:"Retailers"
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

	  handleButtonChange =(name:string,value:string)=>{
		this.setState({
		  [name]:value
		})
	
	  }
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
								toolTipText="Search applicable for Order ID, Retailer Name/ID, Farmer Name/ID, Advisor Name/ID."
								buttonChange={this.handleButtonChange}
								condSelectedButton={this.state.selectedSalesType}
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

								<div className="form-group" onClick={(e) => e.stopPropagation()}>
									<NativeDropdown
										name="farmer"
										value={selectedFilters.farmer}
										label={"Farmer"}
										handleChange={(e: any) => this.handleSelect(e, "farmer")}
										options={farmerOptions}
										defaultValue="ALL"
										id="farmer-test"
										dataTestId="farmer-test"
									/>
								</div>

								<label className="font-weight-bold pt-2">Product Group</label>
								<div className="pt-1">
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

								<label className="font-weight-bold pt-2">Status</label>
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

								<label className="font-weight-bold pt-2" htmlFor="order-date">
									Ordered Date
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
								<label className="font-weight-bold pt-2" htmlFor="update-date">
									Last Updated Date
								</label>
								<div className="d-flex">
									<div className="user-filter-date-picker">
										<DatePicker
											id="update-date"
											value={selectedFilters.lastmodifiedfrom}
											dateFormat="dd-MM-yyyy"
											customInput={<Input ref={ref} />}
											selected={selectedFilters.lastmodifiedfrom}
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
											value={selectedFilters.lastmodifiedto}
											dateFormat="dd-MM-yyyy"
											customInput={<Input ref={ref} />}
											selected={selectedFilters.lastmodifiedto}
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
							</Filter>
							{/* <div className="advisor-filter">
								<div className="filter-left-side">
									<SearchInput
										name="searchText"
										data-testid="search-input"
										placeHolder="Search (min 3 letters)"
										type="text"
										onChange={this.handleSearch}
										value={searchText}
										tolltip="Search applicable for Order ID, Retailer Name/ID, Farmer Name/ID, Advisor Name/ID."
									/>
									<div className="filter-right-side">
										<div className="filterRow">
											<Dropdown isOpen={dropdownOpenFilter} toggle={this.toggleFilter}>
												<DropdownToggle>
													{!dropdownOpenFilter && <img src={filterIcon} width="17" alt="filter" />}
												</DropdownToggle>
												<DropdownMenu right>
													<div className="p-3">
														<i className="fa fa-filter boxed float-right" aria-hidden="true" onClick={this.toggleFilter}></i>
														
													</div>
												</DropdownMenu>
											</Dropdown>
										</div>
										<div>
											<button
												className="btn btn-primary"
												onClick={this.download}
												style={{
													backgroundColor: "#1f445a",
													borderColor: "#1f445a",
												}}
											>
												<img src={Download} width="17" alt={NoImage} />
												<span style={{ padding: "15px" }}>Download</span>
											</button>
										</div>
										<i
											className="fa fa-info-circle"
											style={{
												fontSize: "16px",
												fontFamily: "appRegular !important",
												marginLeft: "5px",
												marginTop: "-20px",
											}}
											title={"Full extract"}
										></i>
									</div>
								</div>
							</div>
							 */}
							<div className="scanlog-container">
								<table className="table">
									<thead>
										<tr>
											{ScanlogHeader[`${this.state.selectedSalesType}`].length > 0 &&
												ScanlogHeader[`${this.state.selectedSalesType}`].map((value: any, index: number) => {
													return (
														<th
															style={value.style}
															onClick={(e) => this.handleSort(e, value.key, allScanLogs, isAsc)}
															key={index}
														>
															{value.label}
															{value.label && this.tableCellIndex !== undefined ? (
																this.tableCellIndex === index ? (
																	<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
																) : null
															) : (
																value.label && <i className={"fas fa-sort-up ml-2"}></i>
															)}
														</th>
													);
												})}
											{/* <th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "advisororderid", allScanLogs, isAsc)}>
												ORDER ID
												{this.tableCellIndex !== undefined ? (
													this.tableCellIndex === 0 ? (
														<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
													) : null
												) : (
													<i className={"fas fa-sort-up ml-2"}></i>
												)}
											</th>
											<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "username", allScanLogs, isAsc)}>
												RETAILER NAME/ID
												{this.tableCellIndex === 1 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th
												style={{ width: "14%", textAlign: "center" }}
												onClick={(e) => this.handleSort(e, "totalintendedquantity", allScanLogs, isAsc)}
											>
												INTENDED QTY
												{this.tableCellIndex === 2 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th
												style={{ width: "13%", textAlign: "center" }}
												onClick={(e) => this.handleSort(e, "totalorderedquantity", allScanLogs, isAsc)}
											>
												ORDERED QTY
												{this.tableCellIndex === 3 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "12%" }} onClick={(e) => this.handleSort(e, "totalcost", allScanLogs, isAsc)}>
												TOTAL COST
												{this.tableCellIndex === 4 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "advisorname", allScanLogs, isAsc)}>
												ADVISOR NAME/ID
												{this.tableCellIndex === 5 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "16%" }} onClick={(e) => this.handleSort(e, "farmername", allScanLogs, isAsc)}>
												FARMER NAME/ID
												{this.tableCellIndex === 6 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th style={{ width: "10%" }} onClick={(e) => this.handleSort(e, "orderstatus", allScanLogs, isAsc)}>
												STATUS
												{this.tableCellIndex === 7 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th>
											<th
												style={{ width: "20%" }}
												onClick={(e) => this.handleSort(e, "lastupdateddate", allScanLogs, isAsc)}
											>
												UPDATED DATE
												{this.tableCellIndex === 8 ? (
													<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
												) : null}
											</th> */}
										</tr>
									</thead>
									<tbody>
										{allScanLogs.length > 0 ? (
											allScanLogs.map((value: any, i: number) => {
												return (
													<tr
														onClick={(event) => {
															this.state.selectedSalesType === "ADVISOR_SALES" && this.showPopup(event, "showProductPopup");
															this.updateOrderData(value);
														}}
														style={{ cursor: "pointer" }}
														key={i}
													>
														{ScanlogHeader[`${this.state.selectedSalesType}`].map((list: any, index: number) => {
															const statusColor =
																value.orderstatus === "FULFILLED"
																	? "active"
																	: value.orderstatus === "EXPIRED"
																	? "inactive"
																	: value.orderstatus === "PENDING"
																	? "pending"
																	: "cancelled";
															const statusImg =
																value.orderstatus === "FULFILLED"
																	? ActiveIcon
																	: // : value.orderstatus === "EXPIRED"
																	// ? "inactive"
																	value.orderstatus === "PENDING"
																	? PendingImg
																	: Cancel;

															return (
																<td
																	onClick={(event: any) => {
																		if (list.key === "username" || list.label === "SCANNED BY") {
																			this.showPopup(event, "showPopup");
																			this.handleUpdateRetailer(value);
																		}
																	}}
																	style={{ textAlign: list?.style?.textAlign ? "center" : "inherit" }}
																	key={index}
																>
																	{list.key === "username" || list.label === "SCANNED BY" ||list.label==="PRODUCT NAME" ? (
																		<div className="retailer-id">
																			<p
																				style={{
																					display: "flex",
																					alignItems: "center",
																				}}
																			>
																				<span style={{ flex: "1", whiteSpace: "nowrap" }}>
																					{_.startCase(_.toLower(value.username))}
																					{(this.state.selectedSalesType === "ADVISOR_SALES" && list.key === "username") ||
																					(this.state.selectedSalesType === "WALKIN_SALES" && list.label === "SCANNED BY") ? (
																						<img className="retailer-icon" src={ExpandWindowImg} alt="" />
																					) : null}
																				</span>
																			</p>
																			<label>{value.userid}</label>
																		</div>
																	) : list.key === "farmername" || list.key === "advisorname" ? (
																		<div className="farmer-id">
																			<p>{_.startCase(_.toLower(value[list.key]))}</p>
																			<label>{list.key === "farmername" ? value.farmerphonenumber : value.advisorid}</label>
																		</div>
																	) : list.key === "orderstatus" ? (
																		<span className={`status ${statusColor}`}>
																			{value.orderstatus !== "EXPIRED" ? (
																				<img src={statusImg} style={{ marginRight: "8px" }} width="17" alt="" />
																			) : (
																				<i className="fas fa-clock"></i>
																			)}
																			{_.startCase(_.toLower(value.orderstatus))}
																		</span>
																	) : list?.type === "date" ? (
																		<>{value[list.key] && moment(value[list.key]).format("DD/MM/YYYY")}</>
																	) : !list.label && !list.key ? (
																		<img className="max-image" src={maxImg} alt="" />
																	) : list.key === "totalcost" ? (
																		"MK " + value.totalcost
																	) : (
																		(value[list.key] && _.startCase(_.toLower(value[list.key]))) || ""
																	)}
																</td>
															);
														})}
													</tr>
													// <tr
													// 	onClick={(event) => {
													// 		this.showPopup(event, "showProductPopup");
													// 		this.updateOrderData(value);
													// 	}}
													// 	style={{ cursor: "pointer" }}
													// 	key={i}
													// >
													// 	<td>{value.advisororderid}</td>
													// 	<td
													// 		onClick={(event) => {
													// 			this.showPopup(event, "showPopup");
													// 			this.handleUpdateRetailer(value);
													// 		}}
													// 	>
													// 		<div className="retailer-id">
													// 			<p
													// 				style={{
													// 					display: "flex",
													// 					alignItems: "center",
													// 				}}
													// 			>
													// 				<span style={{ flex: "1", whiteSpace: "nowrap" }}>
													// 					{_.startCase(_.toLower(value.username))}
													// 					<img className="retailer-icon" src={ExpandWindowImg} alt="" />
													// 				</span>
													// 			</p>
													// 			<label>{value.userid}</label>
													// 		</div>
													// 	</td>
													// 	<td style={{ textAlign: "center" }}>{value.totalintendedquantity}</td>
													// 	<td style={{ textAlign: "center" }}>{value.totalorderedquantity}</td>
													// 	<td>{"MK " + value.totalcost}</td>
													// 	<td>
													// 		<div className="farmer-id">
													// 			<p>{_.startCase(_.toLower(value.advisorname))}</p>
													// 			<label>{value.advisorid}</label>
													// 		</div>
													// 	</td>
													// 	<td>
													// 		<div className="farmer-id">
													// 			<p>{_.startCase(_.toLower(value.farmername))}</p>
													// 			<label>{value.farmerid}</label>
													// 		</div>
													// 	</td>
													// 	<td>
													// 		<span className={`status ${value.orderstatus === "FULFILLED" ? "active" : "inactive"}`}>
													// 			{value.orderstatus === "FULFILLED" ? (
													// 				<img src={ActiveIcon} style={{ marginRight: "8px" }} width="17" alt="" />
													// 			) : (
													// 				<i className="fas fa-clock"></i>
													// 			)}
													// 			{/* {value.orderstatus} */}
													// 			{_.startCase(_.toLower(value.orderstatus))}
													// 		</span>
													// 	</td>
													// 	<td>
													// 		{moment(value.lastupdateddate).format("DD/MM/YYYY")}
													// 		<img className="max-image" src={maxImg} alt="" />
													// 	</td>
													// </tr>
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
							onRef={(node:any)=>{
								this.paginationRef= node;
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

export default SellFarmer;