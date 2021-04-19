import React, { Component } from "react";
import "../../assets/scss/configurations.scss";
import Stepper from "../../container/components/stepper/Stepper";
import { TabProvider, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import Dropdown from '../../utility/widgets/dropdown';
import { Input } from '../../utility/widgets/input';

import { CountrySetup } from './components/CountrySetup';
import { LocationHierarchy } from './components/LocationHierarchy';
import { RoleHierarchy } from './components/RoleHierarchy';
import { TnTFlow } from './components/TnTFlow';
import { ScanPointsAndAllocation } from './components/ScanPointsAndAllocation';
import { Anticounterfeit } from './components/Anticounterfeit';
import ConfigureFeature from './ConfigureFeature'

class Configurations extends Component {
  constructor() {
    super();
    this.state = {
      currentStep: 1,
      isActive: false
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }
  handleDropdownChange(e) {
    this.setState({ selectValue: e.target.value });
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
      console.log(newStep);
      console.log(currentStep);
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
        isActive:false
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeStep !== prevState.activeStep) {
      window.scrollTo(0, 0);
    }
  }

  _getCurrentStep = () => {
    const {
      currentStep
    } = this.state;

    switch (currentStep) {
      case 1:
        return (
          <CountrySetup onChangeActiveStep={currentStep => this.setState({ currentStep })}/>
        )
      case 2:
        return (
          <LocationHierarchy onChangeActiveStep={currentStep => this.setState({ currentStep })}/>
        )
      case 3:
        return (
          <RoleHierarchy onChangeActiveStep={currentStep => this.setState({ currentStep })}/>
        )
      case 4:
        return (
          <TnTFlow onChangeActiveStep={currentStep => this.setState({ currentStep })}/>
        )
      case 5:
        return (
          <ScanPointsAndAllocation onChangeActiveStep={currentStep => this.setState({ currentStep })}/>
        )
      case 6:
        return (
          <Anticounterfeit onChangeActiveStep={currentStep => this.setState({ currentStep })}/>
        )
      default:
        break;
    }
  }

  render() {
    const { currentStep } = this.state;
  
    let button;
    if (currentStep === stepsArray.length) {
      button = <button onClick={() => this.handleClick("next")}>Submit <i class="fa fa-check" aria-hidden="true"></i></button>;
    } else {
      button = <button onClick={() => this.handleClick("next")}>Next <i class="fa fa-arrow-right" aria-hidden="true"></i></button>;
    }

    const dpstyle = {
      width: 185, 
      height: 35
    };
    console.log("currentStep :" + currentStep);
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
            <div className="panel">

              <div className="col-md-10">
                  <div className="container">
                    <div className="row rm-group">
                      <div className="col-sm-3">
                        <div><label className="font-weight-bold pt-4">Region</label></div>
                        <div>   <select style={dpstyle} id="dropdown" onChange={this.handleDropdownChange}>
                          <option value="N/A">N/A</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select></div>
                      </div>
                      <div className="col-sm-3">
                        <div><label className="font-weight-bold pt-4">Cluster</label></div>
                        <div>   <select style={dpstyle} id="dropdown" onChange={this.handleDropdownChange}>
                          <option value="N/A">N/A</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
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
              {/* <div className="col-md-10">
                <div className="container">
                  <div className="row effectiveDate fo  rm-group">
                    <div className="col-sm-3">
                      <div><label className="font-weight-bold pt-4">Country</label></div>
                      <div>   <select style={dpstyle} id="dropdown" onChange={this.handleDropdownChange}>
                        <option value="N/A">N/A</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select></div>
                    </div>
                    <div className="col-sm-3">
                      <div><label className="font-weight-bold pt-4">Country Code</label></div>
                      <div>   <select style={dpstyle} id="dropdown" onChange={this.handleDropdownChange}>
                        <option value="N/A">N/A</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select></div>
                    </div>
                    <div className="col-sm-3">
                      <div><label className="font-weight-bold pt-4">Currency Code</label></div>
                      <div>   <select style={dpstyle} id="dropdown" onChange={this.handleDropdownChange}>
                        <option value="N/A">N/A</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select></div>
                    </div>

                    <div className="col-sm-3">
                      <div><label className="font-weight-bold pt-4">Currency Code</label></div>
                      <div>
                        <Input  style={dpstyle} type="text" className="form-control" name="phone" />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="buttons-container">
                {this.state.isActive && <button onClick={() => this.handleClick()}><i class="fa fa-arrow-left" aria-hidden="true"> Back</i></button>}
                <button onClick={() => this.handleReset()}>Reset <i class="fa fa-redo-alt" aria-hidden="true"></i></button>
                {button}
              </div>
            </div>
            </TabPanel>
            <TabPanel tabId="two">
             <ConfigureFeature />
             
              <div className="buttons-container">
                <button class="btn">Reset <i class='fas fa-redo-alt'></i></button>
                <button class="btn">Apply <i class="fa fa-check" aria-hidden="true"></i></button>
              </div>
            </TabPanel>
            <TabPanel tabId="three">
              <div className="buttons-container">
                <br />
                <br />
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