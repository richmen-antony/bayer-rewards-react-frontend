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
import OrderProductPopup from "./OrderProductPopup";
import ExpandWindowImg from "../../assets/images/expand-window.svg";
import maxImg from "../../assets/images/maximize.svg";
import CalenderIcon from "../../assets/icons/calendar.svg";
import ActiveIcon from "../../assets/images/check.svg";
import { sortBy } from "../../utility/base/utils/tableSort";
import { Button, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import NativeDropdown from "../../utility/widgets/dropdown/NativeSelect";
import filterIcon from "../../assets/icons/filter_icon.svg";
import Download from "../../assets/icons/download.svg";
import _ from "lodash";
import { downloadCsvFile, ErrorMsg, handledropdownoption } from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import { invokeGetAuthService } from "../../utility/base/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import { SearchInput } from "../../utility/widgets/input/search-input";
import { getLocalStorageData } from "../../utility/base/localStore";
import { CustomButton } from "../../utility/widgets/button";
import Validator from "../../utility/validator";
import { OrderHistroyHeader } from "../../utility/constant";
import Cancel from "../../assets/images/cancel.svg";
import PendingImg from "../../assets/images/not_activated.svg";

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
	},
	// button: {
	// 	boxShadow: "0px 3px 6px #c7c7c729",
	// 	border: "1px solid #89D329",
	// 	borderRadius: "50px",
	// },
}))(MuiDialogActions);

type Props = {};

