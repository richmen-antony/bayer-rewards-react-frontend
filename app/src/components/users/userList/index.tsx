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
import NoImage from "../../../assets/images/no_image.svg";
import Loader from "../../../utility/widgets/loader";
import { Alert } from "../../../utility/widgets/toaster";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import "../../../assets/scss/users.scss";
import { downloadCsvFile } from "../../../utility/helper";
import Logs from "../../../assets/icons/logs.svg";
import ChannelPartners from "./channelPartners";
import ThirdPartyUsers from "./thirdPartyUsers";
import ChangeLogs from "./changeLogs";
import InternalUser from "./InternalUser";
import ArrowIcon from "../../../assets/icons/tick.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import { SearchInput } from "../../../utility/widgets/input/search-input";
import { getLocalStorageData } from "../../../utility/base/localStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalenderIcon from "../../../assets/icons/calendar.svg";
import moment from "moment";
import Validator from "../../../utility/validator";
import Typography from "@material-ui/core/Typography";

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
  selectedFilters: any;
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
  geolevel1List: Array<any>;
  level1Options: Array<any>;
  level2Options: Array<any>;
  level3Options: Array<any>;
  level4Options: Array<any>;
  level5Options: Array<any>;
  inActiveFilter: boolean;
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
  padding: {
    padding: "0px",
    marginTop: "5px",
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
  value: number;
}

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: any;
//   value: any;
// }
// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box p={2}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  classes?: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, classes, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className={classes.padding}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
// interface IProps {
//   onChange?: any;
//   placeholder?: any;
//   value?: any;
//   id?: any;
//   onClick?: any;
//   // any other props that come into the component
// }
// const ref = React.createRef()
// const Input = React.forwardRef(({ onChange, placeholder, value, id, onClick }: IProps,ref:any) => (
// 	<div style={{ border: "1px solid grey", borderRadius: "4px" }}>
// 		<img src={CalenderIcon} style={{ padding: "2px 5px" }} alt="Calendar" />
// 		<input
// 			style={{
// 				border: "none",
// 				width: "120px",
// 				height: "31px",
// 				outline: "none",
// 			}}
// 			onChange={onChange}
// 			placeholder={placeholder}
// 			value={value}
// 			id={id}
// 			onClick={onClick}
// 			ref={ref}

// 		/>
// 	</div>
// ));
let levelsName: any = [];

