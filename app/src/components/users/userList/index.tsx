import React, { Component } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import NativeDropdown from "../../../utility/widgets/dropdown/NativeSelect";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import AUX from "../../../hoc/Aux_";
import { sortBy } from "../../../utility/base/utils/tableSort";
import { apiURL } from "../../../utility/base/utils/config";
import { invokeGetAuthService } from "../../../utility/base/service";
import filterIcon from "../../../assets/icons/filter_icon.svg";
import Download from "../../../assets/icons/download.svg";
import cross from "../../../assets/icons/cross.svg";
import SearchIcon from "../../../assets/icons/search_icon.svg";
import NoImage from "../../../assets/images/no_image.svg";
import Loader from "../../../utility/widgets/loader";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import "../../../assets/scss/users.scss";
import { DownloadCsv } from "../../../utility/helper";
import leftArrow from "../../../assets/icons/left_arrow.svg";
import { Input } from "../../../utility/widgets/input";
import Logs from "../../../assets/icons/logs.svg";
import ChannelPartners from "./channelPartners";
import ThirdPartyUsers from "./thirdPartyUsers";
import ChangeLogs from "./changeLogs";
import ArrowIcon from "../../../assets/icons/tick.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import {SearchInput} from "../../../utility/widgets/input/search-input";
type SelectedFiltersTypes = {
  region: string;
  epa: string;
  district: string;
  status: string;
  startDate: any;
  endDate: any;
  [key: string]: string;
};
type PartnerTypes = {
  type: String;
};
type Props = {
  location?: any;
  history?: any;
  classes?: any;
};

type States = {
  selectIndex: string;
  isAsc: boolean;
  isRendered: boolean;
  pageNo: number;
  allChannelPartners: Array<any>;
  allThirdParty: Array<any>;
  dropDownValue: string;
  productCategories: Array<any>;
  status: Array<any>;
  list: Array<any>;
  selectedFilters: SelectedFiltersTypes;
  dateErrMsg: string;
  searchText: string;
  rowsPerPage: number;
  gotoPage: number;
  totalData: number;
  isFiltered: boolean;
  userRole: string;
  startIndex: number;
  endIndex: number;
  isLoader: boolean;
  dropdownOpenFilter: boolean;
  accordionView: boolean;
  accordionId: string;
  dialogOpen: boolean;
  changeLogOpen: boolean;
  isActivateUser: boolean;
  isdeActivateUser: boolean;
  isEditUser: boolean;
  value: number;
  userStatus: Array<any>;
  geographicFields: Array<any>;
  dynamicFields: Array<any>;
  countryList: Array<any>;
  hierarchyList: Array<any>;
  partnerType: PartnerTypes;
};