type States = {
	showPopup: boolean;
	showProductPopup: boolean;
	[key: string]: any;
	isAsc: Boolean;
};
class OrderHistory extends Component<Props, States> {
	tableCellIndex: any = 0;
	timeOut: any;
	constructor(props: any) {
		super(props);
		this.state = {
			showPopup: false,
			showProductPopup: false,
			isAsc: true,
			selectIndex: "",
			isRendered: false,
			pageNo: 1,
			allScanLogs: [],
			actions: ["All", "Distributor", "Retailer"],
			dropDownValue: "Select action",
			scanType: ["All", "Send Goods", "Receive Goods", "Sell to Farmers"],
			productCategories: ["ALL", "HYBRID", "CORN SEED", "HERBICIDES", "FUNGICIDES", "INSECTICIDES"],
			status: ["FULFILLED", "PENDING", "CANCELLED", "EXPIRED"],
			list: ["ALL", "Distributor", "Retailer"],
			selectedFilters: {
				status: "FULFILLED",
				ordereddatefrom: new Date().setMonth(new Date().getMonth() - 3),
				ordereddateto: new Date(),
				lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 3),
				lastmodifiedto: new Date(),
				geolevel1: "ALL",
			},
			dateErrMsg: "",
			searchText: "",
			rowsPerPage: 10,
			totalData: 0,
			isFiltered: false,
			userRole: "",
			tooltipOpen: false,
			startIndex: 1,
			endIndex: 3,
			isLoader: false,
			dropdownOpenFilter: false,
			accordionView: false,
			accordionId: "",
			value: moment(),
			lastUpdatedDateErr: "",
			loggedUserInfo: {},
			regionOptions: [],
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
				this.getAdminOrderList();
				this.getLocationHierachyOrder();
			}
		);
	}
	/**
	 * To get all admin order histroy list
	 * @param filterScan
	 */
	getAdminOrderList = (filterScan?: any) => {
		const { adminOrderList } = apiURL;
		this.setState({ isLoader: true });
		const { selectedFilters, isFiltered, regionOptions } = this.state;
		let data = {
			page: this.state.searchText !== "" ? 1 : this.state.pageNo,
			searchtext: this.state.searchText || null,
			rowsperpage: this.state.rowsPerPage,
			isfiltered: isFiltered,
			countrycode: this.state.loggedUserInfo?.countrycode,
			status: selectedFilters.status === "ALL" ? null : selectedFilters.status,
		};
		if (isFiltered) {
			let filter = { ...selectedFilters };
			filter.ordereddatefrom = moment(filter.ordereddatefrom).format("YYYY-MM-DD");
			filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
			filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format("YYYY-MM-DD");
			filter.lastmodifiedto = moment(filter.lastmodifiedto).format("YYYY-MM-DD");
			// filter.retailer = filterScan ? filterScan : filter.retailer;
			filter.geolevel1 =
				selectedFilters.status === "FULFILLED" ? (filter.geolevel1 === "ALL" ? null : filter.geolevel1) : null;
			data = { ...data, ...filter };
		}
		// regionOption list update one time only using with geolevel1 === "ALL"
		let oneTimeUpdate = selectedFilters.geolevel1 === "ALL" ? true : false;
		invokeGetAuthService(adminOrderList, data)
			.then((response) => {
				let data = response?.body && Object.keys(response?.body).length !== 0 ? response.body.rows : [];
				// unique by geolevel1 region list
				const regionList =
					data?.length > 0 && oneTimeUpdate && selectedFilters.status === "FULFILLED" ? _.uniqBy(data, "geolevel1") : [];
				const regionOptionsList = regionList?.length > 0 ? handledropdownoption(regionList, "geolevel1") : [];
				const regionValues = oneTimeUpdate ? regionOptionsList : regionOptions;
				this.setState({
					isLoader: false,
					allScanLogs: data,
					regionOptions: regionValues,
				});
				const total = response?.totalrows || 0;
				this.setState({ totalData: Number(total) });
			})
			.catch((error) => {
				this.setState({ isLoader: false, allScanLogs: [] }, () => {});
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
		this.setState({ searchText: searchText, isFiltered: true });
		if (this.timeOut) {
			clearTimeout(this.timeOut);
		}
		if (searchText.length >= 3 || searchText.length === 0) {
			this.timeOut = setTimeout(() => {
				this.getAdminOrderList();
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
	/**
	 * To handle filter change
	 * @param e
	 * @param name
	 * @param item
	 */
	handleFilterChange = (e: any, name: string, item: any) => {
		e.stopPropagation();
		let val = { ...this.state.selectedFilters };
		let flag = false;
		if (name === "type") {
			val[name] = e.target.value;
			flag = true;
		} else {
			val[name] = item;
			flag = true;
		}
		if (flag) {
			let isStatusChange = false;
			if (name === "status" && item !== this.state.selectedFilters.status) {
				isStatusChange = true;
			}
			this.setState({ selectedFilters: val }, () => {
				isStatusChange && this.getAdminOrderList();
			});
		}
	};
	/**
	 * To reset selected filter values
	 */
	resetFilter = () => {
		let today = new Date();
		let conditionIsFilter = this.state.searchText ? true : false;
		this.setState(
			{
				selectedFilters: {
					 ...this.state.selectedFilters,
					ordereddatefrom: today.setMonth(today.getMonth() - 3),
					ordereddateto: new Date(),
					lastmodifiedfrom: today.setMonth(today.getMonth() - 3),
					lastmodifiedto: new Date(),
					geolevel1: "ALL",
				},
				isFiltered: conditionIsFilter,
				dateErrMsg: "",
				lastUpdatedDateErr: "",
			},
			() => {
				this.getAdminOrderList();
				this.toggleFilter();
			}
		);
	};
	/**
	 * To applicable filter selection after filter the matching values
	 */
	applyFilter = () => {
		this.setState({ isFiltered: true }, () => {
			this.getAdminOrderList();
			this.toggleFilter();

			// this.resetFilter();
		});
	};
	previous = (pageNo: any) => {
		this.setState({ pageNo: pageNo - 1 }, () => {
			this.getAdminOrderList();
		});
	};
	next = (pageNo: any) => {
		this.setState({ pageNo: pageNo + 1 }, () => {
			this.getAdminOrderList();
		});
	};
	pageNumberClick = (number: any) => {
		this.setState({ pageNo: number }, () => {
			this.getAdminOrderList();
		});
	};

	toggle = () => {
		this.setState({ tooltipOpen: !this.state.tooltipOpen });
	};
	backForward = () => {
		this.setState({
			startIndex: this.state.startIndex - 3,
			endIndex: this.state.endIndex - 1,
		});
	};
	fastForward = () => {
		this.setState({
			startIndex: this.state.endIndex + 1,
			endIndex: this.state.endIndex + 3,
		});
	};
	handlePaginationChange = (e: any) => {
		let value = 0;
		if (e.target.name === "perpage") {
			value = e.target.value;
			this.setState({ rowsPerPage: value }, () => {
				this.getAdminOrderList();
			});
		} else if (e.target.name === "gotopage") {
			// value = e.target.value;
			// this.setState({ pageNo: value }, () => {
			//   this.getAdminOrderList();
			// });
			const { totalData, rowsPerPage } = this.state;
			const pageData = Math.ceil(totalData / rowsPerPage);
			value = e.target.value === "0" || pageData < e.target.value ? "" : e.target.value;
			let isNumeric = Validator.validateNumeric(e.target.value);
			if (isNumeric) {
				this.setState({ pageNo: value }, () => {
					if (this.state.pageNo && pageData >= this.state.pageNo) {
						setTimeout(() => {
							this.state.pageNo && this.getAdminOrderList();
						}, 1000);
					}
				});
			}
		}
	};
	download = () => {
		const { downloadAdminOrderList } = apiURL;
		let filter = { ...this.state.selectedFilters };

		let data = {
			region: this.state.loggedUserInfo?.geolevel1,
			countrycode: this.state.loggedUserInfo?.countrycode,
			isfiltered: this.state.isFiltered,
			searchtext: this.state.searchText || null,
			status: filter.status,
		};
		if (this.state.isFiltered) {
			filter.ordereddatefrom = moment(filter.ordereddatefrom).format("YYYY-MM-DD");
			filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
			filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format("YYYY-MM-DD");
			filter.lastmodifiedto = moment(filter.lastmodifiedto).format("YYYY-MM-DD");
			filter.geolevel1 = filter.status === "FULFILLED" ? (filter.geolevel1 === "ALL" ? null : filter.geolevel1) : null;
			// filter.productgroup = filter.productgroup === "ALL" ? null : filter.productgroup;
			// filter.farmer = filter.farmer === "ALL" ? null : filter.farmer;
			// filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
			// filter.status = filter.status === "ALL" ? null : filter.status;
			data = { ...data, ...filter };
		}
		invokeGetAuthService(downloadAdminOrderList, data)
			.then((response) => {
				const data = response;
				downloadCsvFile(data, "order-history.csv");
			})
			.catch((error) => {});
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
		this.setState({
			selectedFilters: {
				...this.state.selectedFilters,
				[name]: event.target.value,
			},
		});
	};

	filterScans = (filterValue: any) => {
		this.setState({ isFiltered: true, searchText: filterValue }, () => {
			this.getAdminOrderList();
			this.handleClosePopup();
		});
	};

	render() {
		const {
			retailerPopupData,
			showProductPopup,
			isAsc,
			allScanLogs,
			dropdownOpenFilter,
			selectedFilters,
			isLoader,
			dateErrMsg,
			searchText,
			pageNo,
			totalData,
			rowsPerPage,
			lastUpdatedDateErr,
			regionOptions,
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
						<div className="scanlog-table order-history-table">
							<div className="advisor-filter">
								<div className="filter-left-side">
									<SearchInput
										data-testid="search-input"
										name="searchText"
										placeHolder="Search (min 3 letters)"
										type="text"
										onChange={this.handleSearch}
										value={searchText}
										tolltip={`Search applicable for Order ID, ${selectedFilters.status === "FULFILLED" ? "Retailer Name/ID,":""} Farmer Name/Mobile, Advisor Name/ID.`}
									/>
									<div className="filter-right-side">
										<div className="filter-status">
											<label className="font-weight-bold pt-2" style={{ color: "#363636", fontSize: "12px" }}>
												STATUS
											</label>
											<div className="status-list">
												{this.state.status.map((item: any, index: number) => {
													return (
														item !== "ALL" && (
															<span className="mr-2" key={index}>
																<Button
																	color={
																		selectedFilters.status === item
																			? "btn activeColor rounded-pill"
																			: "btn rounded-pill boxColor"
																	}
																	size="md"
																	onClick={(e: any) => this.handleFilterChange(e, "status", item)}
																>
																	{item}
																</Button>
															</span>
														)
													);
												})}
											</div>
										</div>
										<div className="filterRow">
											<Dropdown isOpen={dropdownOpenFilter} toggle={this.toggleFilter}>
												<DropdownToggle>
													{!dropdownOpenFilter && <img src={filterIcon} width="17" alt="filter" />}
												</DropdownToggle>
												<DropdownMenu right>
													<div className="p-3">
														<i className="fa fa-filter boxed float-right" aria-hidden="true" onClick={this.toggleFilter}></i>

														{selectedFilters.status === "FULFILLED" && (
															<div className="form-group" onClick={(e) => e.stopPropagation()}>
																<NativeDropdown
																	name="geolevel1"
																	value={selectedFilters.geolevel1}
																	label={"Region"}
																	handleChange={(e: any) => this.handleSelect(e, "geolevel1")}
																	options={regionOptions}
																	defaultValue="ALL"
																/>
															</div>
														)}
														<label className="font-weight-bold pt-2">
															Ordered Date <span>(6 months interval)</span>
														</label>
														<div className="d-flex">
															<div className="user-filter-date-picker">
																<DatePicker
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
														<label className="font-weight-bold pt-2">
															Last Updated Date <span>(6 months interval)</span>
														</label>
														<div className="d-flex">
															<div className="user-filter-date-picker">
																<DatePicker
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
															<button className="cus-btn-scanlog-filter reset" onClick={this.resetFilter}>
																Reset All
															</button>
															<button
																className="cus-btn-scanlog-filter"
																onClick={this.applyFilter}
																disabled={lastUpdatedDateErr || dateErrMsg ? true : false}
															>
																Apply
																<span>
																	<img src={ArrowIcon} className="arrow-i" alt="" /> <img src={RtButton} className="layout" alt="" />
																</span>
															</button>
														</div>
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
							<div className="scanlog-container">
								<table className="table">
									<thead>
										<tr>
											{OrderHistroyHeader[`${selectedFilters.status}`].length > 0 &&
												OrderHistroyHeader[`${selectedFilters.status}`].map((value: any, index: number) => {
													return (
														<th
															style={value.style}
															onClick={(e) => this.handleSort(e, value.key, allScanLogs, isAsc)}
															key={index}
														>
															{value.label}
															{value.label&&this.tableCellIndex !== undefined ? (
																this.tableCellIndex === index ? (
																	<i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-2`}></i>
																) : null
															) : value.label&& (
																<i className={"fas fa-sort-up ml-2"}></i>
															)}
														</th>
													);
												})}
											{/* <th
                        style={{ width: "10%" }}
                        onClick={(e) =>
                          this.handleSort(
                            e,
                            "advisororderid",
                            allScanLogs,
                            isAsc
                          )
                        }
                      >
                        ORDER ID
                        {this.tableCellIndex !== undefined ? (
                          this.tableCellIndex === 0 ? (
                            <i
                              className={`fas ${
                                isAsc ? "fa-sort-down" : "fa-sort-up"
                              } ml-2`}
                            ></i>
                          ) : null
                        ) : (
                          <i className={"fas fa-sort-up ml-2"}></i>
                        )}
                      </th>
                      <th
                        style={{ width: "16%" }}
                        onClick={(e) =>
                          this.handleSort(e, "username", allScanLogs, isAsc)
                        }
                      >
                        ADVISOR NAME/ID
                        {this.tableCellIndex === 1 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "14%", textAlign: "center" }}
                        onClick={(e) =>
                          this.handleSort(
                            e,
                            "totalintendedquantity",
                            allScanLogs,
                            isAsc
                          )
                        }
                      >
                        INTENDED QTY
                        {this.tableCellIndex === 2 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      
                      <th
                        style={{ width: "12%" }}
                        onClick={(e) =>
                          this.handleSort(e, "totalcost", allScanLogs, isAsc)
                        }
                      >
                        TOTAL COST
                        {this.tableCellIndex === 4 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "16%" }}
                        onClick={(e) =>
                          this.handleSort(e, "farmername", allScanLogs, isAsc)
                        }
                      >
                        FARMER NAME/ID
                        {this.tableCellIndex === 6 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                       <th
                        style={{ width: "10%" }}
                        onClick={(e) =>
                          this.handleSort(e, "farmername", allScanLogs, isAsc)
                        }
                      >
                        Region
                        {this.tableCellIndex === 6 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "10%" }}
                        onClick={(e) =>
                          this.handleSort(e, "orderstatus", allScanLogs, isAsc)
                        }
                      >
                        STATUS
                        {this.tableCellIndex === 7 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "10%" }}
                        onClick={(e) =>
                          this.handleSort(e, "orderstatus", allScanLogs, isAsc)
                        }
                      >
                        REASON
                        {this.tableCellIndex === 7 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
                        ) : null}
                      </th>
                      <th
                        style={{ width: "20%" }}
                        onClick={(e) =>
                          this.handleSort(
                            e,
                            "lastupdateddate",
                            allScanLogs,
                            isAsc
                          )
                        }
                      >
                        UPDATED DATE
                        {this.tableCellIndex === 8 ? (
                          <i
                            className={`fas ${
                              isAsc ? "fa-sort-down" : "fa-sort-up"
                            } ml-2`}
                          ></i>
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
															this.showPopup(event, "showProductPopup");
															this.updateOrderData(value);
														}}
														style={{ cursor: "pointer" }}
														key={i}
													>
														{OrderHistroyHeader[`${selectedFilters.status}`].map((list: any, index: number) => {
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
																		if (list.key === "username") {
																			this.showPopup(event, "showPopup");
																			this.handleUpdateRetailer(value);
																		}
																	}}
																	style={{ textAlign: list?.style?.textAlign ? "center" : "inherit" }}
																	key={index}
																>
																	{list.key === "username" ? (
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
												);
												// return OrderHistroyHeader[`${selectedFilters.status}`].map((key: any, index: number) => {
												// 		 <tr key={i}> return ( <td>{value[key]}</td> </tr>)})
												// return (
												// 	<tr
												// 		onClick={(event) => {
												// 			this.showPopup(event, "showProductPopup");
												// 			this.updateOrderData(value);
												// 		}}
												// 		style={{ cursor: "pointer" }}
												// 	>
												// 		<td>{value.advisororderid}</td>
												// 		<td
												// 			onClick={(event) => {
												// 				this.showPopup(event, "showPopup");
												// 				this.handleUpdateRetailer(value);
												// 			}}
												// 		>
												// 			<div className="retailer-id">
												// 				<p
												// 					style={{
												// 						display: "flex",
												// 						alignItems: "center",
												// 					}}
												// 				>
												// 					<span style={{ flex: "1", whiteSpace: "nowrap" }}>{value.username}</span>
												// 					<img className="retailer-icon" src={ExpandWindowImg} />
												// 				</p>
												// 				<label>{value.userid}</label>
												// 			</div>
												// 		</td>
												// 		<td style={{ textAlign: "center" }}>{value.totalintendedquantity}</td>
												// 		<td>{"MK " + value.totalcost}</td>

												// 		<td>
												// 			<div className="farmer-id">
												// 				<p>{value.farmername}</p>
												// 				<label>{value.farmerid}</label>
												// 			</div>
												// 		</td>
												// 		<td>{"Region"}</td>
												// 		<td>{"NA"}</td>
												// 		<td>
												// 			<span className={`status ${value.orderstatus === "FULFILLED" ? "active" : "inactive"}`}>
												// 				{value.orderstatus === "FULFILLED" ? (
												// 					<img src={ActiveIcon} style={{ marginRight: "8px" }} width="17" />
												// 				) : (
												// 					<i className="fas fa-clock"></i>
												// 				)}
												// 				{/* {value.orderstatus} */}
												// 				{_.startCase(_.toLower(value.orderstatus))}
												// 			</span>
												// 		</td>
												// 		<td>
												// 			{moment(value.lastupdateddate).format("DD/MM/YYYY")}
												// 			<img className="max-image" src={maxImg} />
												// 		</td>
												// 	</tr>
												// );
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
							rowsPerPage={rowsPerPage}
							previous={this.previous}
							next={this.next}
							pageNumberClick={this.pageNumberClick}
							pageNo={pageNo}
							handlePaginationChange={this.handlePaginationChange}
							data={allScanLogs}
							totalLabel={"Sales"}
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
											this.state.locationData.map((location: any, index: number) => {
												return (
													<div className="content-list" key={index}>
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
								handleClick={() => this.filterScans(retailerPopupData.username)}
							/>
						</DialogActions>
					</SimpleDialog>
				) : (
					""
				)}

				{showProductPopup ? (
					<OrderProductPopup open={showProductPopup} close={this.handleCloseProductPopup} data={this.state.orderData} />
				) : (
					""
				)}
			</AUX>
		);
	}
}

export default OrderHistory;
