import React from "react";
import {
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,

} from "reactstrap";
import { Tooltip } from "reactstrap";

import '../../assets/scss/layout.scss';

const AntTabs = withStyles({
  root: {
    borderBottom: "0",
  },
  indicator: {
    backgroundColor: "#1890ff",
    height: "4px",
  }
})(Tabs);

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

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

interface StyledTabProps {
  label: string;
}



const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  // padding: {
  //   padding: theme.spacing(3),
  // },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CustomizedTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
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
          <Box p={3}>
            <Typography>{children}</Typography>
        
           
          </Box>
        )}
        

      </div>
    );
  }
  return (
    <div className={classes.root}>
      <div className={classes.demo1}>
        <div className="tabs">
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="Tab 1" />
          <AntTab label="Tab 2" />
          <AntTab label="Tab 3" />
       
          
          
    
     
        </AntTabs>
       
        <div className=" filterSide text-center">
                <div>
                  <i
                    className="fa fa-info-circle"
                    id="Tooltip"
                    aria-hidden="true"
                  ></i>
                  <Tooltip
                    placement="right"
                    // isOpen={this.state.tooltipOpen}
                    target="Tooltip"
                    // toggle={() => this.toggle()}
                  >
                    {/* {tooltipItem} */}
                  </Tooltip>
                </div>
                <div className="searchInputRow">
                  <i className="fa fa-search icon"></i>
                  <input
                    placeholder="Search..[Min 3 chars]"
                    className="input-field"
                    type="text"
                    // onChange={this.handleSearch}
                    // value={searchText}
                  />
                </div>

                <div className="filterRow">
                  <Dropdown
                    // isOpen={dropdownOpenFilter}
                    // toggle={this.toggleFilter}
                  >
                    <DropdownToggle>
                      {/* {!dropdownOpenFilter && (
                        <img src={filterIcon} width="17" alt="filter" />
                      )} */}
                    </DropdownToggle>
                    <DropdownMenu right>
                      <div className="p-3">
                        <label className="font-weight-bold">
                          Distributor / Retailer
                        </label>
                        <i
                          className="fa fa-filter boxed float-right"
                          aria-hidden="true"
                          // onClick={this.toggleFilter}
                        ></i>
                        <div
                          className="form-group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            className="form-control filterDropdown"
                            // onChange={(e) =>
                            //   this.handleFilterChange(e, "type", "")
                            // }
                            // value={selectedFilters.type}
                          >
                            <option>All</option>
                            <option>Distributor</option>
                            <option>Retailer</option>
                          </select>
                        </div>

                        <label className="font-weight-bold">Scan Logs</label>
                        <div className="pt-1">
                          {/* {this.state.scanType.map((item) => (
                            <span className="mr-2">
                              <Button
                                color={
                                  selectedFilters.scanType === item
                                    ? "btn activeColor rounded-pill"
                                    : "btn rounded-pill boxColor"
                                }
                                size="sm"
                                onClick={(e) =>
                                  this.handleFilterChange(e, "scanType", item)
                                }
                              >
                                {item}
                              </Button>
                            </span>
                          ))} */}
                        </div>

                        <label className="font-weight-bold pt-2">
                          Product Group
                        </label>
                        <div className="pt-1">
                          {/* {this.state.productCategories.map((item, i) => (
                            <span className="mr-2 chipLabel" key={i}>
                              <Button
                                color={
                                  selectedFilters.productCategory === item
                                    ? "btn activeColor rounded-pill"
                                    : "btn rounded-pill boxColor"
                                }
                                size="sm"
                                onClick={(e) =>
                                  this.handleFilterChange(
                                    e,
                                    "productCategory",
                                    item
                                  )
                                }
                              >
                                {item}
                              </Button>
                            </span>
                          ))} */}
                        </div>

                        <label className="font-weight-bold pt-2">Status</label>
                        <div className="pt-1">
                          {/* {this.state.status.map((item) => (
                            <span className="mr-2">
                              <Button
                                color={
                                  selectedFilters.status === item
                                    ? "btn activeColor rounded-pill"
                                    : "btn rounded-pill boxColor"
                                }
                                size="sm"
                                onClick={(e) =>
                                  this.handleFilterChange(e, "status", item)
                                }
                              >
                                {item}
                              </Button>
                            </span>
                          ))} */}
                        </div>

                        {/* <div className="" onClick={(e)=>e.stopPropagation()}> */}
                        <label className="font-weight-bold pt-2">
                          Date Range
                        </label>
                        <div className="d-flex">
                          <input
                            type="date"
                            className="form-control"
                            // value={selectedFilters.startDate}
                            // onChange={(e) =>
                            //   this.handleFilterChange(e, "startDate", "")
                            // }
                          />
                          <div className="p-2">-</div>
                          <input
                            type="date"
                            className="form-control"
                            // value={selectedFilters.endDate}
                            // onChange={(e) =>
                            //   this.handleFilterChange(e, "endDate", "")
                            // }
                          />
                        </div>
                        {/* </div> */}

                        <div className="filterFooter pt-4">
                          <Button
                            color="btn rounded-pill boxColor"
                            size="md"
                            // onClick={(e) => this.resetFilter(e)}
                          >
                            Reset All
                          </Button>
                          <Button
                            color="btn rounded-pill boxColor applybtn"
                            size="md"
                            // onClick={() => this.applyFilter()}
                          >
                            Apply
                          </Button>
                        </div>
                        {/* {dateErrMsg && (
                          <span className="error">{dateErrMsg} </span>
                        )} */}
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div>
                  <button
                    className="btn btn-primary downloadBtn"
                    // onClick={this.download}
                  >
                    <i className="fa fa-download mr-2"></i>{" "}
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
        
      
        <Typography />
      </div>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      
    </div>
  );
}
