import React from "react";
import "../../assets/scss/configurations.scss";
import { compose } from 'redux';
import { connect } from 'react-redux';
// import "../devconfig/devconfig.scss"
import Stepper from "../../container/components/stepper/Stepper";

import { FormSteps } from '../../utility/constant';
import { CountrySetup } from './components/countrysetup';
import LocationHierarchy from './components/LocationHierarchy';
import RoleHierarchy from './components/RoleHierarchy';                  // Step 1 
import TnTFlow from './components/TnTFlow';
import ScanPointsAndAllocation from './components/ScanPointsAndAllocation';
import { Anticounterfeit } from './components/Anticounterfeit';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import cluster_json from '../../utility/lib/cluster.json';

import AUX from "../../hoc/Aux_";
import { withStyles, Theme, createStyles, WithStyles, } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import left_arrow from "../../assets/icons/left_arrow.svg";
import right_arrow from "../../assets/icons/left-arrow.svg";
import reset from "../../assets/icons/reset.svg";
import check from "../../assets/images/check.png";



export interface IFormValue {
  id: string;
  label: string;
}
interface IDevConfigProps {
  locationhierarchy: IFormValue[];
  selectedLocationHierarchy?: IFormValue[];
  classes: any;
  loacationinputList: any;
  roleinputList: any;
  tntflowinputList: any;
  scanpointsandallocationinputList: any;
}

