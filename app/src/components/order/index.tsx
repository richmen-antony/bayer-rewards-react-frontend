import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import "../../assets/scss/scanLogs.scss";
import { apiURL } from "../../utility/base/utils/config";
import {
  invokeGetAuthService,
} from "../../utility/base/service";
import Loader from "../../utility/widgets/loader";
import {
  getLocalStorageData,
} from "../../utility/base/localStore";

import {
  DownloadCsv,
} from "../../utility/helper";
// import SimpleTabs from "../../../container/Layout/Tabs";
import "react-web-tabs/dist/react-web-tabs.css";

import {
  withStyles,
  Theme,
  createStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OrderHistory from "./OrderHistroyTable";
import "../../assets/scss/orderHistory.scss";

type SelectedFiltersTypes = {
  type: string;
  scanType: string;
  productCategory: string;
  status: string;
  startDate: any;
  endDate: any;
  [key: string]: string;
};
// type Props = {
//   classes: {
//     root: string;
//     paper: string;
//     button: string;
//     demo1:string
//   };
// };

type States = {
  selectedFilters: SelectedFiltersTypes;
  userRole: string;
  isLoader: boolean;
  value: number;
};

const headers = [
  { label: "description", key: "description" },
  { label: "firstname", key: "firstname" },
  { label: "lastname", key: "lastname" },
  { label: "prodgroupname", key: "prodgroupname" },
  { label: "productlabelid", key: "productlabelid" },
  { label: "productname", key: "productname" },
];

var mockdata;

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
        color: "#000000",
        fontWeight: theme.typography.fontWeightBold,
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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
interface Props extends WithStyles<typeof useStyles> {}


const statusList=["Pending","Fulfiled","Cancelled","Expired"];
class Order extends Component<Props, States> {
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
      selectedFilters: {
        type: "All",
        scanType: "All",
        productCategory: "All",
        status: "All",
        startDate: backdate.toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
      },
      userRole: "",
      isLoader: false,
      value: 0,
    };
    this.timeOut = 0;
  }

  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ value: newValue });
  
  };

  componentDidMount() {
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);

    this.setState({
      userRole: userData.role,
    });
    // this.getProductCategory();
  }

 
  download = () => {
    const { downloadScanlogs } = apiURL;
    const data = {
      // page: this.state.pageNo,
      // searchtext: this.state.searchText,
      // rowsperpage: this.state.rowsPerPage,
      // role: this.state.selectedFilters.type,
      // isfiltered: this.state.isFiltered,
      region: "R1",
      ordereddatefrom: "2020-04-20",
      ordereddateto: "2022-04-21",
      status: "ALL",
      retailer: "ALL",
      farmer: "ALL",
    };

    invokeGetAuthService(downloadScanlogs, data)
      .then((response) => {
        const data = response?.body?.rows;
        DownloadCsv(data, "scanlogs.csv");
      })
      .catch((error) => {});
  };

 
  // getProductCategory = () => {
  //   const { productCategory } = apiURL;
  //   this.setState({ isLoader: true });
  //   invokeGetAuthService(productCategory).then((response) => {
  //     this.setState({
  //       isLoader: false,
  //       productCategories:
  //         Object.keys(response.body).length !== 0 ? response.body.rows : [],
  //     });
  //   });
  //   setTimeout(() => {
  //     this.setState({
  //       productCategories: ["All", ...this.state.productCategories],
  //     });
  //   }, 3000);
  // };

 
  
  

  render() {
    const {
     
      isLoader,
      
    } = this.state;

   
    const tooltipItem = () => {
      return (
        <div>
          <h7>Searchable Columns are</h7>
          <ul style={{ listStyle: "none", paddingRight: "35px" }}>
            <li>Label ID</li>
            <li>Customer Name</li>
            <li>Product</li>
            <li>Scan Type</li>
          </ul>
        </div>
      );
    };
    const { classes } = this.props;

    return (
      <AUX>
        {isLoader && <Loader />}
        <div>
          <div className={classes?.root}>
            <div>
              <div className="tabs">
                <AntTabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  aria-label="ant example"
                >
                  <AntTab label="Advisor Sales" />
                  {/* <AntTab label="Walk-In Sales"/>
                  <AntTab label="Send Goods" /> */}
                </AntTabs>

                
              </div>

              <Typography />
            </div>
            <TabPanel value={this.state.value} index={0} classes={classes}>
              <OrderHistory/>
            </TabPanel>
            <TabPanel value={this.state.value} index={1} classes={classes} >
              Item Two
            </TabPanel>
            <TabPanel value={this.state.value} index={2} classes={classes}>
              Item Three
            </TabPanel>
          </div>
        </div>
      </AUX>
    );
  }
}
export default withStyles(useStyles)(Order);