class UserList extends Component<Props, States> {
  timeOut: any;
  loggedUserInfo: any;
  getStoreData: any;
  channelPartnerRef: any;
  thirdPartyUserRef: any;
  internalUserRef: any;
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
      selectIndex: "",
      isAsc: true,
      isRendered: false,
      pageNo: 1,
      dropDownValue: "Select action",
      productCategories: [],
      status: ["ALL", "Valid", "Invalid"],
      list: ["Retailer", "Distributor"],
      selectedFilters: {
        geolevel1: "ALL",
        geolevel2: "ALL",
        geolevel3: "ALL",
        status: "ALL",
        lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
        lastmodifieddateto: new Date(),
      },
      partnerType: {
        type: "Retailer",
      },
      dateErrMsg: "",
      searchText: "",
      rowsPerPage: 10,
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
      userStatus: ["ALL", "Active", "Inactive", "Pending", "Declined"],
      geographicFields: [],
      dynamicFields: [],
      countryList: [],
      hierarchyList: [],
      geolevel1List: [],
      level1Options: [],
      level2Options: [],
      level3Options: [],
      level4Options: [],
      level5Options: [],
      inActiveFilter: false,
    };
    this.timeOut = 0;
  }
  componentDidMount() {
    ///API to get country and language settings
    this.getHierarchyDatas();
    this.getGeographicFields();
    // setTimeout(() => {
    //   this.getDynamicOptionFields();
    // }, 0);
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
        // levels = ['country','region','add','district','epa','village'];
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
        this.setState({ isLoader: false, geolevel1List: geolevel1 });
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
      // let filteredLevel2: any = [];
      // let level3List: any = [];
      // filteredLevel2 = geolevel1List.filter((region: any)=>region.name === dynamicFieldVal[1].value);
      // level3List = filteredLevel2[0].level2Options.filter((addinfo:any)=>addinfo.name === dynamicFieldVal[2].value)
      dynamicFieldVal[index].value = value;
      this.setState({ dynamicFields: dynamicFieldVal });
    }
  };

  download = () => {
    console.log("ref", this.channelPartnerRef);
    let stateValue: any = "";
    let downloadURL: string = "";
    let downloadName: string = "";
    const { downloadUserList, downloadThirdPartyList, downloadInternalList } =
      apiURL;
    if (!this.state.value) {
      stateValue = this.channelPartnerRef?.state;
      downloadURL = downloadUserList;
      downloadName = "Channel_Partner";
    } else if (this.state.value === 1) {
      stateValue = this.thirdPartyUserRef?.state;
      downloadURL = downloadThirdPartyList;
      downloadName = "Third_Party_Users";
    } else if (this.state.value === 2) {
      stateValue = this.internalUserRef?.state;
      downloadURL = downloadInternalList;
      downloadName = "Internal_Users";
    }

    let data = {
      countrycode: this.getStoreData.countryCode,
      usertype: !this.state.value ? "EXTERNAL" : null,
      partnertype: stateValue.partnerType.type,
      // partnertype: "ALL",
      isfiltered: this.state.value === 1 ? true : null,
    };
    let {
      status,
      lastmodifieddatefrom,
      lastmodifieddateto,
      geolevel1,
      geolevel2,
      geolevel3,
    }: any = stateValue.selectedFilters;
    if (stateValue.isFiltered) {
      let filter = {
        isfiltered: true,
        status: status.toUpperCase(),
        lastmodifieddatefrom: moment(lastmodifieddatefrom).format("YYYY-MM-DD"),
        lastmodifieddateto: moment(lastmodifieddateto).format("YYYY-MM-DD"),
        geolevel1: geolevel1 === "ALL" ? null : geolevel1,
        geolevel2: geolevel2 === "ALL" ? null : geolevel2,
        geolevel3: geolevel3 === "ALL" ? null : geolevel3,
        searchtext: stateValue.searchText,
      };
      data = { ...data, ...filter };
    }

    invokeGetAuthService(downloadURL, data)
      .then((response) => {
        const data = response;
        downloadCsvFile(data, `${downloadName}.csv`);
      })
      .catch((error) => {
        this.setState({ isLoader: false });
        let message = error.message;
        Alert("warning", message);
      });
  };

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

  handlePartnerChange = (name: String) => {
    this.setState(
      {
        partnerType: {
          type: name,
        },
      },
      () => {
        // this.getChannelPartnersList();
      }
    );
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
        dateErrMsg: "",
      },
      () => {}
    );
    setTimeout(() => {}, 0);
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
  };

  handleUpdateDropdown = (value: string, label: any) => {
    this.setState((prevState: any) => ({
      selectedFilters: {
        ...prevState.selectedFilters,
        [label.toLocaleLowerCase()]: value,
      },
    }));
  };
  backToUsersList = () => {
    this.setState({ changeLogOpen: false });
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
  render() {
    const {
      isAsc,
      allChannelPartners,
      dropdownOpenFilter,
      selectedFilters,
      isLoader,
      dateErrMsg,
      searchText,
      totalData,
      changeLogOpen,
    } = this.state;

    const { classes } = this.props;

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
            {/* {list.error && <span className="error">{list.error}</span>} */}
          </div>
        </React.Fragment>
      );
    });

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
                        <AntTab label="Channel Partners" value={0} />
                        <AntTab label="Third Party Users" value={1} />
                        <AntTab label="Internal Users" value={2} />
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
                      <img src={Logs} alt={NoImage} data-testid="changelog" />{" "}
                      <span>Change Logs</span>
                    </button>
                  </div>

                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={this.download}
                      style={{ backgroundColor: "#1F445A" }}
                    >
                      <img
                        src={Download}
                        width="17"
                        alt={NoImage}
                        data-testid="download"
                      />{" "}
                      <span>Download</span>
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
                </>
              )}
            </div>
          </div>
          {/* {!changeLogOpen && (
            <div className="">
              <div
                className="row align-items-center"
                style={{ backgroundColor: "#ffffff", padding: "10px 0" }}
              >
                <div className="col-sm-6">
                  <SearchInput
                    data-testid="search-input"
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
                      className="font-weight-bold pt-2"
                      style={{ color: "#363636", fontSize: " 14px" }}
                    >
                      Partner Type
                    </label>
                    <div className="partnerType">
                      {this.state.list.map((item, index) => (
                        <span className="mr-2" key={item+index}>
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
                  <div className="" style={{ marginLeft: "50px" }}>
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
                          <DropdownMenu right style={{marginLeft: "16px"}}>
                            <div className="p-3">
                              <DropdownItem>
                                <i
                                  className="fa fa-filter boxed float-right"
                                  aria-hidden="true"
                                ></i>
                              </DropdownItem>
                              <div onClick={(e) => e.stopPropagation()}>
                                <label className="font-weight-bold">
                                  Status
                                </label>
                                <div className="pt-1">
                                  {this.state.userStatus.map((item, index) => (
                                    <span className="mr-2" key={`status`+index}>
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
                              <label className="font-weight-bold pt-2" htmlFor="update-date">
                                Last Modified Date
                              </label>
                              <div className="d-flex">
                                <div className="user-filter-date-picker">
                                  <DatePicker
                                    id="update-date"
                                    value={selectedFilters.lastmodifieddatefrom}
                                    dateFormat="dd-MM-yyyy"
                                    customInput={<Input ref={ref} />}
                                    selected={
                                      selectedFilters.lastmodifieddatefrom
                                    }
                                    onChange={(date: any) =>
                                      this.handleDateChange(
                                        date,
                                        "lastmodifieddatefrom"
                                      )
                                    }
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
                                    customInput={<Input ref={ref} />}
                                    selected={
                                      selectedFilters.lastmodifieddateto
                                    }
                                    onChange={(date: any) =>
                                      this.handleDateChange(
                                        date,
                                        "lastmodifieddateto"
                                      )
                                    }
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
                                    <img src={ArrowIcon} alt='' className="arrow-i" />{" "}
                                    <img src={RtButton} alt='' className="layout" />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )} */}
          <div className="test">
            {!this.state.changeLogOpen ? (
              <>
                <TabPanel value={this.state.value} index={0} classes={classes}>
                  <ChannelPartners
                    locationList={locationList}
                    onRef={(node: any) => {
                      this.channelPartnerRef = node;
                    }}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={1} classes={classes}>
                  <ThirdPartyUsers
                    geolevel1List={this.state.geolevel1List}
                    locationList={locationList}
                    onRef={(node: any) => {
                      this.thirdPartyUserRef = node;
                    }}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={2} classes={classes}>
                  {this.state.value === 2 && (
                    <InternalUser
                      locationList={locationList}
                      onRef={(node: any) => {
                        this.internalUserRef = node;
                      }}
                    />
                  )}
                </TabPanel>
              </>
            ) : (
              <ChangeLogs backToUsersList={this.backToUsersList} />
            )}
          </div>
        </div>
      </AUX>
    );
  }
}
export default withStyles(useStyles)(UserList);
// export default UserList;