type MyComponentState = {
  currentStep: number;
  isActive: boolean;
  setData: Array<any>;
  setSelectedRegion: string;
  setSelectedCluster: string;
  selectedCountryDetails: Array<any>;
  selectedLocationHierarchyDetails: Array<any>;
  selectedRoleHierarchyDetails: Array<any>;
  selectedTnTFlowDetails: Array<any>;
  selectedScanPointsAndAllocationDetails: Array<any>;
  selectedAnticounterfeitDetails: Array<any>;

  region: string;
  cluster: string;
  country: string;
  countrycode: string;
  currency: string;
  currencyname: string;
  value: number;
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

// class Devconfigurations extends Component<MyComponentProps, MyComponentState> {
class Devconfigurations extends React.Component<IDevConfigProps, MyComponentState> {
  constructor(props: IDevConfigProps) {
    super(props);
    this.state = {
      currentStep: 1,
      isActive: false,
      setData: [],
      setSelectedRegion: 'EMEA',
      setSelectedCluster: 'Africa',
      selectedCountryDetails: [],
      selectedLocationHierarchyDetails: [],
      selectedRoleHierarchyDetails: [],
      selectedTnTFlowDetails: [],
      selectedScanPointsAndAllocationDetails: [],
      selectedAnticounterfeitDetails: [],

      region: '',
      cluster: '',
      country: '',
      countrycode: '',
      currency: '',
      currencyname: '',
      value: 0
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleDropdownChangeRegion = this.handleDropdownChangeRegion.bind(this);
  }


  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ value: newValue });
  };

  handleDropdownChangeRegion = (event: any) => {
    this.setState({ setSelectedRegion: event.target.value })
  }

  handleDropdownChange = (event: any) => {
    this.setState({ setSelectedCluster: event.target.value });
  }

  handleClick(clickType?: any, e?: any) {

    const { currentStep } = this.state;

    let newStep = currentStep;
    clickType === "next" ? newStep++ : newStep--;

    if (newStep === 2) {
      this.setState({
        isActive: true
      });
    }

    if (newStep === 1) {
      console.log("currentStep : ", currentStep);
      this.setState({
        isActive: false
      });
    }

    if (newStep > 0 && newStep <= stepsArray.length) {
      this.setState({
        currentStep: newStep
      });
    }

    if (newStep === stepsArray.length) {
      //Submit values
    }
  }

  handleReset() {
    // let newStep = this.state.currentStep;
    let newStep = 1;
    this.setState({
      currentStep: newStep,
      isActive: false
    });
  }

  componentWillMount() {
    const setData = cluster_json;
    this.setState({ setData: setData });

    console.log("setSelectedCluster", this.state.setSelectedCluster);
    if (this.state.setSelectedCluster) {
      this._retrieveSelectedContryofCluster(this.state.setSelectedCluster);
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.state.currentStep !== prevState.currentStep) {
      window.scrollTo(0, 0);
    }
    console.log("setSelectedCluster", this.state.setSelectedCluster);
    if (this.state.setSelectedCluster) {
      this._retrieveSelectedContryofCluster(this.state.setSelectedCluster);
    }
  }

  _retrieveSelectedContryofCluster = async (setSelectedCluster: any) => {
    try {
      console.log("setSelectedCluster ", setSelectedCluster);
      let selectedCountryDetails = [];
      const regions = cluster_json;
      const filterCuntryDropdown = regions.filter(function (result) {
        return result.cluster === setSelectedCluster;
      });
      const countryUnique = this.getUnique(filterCuntryDropdown, 'name');
      console.log(countryUnique);
      selectedCountryDetails = countryUnique;

      this.setState({ selectedCountryDetails });
    } catch (error) {
      console.log(error);
    }
  }

  // Proceed to next step
  nextStep = (nextStep: FormSteps = null as any) => {
    const { currentStep } = this.state;

    switch (currentStep) {
      case FormSteps.LocationHierarchy:
        this.goNextStep(nextStep);
        break;

      default:
    }
  };

  goNextStep = (nextStep: FormSteps = null as any) => {
    const { currentStep } = this.state;
    if (!nextStep)
      this.setState({
        currentStep: currentStep + 1,
      });
  };

  // Go back to previous step
  prevStep = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  _getCurrentStep = () => {

    const {
      currentStep,
      selectedCountryDetails
    } = this.state;

    switch (currentStep) {
      case 1:
        return (
          <CountrySetup
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            setCountryDetails={(data) => this.setState({ selectedCountryDetails: data })}
            selectedCountryDetails={selectedCountryDetails}
          />
        )
      case 2:
        return (
          <LocationHierarchy />
        )
      case 3:
        return (
          <RoleHierarchy />
        )
      case 4:
        return (
          <TnTFlow />
        )
      case 5:
        return (
          <ScanPointsAndAllocation />
        )
      case 6:
        return (
          <Anticounterfeit
          prevStep={this.prevStep}
          setAnticounterfeit={(data) => this.setState({ selectedAnticounterfeitDetails: data })}
          />
        )
      default:
        break;
    }
  }

  getRegion = (region: any) => {
    var regions = cluster_json.filter(function (value: any) {
      return value.region === region;
    });
    return regions;
  }

  getUnique(arr: any, comp: any) {
    //store the comparison  values in array
    const unique = arr.map((e: any) => e[comp]).
      // store the indexes of the unique objects
      map((e: any, i: any, final: any) => final.indexOf(e) === i && i)
      // eliminate the false indexes & return unique objects
      .filter((e: any) => arr[e]).map((e: any) => arr[e]);
    return unique
  }

  render() {
    const { currentStep } = this.state;

    const { region, cluster, country, countrycode, currency, currencyname } = this.state;
    const values = { region, cluster, country, countrycode, currency, currencyname };


    const dpstyle = {
      width: 185,
      height: 35
    };

    const btnStyle = {
      width: 185, height: 35,
      background: "#FFFFFF 0% 0% no-repeat",
      boxshadow: "0px 1px 3px #0000004D",
      border: "0.5px solid #006CF8",
      opacity: 1, color: "black"
    }
    const btnNextSubmit = {
      background: '#89D329 0% 0% no-repeat padding-box',
      boxshadow: '0px 1px 3px #0000004D',
      // borderRadius: 10,
      opacity: 1,
      color: "white",
      width: 185, height: 35,
    }


    let button;
    if (currentStep === stepsArray.length) {
      button = <button style={btnNextSubmit} onClick={() => this.handleClick("next", '')}>Submit<img src={check} /></button>;
    } else {
      button = <button style={btnNextSubmit} onClick={(e) => this.handleClick("next", e)}>Next  <img src={right_arrow} /></button>;
    }


    const regions = cluster_json;
    const regionUnique = this.getUnique(regions, 'region');


    const course = this.state.setSelectedRegion;
    const filterClusterDropdown = regions.filter(function (result) {
      return result.region === course;
    });
    const clusterUnique = this.getUnique(filterClusterDropdown, 'cluster');
    const { classes } = this.props;
    return (
      <AUX>
        <div className='card-container'>
          <div>
            <div className="tabs">
              <AntTabs value={this.state.value} onChange={this.handleChange} aria-label="ant example">
                <AntTab label="COUNTRY" />
                <AntTab label="FEATURE TOGGLE" />
                <AntTab label="DEV CONFIG" />
              </AntTabs>
              <Typography />
            </div>
            <TabPanel value={this.state.value} index={0} classes={classes}>
              {currentStep == 1 ? (
                <div className="col-md-10">
                  <div className="container">
                    <div className="row rm-group">
                      <div className="col-sm-3">
                        <div><label className="font-weight-bold pt-4">Region</label></div>
                        <div>
                          <select style={dpstyle} id="dropdown" value={this.state.setSelectedRegion} defaultValue={values.region} onChange={(event) => this.handleDropdownChangeRegion(event)}>
                            {regionUnique.length > 0 ? (
                              regionUnique.map(({ region }: any) => (
                                <option value={region} key={region}>
                                  {region}
                                </option>
                              ))
                            ) : (
                                <option value="" key="">
                                  No Region found
                                </option>
                              )}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div><label className="font-weight-bold pt-4">Cluster</label></div>
                        <div>   <select style={dpstyle} id="dropdown" value={this.state.setSelectedCluster} defaultValue={values.cluster} onChange={(event) => this.handleDropdownChange(event)}>
                          {clusterUnique.length > 0 ? (
                            clusterUnique.map(({ cluster }: any) => (
                              <option value={cluster} key={cluster}>
                                {cluster}
                              </option>
                            ))
                          ) : (
                              <option value="" key="">
                                No Cluster found
                                </option>
                            )}
                        </select></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) :

                <div className="col-md-10">
                  <div className="container">
                    <div className="row rm-group">
                      <div className="col-sm-3">
                        <div><label className="font-weight-bold pt-4"></label></div>
                        <div className="breadcrums sub-title">
                          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                            <Link color="inherit" href="/" >
                              {this.state.setSelectedRegion}
                            </Link>
                            <Link color="inherit" href="/" >
                              {this.state.setSelectedCluster}
                            </Link>
                            <Typography color="textPrimary">Malawi</Typography>
                          </Breadcrumbs>
                          {/* <p>{"EMEA >  Africa  >Malawi"}</p> */}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              }

              <div className="stepper-container-horizontal">
                <Stepper
                  direction="horizontal"
                  currentStepNumber={currentStep - 1}
                  steps={stepsArray}
                  stepColor="#5A5A5A"
                />
              </div>
              {this._getCurrentStep()}
              <div className="col-md-12 buttons-container">
                {this.state.isActive && <button style={btnStyle} onClick={() => this.handleClick()}><img src={left_arrow} /> Back</button>}
                <button style={btnStyle} onClick={() => this.handleReset()}>Reset <img src={reset} /></button>
                <button style={btnNextSubmit} onClick={() => this.handleClick("next")}>{currentStep === stepsArray.length ? 'Submit' : 'Next'} {currentStep === stepsArray.length ? <img src={check} /> : <img src={right_arrow} />} </button>
              </div>

            </TabPanel>
            <TabPanel value={this.state.value} index={1} classes={classes}>
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

const stepsArray = [
  "Country Setup",
  "Location Hierarchy",
  "Role Hierarchy",
  "T & T Flow",
  "Scan Points & Allocation",
  "Anti-counterfeit"
];

const mapStateToProps = ({ devconfig: { location, role, tntflow,scanpointsandallocation } }: any) => {
  return {
    loacationinputList: location.inputList,
    roleinputList: role.inputList,
    tntflowinputList: tntflow.inputList,
    scanpointsandallocationinputList: scanpointsandallocation.inputList
  }
}

const rootComponent = compose(withStyles(useStyles), connect(mapStateToProps))(Devconfigurations);
export default rootComponent as React.ComponentType;