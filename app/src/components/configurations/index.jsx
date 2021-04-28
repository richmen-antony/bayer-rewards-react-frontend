import React, { Component, useState, useEffect } from "react";
import "../../assets/scss/configurations.scss";
import Stepper from "../../container/components/stepper/Stepper";
import { TabProvider, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';

import { CountrySetup } from './components/CountrySetup';                       // Step 1 
import { LocationHierarchy } from './components/LocationHierarchy';             // Step 2
import { RoleHierarchy } from './components/RoleHierarchy';                     // Step 3
import { TnTFlow } from './components/TnTFlow';                                 // Step 4
import { ScanPointsAndAllocation } from './components/ScanPointsAndAllocation'; // Step 5
import { Anticounterfeit } from './components/Anticounterfeit';                 // Step 6  
import ConfigureFeature from './feature/ConfigureFeature'
import DevConfiguration from './dev';

import cluster_json from '../../utility/lib/cluster.json';

class Configurations extends Component {
  constructor() {
    super();
    this.state = {
      currentStep: 1,
      isActive: false,
      setData: [],
      setSelectedRegion: '',
      setSelectedCluster: '',
      selectedCountryDetails: [],
      selectedLocationHierarchyDetails: [],
      selectedRoleHierarchyDetails: [],
      selectedTnTFlowDetails: [],
      selectedScanPointsAndAllocationDetails: [],
      selectedAnticounterfeitDetails: []
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleDropdownChangeRegion = this.handleDropdownChangeRegion.bind(this);
  }

  handleDropdownChangeRegion = (event) => {
    this.setState({ setSelectedRegion: event.target.value })
  }

  handleDropdownChange = (event) => {
    this.setState({ setSelectedCluster: event.target.value });
  }

  handleClick(clickType) {
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
    let newStep = 1;
    this.setState({
      currentStep: newStep,
      isActive: false
    });
  }

  componentWillMount() {
    const setData = cluster_json;
    this.setState({ setData: setData });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeStep !== prevState.activeStep) {
      window.scrollTo(0, 0);
    }
    console.log("setSelectedCluster", this.state.setSelectedCluster);
    if (this.state.setSelectedCluster) {
      this._retrieveSelectedContryofCluster(this.state.setSelectedCluster);
    }
  }

  getCluterOfRegion = (Cluster) => {
    var regions = cluster_json.filter((value) => {
      return value.cluster === Cluster;
    });
    return regions
  }

  _retrieveSelectedContryofCluster = async setSelectedCluster => {
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
      if (this.props.setErrorMessage) {
        this.props.setErrorMessage(error);
      } else {
        console.log(error);
      }
    }
  }

  // try {
  //   const { data } = await client.query({ query: QUERY_GET_CAR_WORKSHOP, variables: { carWorkshopId } });
  //   let { carWorkshop = null } = data;

  //   carWorkshop.prestationsId = carWorkshop.prestations.map(({ _id }) => _id);
  //   delete carWorkshop.prestations;

  //   this.setState({ selectedCarWorkshop: carWorkshop });
  // } catch (error) {
  //   if (this.props.setErrorMessage) {
  //     this.props.setErrorMessage(error);
  //   } else {
  //     console.log(error);
  //   }
  // }

  _getCurrentStep = () => {
    const {
      currentStep,
      selectedCountryDetails,
      selectedLocationHierarchyDetails,
      selectedRoleHierarchyDetails,
      selectedTnTFlowDetails,
      selectedScanPointsAndAllocationDetails,
      selectedAnticounterfeitDetails
    } = this.state;

    switch (currentStep) {
      case 1:
        return (
          <CountrySetup
            selectedCountryDetails={selectedCountryDetails}
            onChangeActiveStep={currentStep => this.setState({ currentStep })} />
        )
      case 2:
        return (
          <LocationHierarchy onChangeActiveStep={currentStep => this.setState({ currentStep })} />
        )
      case 3:
        return (
          <RoleHierarchy onChangeActiveStep={currentStep => this.setState({ currentStep })} />
        )
      case 4:
        return (
          <TnTFlow onChangeActiveStep={currentStep => this.setState({ currentStep })} />
        )
      case 5:
        return (
          <ScanPointsAndAllocation onChangeActiveStep={currentStep => this.setState({ currentStep })} />
        )
      case 6:
        return (
          <Anticounterfeit onChangeActiveStep={currentStep => this.setState({ currentStep })} />
        )
      default:
        break;
    }
  }

  getRegion = (region) => {
    var regions = cluster_json.default.filter(function (value) {
      return value.region === region;
    });
    return regions;
  }

  getUnique(arr, comp) {
    //store the comparison  values in array
    const unique = arr.map(e => e[comp]).
      // store the indexes of the unique objects
      map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the false indexes & return unique objects
      .filter((e) => arr[e]).map(e => arr[e]);
    return unique
  }

  render() {
    const { currentStep } = this.state;

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
      width: 185, height: 35,
      background: "#006CF8 0% 0% no-repeat",
      boxshadow: "0px 1px 3px #0000004D",
      border: "0.5px solid #0000004D",
      opacity: 1, color: "white"
    }


    let button;
    if (currentStep === stepsArray.length) {
      button = <button style={btnNextSubmit} onClick={() => this.handleClick("next")}>Submit <i class="fa fa-check" aria-hidden="true"></i></button>;
    } else {
      button = <button style={btnNextSubmit} onClick={() => this.handleClick("next")}>Next <i class="fa fa-arrow-right" aria-hidden="true"></i></button>;
    }




    console.log("currentStep :" + currentStep);

    const regions = cluster_json;
    const regionUnique = this.getUnique(regions, 'region');


    const course = this.state.setSelectedRegion;
    const filterClusterDropdown = regions.filter(function (result) {
      return result.region === course;
    });
    const clusterUnique = this.getUnique(filterClusterDropdown, 'cluster');


    return (
      <div className='card-container'>
        <TabProvider defaultTab="one">
          <section className="my-tabs">
            <TabList className="my-tablist">
              <Tab tabFor="one">COUNTRY</Tab>
              <Tab tabFor="two">FEATURE TOGGLE</Tab>
              <Tab tabFor="three" className="my-tab">DEV CONFIG</Tab>
            </TabList>

            <div className="wrapper">
              <TabPanel tabId="one">
                <div className="col-md-10">
                  <div className="container">
                    <div className="row rm-group">
                      <div className="col-sm-3">
                        <div><label className="font-weight-bold pt-4">Region</label></div>
                        <div>
                          <select style={dpstyle} id="dropdown" value={this.state.setSelectedRegion} onChange={(event) => this.handleDropdownChangeRegion(event)}>
                            {regionUnique.length > 0 ? (
                              regionUnique.map(({ region }) => (
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
                        <div>   <select style={dpstyle} id="dropdown" value={this.state.setSelectedCluster} onChange={(event) => this.handleDropdownChange(event)}>
                          {clusterUnique.length > 0 ? (
                            clusterUnique.map(({ cluster }) => (
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

                <div className="stepper-container-horizontal">
                  <Stepper
                    direction="horizontal"
                    currentStepNumber={currentStep - 1}
                    steps={stepsArray}
                    stepColor="#555555"
                  />
                </div>
                {this._getCurrentStep()}
                <div className="buttons-container">
                  {this.state.isActive && <button style={btnStyle} onClick={() => this.handleClick()}><i class="fa fa-arrow-left" aria-hidden="true"> Back</i></button>}
                  <button style={btnStyle} onClick={() => this.handleReset()}>Reset <i class="fa fa-redo-alt" aria-hidden="true"></i></button>
                  {button}
                </div>
              </TabPanel>
              <TabPanel tabId="two">
                <br />
                <br />
                <div className="buttons-container">
                  <ConfigureFeature />
                  <button class="btn">Reset <i class='fas fa-redo-alt'></i></button>
                  <button class="btn">Apply <i class="fa fa-check" aria-hidden="true"></i></button>
                </div>
              </TabPanel>
              <TabPanel tabId="three">
                <div className="buttons-container">
                  <br />
                  <br />
                  <DevConfiguration />
                  <button class="btn">Reset <i class='fas fa-redo-alt'></i></button>
                  <button class="btn">Apply <i class="fa fa-check" aria-hidden="true"></i></button>
                </div>
              </TabPanel>
            </div>
          </section>
        </TabProvider>
      </div>
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

export { Configurations };  