const AntTabs = withStyles({
  root: {
    borderBottom: "0",
  },
  indicator: {
    backgroundColor: "#1890ff",
    height: "4px",
  },
})(Tabs);
const useStyles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  // padding: {
  //   padding: theme.spacing(3),
  // },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
});
const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:hover": {
        color: "#40a9ff",
        opacity: 1,
      },
      "&$selected": {
        color: "#1890ff",
        fontWeight: theme.typography.fontWeightMedium,
      },
      "&:focus": {
        color: "#40a9ff",
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface StyledTabProps {
  label: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2} className="row align-items-center" style={{ padding: "0" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

class UserList extends Component<Props, States> {
  timeOut: any;
  constructor(props: any) {
    super(props);
    var today = new Date();
    var month, day, year;
    var year: any = today.getFullYear();
    var month: any = today.getMonth();
    var date = today.getDate();
    if (month - 6 <= 0) year = today.getFullYear();
    var backdate = new Date(year, month - 6, date);
    this.state = {
      selectIndex: "",
      isAsc: true,
      isRendered: false,
      pageNo: 1,
      dropDownValue: "Select action",
      productCategories: [],
      status: ["All", "Valid", "Invalid"],
      list: ["Retailer", "Distributor"],
      selectedFilters: {
        region: "All",
        epa: "All",
        district: "All",
        status: "All",
        startDate: backdate.toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
      },
      partnerType: {
        type: "Retailer",
      },
      dateErrMsg: "",
      searchText: "",
      rowsPerPage: 15,
      gotoPage: 1,
      totalData: 0,
      isFiltered: false,
      userRole: "",
      startIndex: 1,
      endIndex: 3,
      isLoader: false,
      dropdownOpenFilter: false,
      accordionView: false,
      accordionId: "",
      allChannelPartners: [],
      allThirdParty: [],
      dialogOpen: false,
      changeLogOpen: false,
      isActivateUser: false,
      isdeActivateUser: false,
      isEditUser: false,
      value: 0,
      userStatus: ["All", "Active", "Inactive", "Not Activated"],
      geographicFields: [],
      dynamicFields: [],
      countryList: [],
      hierarchyList: [],
    };
    this.timeOut = 0;
  }
  componentDidMount() {
    this.getChannelPartnersList();
    this.getThirdPartysList();
    ///API to get country and language settings
    this.getCountryList();
    this.getGeographicFields();
    this.getNextHierarchy("MALAWI", this.state.geographicFields[1]);
    setTimeout(() => {
      this.getDynamicOptionFields();
    }, 0);

    // let data: any = getLocalStorageData("userData");
    // let userData = JSON.parse(data);

    // this.setState({
    //   userRole: userData.role,
    // });
  }

  getChannelPartnersList = (condIf?: string) => {
    this.setState({ allChannelPartners: [] })
    const { channelPartnersList } = apiURL;
    this.setState({ isLoader: true });
    let { status, startDate, endDate, region, epa, district }: any =
    this.state.selectedFilters;
    let enddateformat = new Date(endDate);
    let dateformat = enddateformat.toJSON();
    let data = {
      countrycode: 'MW',
      page: this.state.pageNo,
      searchtext: this.state.searchText,
      isfiltered: this.state.isFiltered,
      rowsperpage: this.state.rowsPerPage,
      usertype: "EXTERNAL",
      partnertype:
        this.state.partnerType.type === "Distributor"
          ? "DISTRIBUTOR"
          : this.state.partnerType.type === "All"
          ? "ALL"
          : "RETAILER",
    };
    if (this.state.isFiltered) {
      let filter = {
        status: status,
        // lastmodifieddatefrom: startDate,
        // lastmodifieddateto: endDate,
        region,
        epa,
        district,
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
        console.log(error, "error");
      });
  };

  getThirdPartysList = () => {
    const { channelPartnersList } = apiURL;
    this.setState({ isLoader: true });
    let data = {
      page: this.state.pageNo,
      searchtext: this.state.searchText,
      rowsperpage: this.state.rowsPerPage,
      usertype: "THIRD PARTY",
    };

    invokeGetAuthService(channelPartnersList, data)
      .then((response) => {
        this.setState({
          isLoader: false,
          allThirdParty:
            Object.keys(response.body).length !== 0 ? response.body.rows : [],
        });
        const total = response.body.rows.count();
        this.setState({ totalData: total });
      })
      .catch((error) => {
        this.setState({ isLoader: false });
        console.log(error, "error");
      });
  };

  getCountryList() {
    //service call
    let res = [
      { value: "IND", text: "INDIA" },
      { value: "MAL", text: "Malawi" },
    ];
    this.setState({ countryList: res });
  }
  getNextHierarchy(country: any, nextLevel: any) {
    //API to get state options for initial set since mal is default option in country
    const data = {
      type: country,
      id: nextLevel,
    };

    let nextHierarchyResponse = [
      { text: "All", value: "All" },
      { text: "Central", value: "Central" },
      { text: "Northern", value: "Northern" },
      { text: "Western", value: "Western" },
      { text: "Eastern", value: "Eastern" },
    ];
    this.setState({ hierarchyList: nextHierarchyResponse });
  }
  getGeographicFields() {
    let res = ["country", "region", "district", "epa", "village"];
    setTimeout(() => {
      this.setState({ geographicFields: res });
    }, 0);
  }
  getDynamicOptionFields() {
    let setFormArray: any = [];
    this.state.geographicFields.map((list: any, i: number) => {
      setFormArray.push({
        name: list,
        placeHolder: true,
        value: list === "country" ? "MALAWI" : "All",
        options:
          list === "country"
            ? this.state.countryList
            : i == 1
            ? this.state.hierarchyList
            : "",
        error: "",
      });
    });
    this.setState({ dynamicFields: setFormArray });
  }

  getOptionLists = (e: any, index: any) => {
    e.stopPropagation();
    let regionResponse = [
      { text: "All", value: "All" },
      { text: "Central", value: "central" },
      { text: "Bangalore", value: "Bangalore" },
    ];
    let districtResponse = [
      { text: "All", value: "All" },
      { text: "Balaka", value: "Balaka" },
      { text: "Blantyre", value: "Blantyre" },
    ];
    let epaResponse = [
      { text: "All", value: "All" },
      { text: "EPA1", value: "epa1" },
      { text: "EPA2", value: "epa2" },
    ];
    let villageResponse = [
      { text: "All", value: "All" },
      { text: "Village1", value: "Village1" },
      { text: "Village2", value: "Village2" },
    ];

    this.state.dynamicFields.map((list: any) => {
      if (list.name === "region") {
        list.options = this.state.hierarchyList;
      } else if (list.name === "district") {
        list.options = districtResponse;
      } else if (list.name === "epa") {
        list.options = epaResponse;
      } else if (list.name === "village") {
        list.options = villageResponse;
      }
    });
  };

  download = () => {
    const { downloadUserList } = apiURL;

    let data = {
      searchtext: this.state.searchText,
      usertype: "CHANNEL PARTNER",
      partnertype: "Retailer",
    };
    let { status, startDate, endDate, region, epa, district }: any =
      this.state.selectedFilters;

    let filter = {
      isfiltered: true,
      status: status,
      effectivefrom: startDate,
      expirydate: endDate,
      region,
      epa,
      district,
    };
    data = { ...data, ...filter };

    invokeGetAuthService(downloadUserList, data)
      .then((response) => {
        const data = response?.body?.rows;
        DownloadCsv(data, "user.csv");
      })
      .catch((error) => {
        this.setState({ isLoader: false });
        console.log(error, "error");
      });
  };

  //   getProductCategory = () => {
  //     const { productCategory } = apiURL;
  //     this.setState({ isLoader: true });
  //     invokeGetAuthService(productCategory).then((response) => {
  //       this.setState({
  //         isLoader: false,
  //         productCategories:
  //           Object.keys(response.body).length !== 0 ? response.body.rows : [],
  //       });
  //     });
  //     setTimeout(() => {
  //       this.setState({
  //         productCategories: ["All", ...this.state.productCategories],
  //       });
  //     }, 3000);
  //   };

  handleExpand = (data: any) => {
    data.isExpand = !data.isExpand;
    this.setState({
      isRendered: true,
      accordionView: !this.state.accordionView,
      accordionId: data.productlabelid,
    });
  };

  onSort = (name: string, data: any, isAsc: boolean) => {
    let response = sortBy(name, data);
    this.setState({ allChannelPartners: response, isAsc: !isAsc });
  };

  toggleFilter = (e: any) => {
    this.setState((prevState) => ({
      dropdownOpenFilter: !prevState.dropdownOpenFilter,
    }));
  };
  handleFilterChange = (e: any, name: string, item: any) => {
    console.log('datetime', e.target.value)
    e.stopPropagation();
    let val = this.state.selectedFilters;
    let flag = false;
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
      this.setState({ selectedFilters: val }, () => {
        console.log("status", this.state.selectedFilters);
      });
    }
  };

  handlePartnerChange = (name: String) => {
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

  resetFilter = (e: any) => {
    e.stopPropagation();
    this.setState(
      {
        selectedFilters: {
          region: "All",
          epa: "All",
          district: "All",
          status: "All",
          startDate: new Date().toISOString().substr(0, 10),
          endDate: new Date().toISOString().substr(0, 10),
        },
        isFiltered: false,
      },
      () => {
        console.log("testi", this.state.selectedFilters);
      }
    );
    setTimeout(() => {
      //   this.getScanLogs();
    }, 0);
  };

  handleSearch = (e: any) => {
    // alert('hi');
    let searchText = e.target.value;
    this.setState({ searchText: searchText });
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    if (searchText.length >= 3 || searchText.length == 0) {
      this.timeOut = setTimeout(() => {
        this.getChannelPartnersList();
      }, 1000);
    }
  };
  applyFilter = () => {
    this.setState({ isFiltered: true }, () => {
      this.getChannelPartnersList("filter");
    });

    // this.timeOut = setTimeout(() => {
    //   this.getScanLogs();
    // }, 0);
  };
  previous = (pageNo: any) => {
    this.setState({ pageNo: pageNo - 1 });
    setTimeout(() => {
      this.getChannelPartnersList();
    }, 0);
  };
  next = (pageNo: any) => {
    this.setState({ pageNo: pageNo + 1 });
    setTimeout(() => {
      this.getChannelPartnersList();
    }, 0);
  };
  pageNumberClick = (number: any) => {
    this.setState({ pageNo: number });
    setTimeout(() => {
      this.getChannelPartnersList();
    }, 0);
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
      this.setState({ rowsPerPage: value });
      setTimeout(() => {
        this.getChannelPartnersList();
      }, 2000);
    } else if (e.target.name === "gotopage") {
      value = e.target.value;
      this.setState({ pageNo: value });
      setTimeout(() => {
        this.getChannelPartnersList();
      }, 2000);
    }
  };

  handleDialogClose = () => {
    this.setState({
      isActivateUser: false,
      isdeActivateUser: false,
      dialogOpen: false,
    });
  };
  handleChangeLog = () => {
    this.setState({ changeLogOpen: true });
  };

  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ value: newValue });
    // setValue(newValue);
  };

  handleUpdateDropdown = (value: string, label: any) => {
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        [label.toLocaleLowerCase()]: value,
      },
    });
  };
  backToUsersList = () => {
    this.setState({ changeLogOpen: false });
  };

  render() {
    console.log('!!!', this.state.totalData);
    const {
      isAsc,
      allChannelPartners,
      dropdownOpenFilter,
      selectedFilters,
      isLoader,
      dateErrMsg,
      searchText,
      pageNo,
      userRole,
      totalData,
      rowsPerPage,
      changeLogOpen,
      isActivateUser,
      isdeActivateUser,
      isEditUser,
    } = this.state;

    const { classes } = this.props;
    const btn = {
      background: "#1F445A 0% 0% no-repeat",
      borderRadius: "100px",
      opacity: 1,
      textalign: "left",
      font: "normal normal normal 16px/22px Open Sans",
      color: "#FFFFFF",
      width: 100,
      height: 35,
      margin: "15px",
    };

    const btnD = {
      background: "#FFFFFF 0% 0% no-repeat",
      borderRadius: "100px",
      opacity: 1,
      textalign: "left",
      font: "normal normal normal 16px/22px Open Sans",
      color: "#000000",
      width: 100,
      height: 35,
      margin: "5px",
    };

    const locationList = this.state.dynamicFields?.map(
      (list: any, index: number) => {
        let nameCapitalized =
          list.name.charAt(0).toUpperCase() + list.name.slice(1);
        return (
          <>
            <div className="country" style={{marginBottom:"5px"}}>
              {index !== 0 && (
                <div>
                  {list.name !== "village" && (
                    <NativeDropdown
                      name={list.name}
                      label={nameCapitalized}
                      options={list.options}
                      handleChange={(e: any, index: number) => {
                        e.stopPropagation();
                        list.value = e.target.value;
                        this.setState({ isRendered: true });
                        this.getOptionLists(e, index);
                        this.handleUpdateDropdown(e.target.value, list.name);
                      }}
                      value={list.value}
                    />
                  )}
                </div>
              )}
              {/* {list.error && <span className="error">{list.error}</span>} */}
            </div>
          </>
        );
      }
    );

    return (
      <AUX>
        {isLoader && <Loader />}
        <div
          className="container-fluid card card-height"
          style={{ backgroundColor: "#f8f8fa" }}
        >
          <div className="row align-items-center user-tab">
            <div className="col-sm-6">
              {!changeLogOpen && (
                <div className={classes?.root}>
                  <div className={classes?.demo1}>
                    <div className="tabs">
                      <AntTabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        aria-label="ant example"
                      >
                        <AntTab label="Channel Partners" />
                        {/* <AntTab label="Third Party Users" /> */}
                      </AntTabs>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-sm-6 leftAlign">
              {!changeLogOpen && (
                <>
                  <div>
                    <button
                      className="form-control changeLogs"
                      onClick={() => this.handleChangeLog()}
                    >
                      <img src={Logs} alt={NoImage} /> <span>Change Logs</span>
                    </button>
                  </div>

                  <div>
                    <button className="btn btn-primary" onClick={this.download}>
                      <img src={Download} width="17" alt={NoImage} />{" "}
                      <span>Download</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          {!changeLogOpen && (
            <div className="">
              <div
                className="row align-items-center"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="col-sm-6">
                  <SearchInput 
                      placeHolder="Search user (min 3 letters)"
                      type="text"
                      onChange={this.handleSearch}
                      value={searchText} 
                      tolltip="Search applicable for User Name, Account Name and Owner Name"
                      />
                </div>
                <div className="col-sm-6 leftAlign">
                  <div className="partner">
                    <label
                      className="font-weight-bold pt-4"
                      style={{ color: "#363636", fontSize: " 14px" }}
                    >
                      Partner Type
                    </label>
                    <div className="partnerType">
                      {this.state.list.map((item) => (
                        <span className="mr-2">
                          <Button
                            color={
                              this.state.partnerType.type === item
                                ? "btn activeColor rounded-pill"
                                : "btn rounded-pill boxColor"
                            }
                            size="md"
                            onClick={() => this.handlePartnerChange(item)}
                          >
                            {item}
                          </Button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className=""
                    style={{ marginLeft: "50px", marginTop: "16px" }}
                  >
                    {!changeLogOpen && (
                      <div className="filterRow">
                        <Dropdown
                          isOpen={dropdownOpenFilter}
                          toggle={this.toggleFilter}
                        >
                          <DropdownToggle onClick={(e) => e.stopPropagation()}>
                            {!dropdownOpenFilter && (
                              <img src={filterIcon} width="17" alt={NoImage} />
                            )}
                          </DropdownToggle>
                          <DropdownMenu right>
                            <div className="p-3">
                              <DropdownItem>
                                <i
                                  className="fa fa-filter boxed float-right"
                                  aria-hidden="true"
                                  onClick={this.toggleFilter}
                                ></i>
                              </DropdownItem>
                              <div onClick={(e) => e.stopPropagation()}>
                                <label className="font-weight-bold">
                                  Status
                                </label>
                                <div className="pt-1">
                                  {this.state.userStatus.map((item) => (
                                    <span className="mr-2">
                                      <Button
                                        color={
                                          selectedFilters.status === item
                                            ? "btn activeColor rounded-pill"
                                            : "btn rounded-pill boxColor"
                                        }
                                        size="sm"
                                        onClick={(e) =>
                                          this.handleFilterChange(
                                            e,
                                            "status",
                                            item
                                          )
                                        }
                                      >
                                        {item}
                                      </Button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="form-group">{locationList}</div>
                              <label className="font-weight-bold pt-2">
                                Date Range
                              </label>
                              <div className="d-flex">
                                <div className="user-filter-date-picker">
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={selectedFilters.startDate}
                                    onChange={(e) =>
                                      this.handleFilterChange(
                                        e,
                                        "startDate",
                                        ""
                                      )
                                    }
                                  />
                                </div>
                                <div className="p-2">-</div>
                                <div className="user-filter-date-picker">
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={selectedFilters.endDate}
                                    onChange={(e) =>
                                      this.handleFilterChange(e, "endDate", "")
                                    }
                                  />
                                </div>
                              </div>

                              <div className="filterFooter pt-3">
                                {/* <Button
                                  color="btn rounded-pill boxColor reset-btn"
                                  onClick={(e) => this.resetFilter(e)}
                                >
                                  Reset All
                                </Button> */}
                                <button
                                  className="cus-btn-user-filter reset"
                                  onClick={(e) => this.resetFilter(e)}
                                >
                                   Reset All
                                  
                                </button>
                                {/* <Button
                                  color="btn rounded-pill boxColor applybtn"
                                  onClick={this.applyFilter}
                                >
                                  Apply
                                </Button> */}
                                <button
                                  className="cus-btn-user-filter"
                                  onClick={this.applyFilter}
                                >
                                  Apply
                                  <span>
                                    <img src={ArrowIcon} className="arrow-i" />{" "}
                                    <img src={RtButton} className="layout" />
                                  </span>
                                </button>
                              </div>
                              {dateErrMsg && (
                                <span className="error">{dateErrMsg} </span>
                              )}
                            </div>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="test">
            {!this.state.changeLogOpen ? (
              <>
                <TabPanel value={this.state.value} index={0}>
                  <ChannelPartners
                    allChannelPartners={allChannelPartners}
                    isAsc={isAsc}
                    onSort={this.onSort}
                    state={this.state}
                    previous={this.previous}
                    next={this.next}
                    pageNumberClick={this.pageNumberClick}
                    totalData={totalData}
                    handlePaginationChange={this.handlePaginationChange}
                    callAPI={this.getChannelPartnersList}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                  <ThirdPartyUsers
                    allThirdParty={this.state.allThirdParty}
                    isAsc={isAsc}
                    onSort={this.onSort}
                  />
                </TabPanel>
              </>
            ) : (
              <ChangeLogs backToUsersList={this.backToUsersList}
              state={this.state}
              previous={this.previous}
              next={this.next}
              pageNumberClick={this.pageNumberClick}
              totalData={totalData}
              handlePaginationChange={this.handlePaginationChange} />
            )}
          </div>
        </div>
      </AUX>
    );
  }
}

export { UserList };
