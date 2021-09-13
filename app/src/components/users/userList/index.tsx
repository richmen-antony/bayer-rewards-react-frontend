import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import AUX from "../../../hoc/Aux_";
import { apiURL } from "../../../utility/base/utils/config";
import { invokeGetAuthService } from "../../../utility/base/service";
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
import { getLocalStorageData } from "../../../utility/base/localStore";
import moment from "moment";
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
        isregionmapped: null,
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
    let page = this.props.location?.page;
    if (page === "asaUser") {
      this.setState({ value: 1 });
    }
  }

  download = () => {
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
      downloadName = "Thirdparty_Users";
    } else if (this.state.value === 2) {
      stateValue = this.internalUserRef;
      downloadURL = downloadInternalList;
      downloadName = "Internal_Users";
    }

    let data = {
      countrycode: this.getStoreData.countryCode,
      usertype: !this.state.value
        ? "EXTERNAL"
        : this.state.value === 2
        ? stateValue.internalUserType
        : null,
      partnertype: this.state.value === 2 ? null : stateValue.partnerType.type,
      isfiltered: stateValue.isFiltered,
    };
    let {
      isregionmapped,
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
        searchtext: stateValue.searchText || null,
        isregionmapped: this.state.value === 2 ? isregionmapped : null,
      };
      data = { ...data, ...filter };
    }

    invokeGetAuthService(downloadURL, data)
      .then((response) => {
        const data = response;
        downloadCsvFile(data, downloadName);
      })
      .catch((error) => {
        this.setState({ isLoader: false });
        let message = error.message;
        Alert("warning", message);
      });
  };

  // handleExpand = (data: any) => {
  //   data.isExpand = !data.isExpand;
  //   this.setState({
  //     isRendered: true,
  //     accordionView: !this.state.accordionView,
  //     accordionId: data.productlabelid,
  //   });
  // };

  // toggleFilter = (e: any) => {
  //   this.setState((prevState) => ({
  //     dropdownOpenFilter: !prevState.dropdownOpenFilter,
  //   }));
  // };

  // handlePartnerChange = (name: String) => {
  //   this.setState(
  //     {
  //       partnerType: {
  //         type: name,
  //       },
  //     },
  //     () => {
  //       // this.getChannelPartnersList();
  //     }
  //   );
  // };

  // handleDialogClose = () => {
  //   this.setState({
  //     isActivateUser: false,
  //     isdeActivateUser: false,
  //     dialogOpen: false,
  //   });
  // };
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

  render() {
    const { isLoader, changeLogOpen } = this.state;
    console.log("this.channelPartnerRef", this.channelPartnerRef);

    const { classes } = this.props;
    return (
      <AUX>
        {isLoader && <Loader />}

        <div
          // className="container-fluid card card-height"
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
                        {/* <AntTab label="Third Party Users" value={1} />
                        <AntTab label="Internal Users" value={2} /> */}
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
                  {/* <i
                    className="fa fa-info-circle"
                    style={{
                      fontSize: "16px",
                      fontFamily: "appRegular !important",
                      marginLeft: "5px",
                      marginTop: "-20px",
                    }}
                    title={"Full extract"}
                  ></i> */}
                </>
              )}
            </div>
          </div>
          <div className="test">
            {!this.state.changeLogOpen ? (
              <>
                <TabPanel value={this.state.value} index={0} classes={classes}>
                  <ChannelPartners
                    onRef={(node: any) => {
                      this.channelPartnerRef = node;
                    }}
                  />
                </TabPanel>
                {/* <TabPanel value={this.state.value} index={1} classes={classes}>
                  <ThirdPartyUsers
                    onRef={(node: any) => {
                      this.thirdPartyUserRef = node;
                    }}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={2} classes={classes}>
                  {this.state.value === 2 && (
                    <InternalUser
                      onRef={(node: any) => {
                        this.internalUserRef = node;
                      }}
                    />
                  )}
                </TabPanel> */}
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
