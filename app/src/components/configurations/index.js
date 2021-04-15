import React, { Component } from "react";
import "./configurations.scss";
import Stepper from "../../container/components/stepper/Stepper";
import { TabProvider, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';

class Configurations extends Component {
  constructor() {
    super();
    this.state = {
      currentStep: 1,
      isActive: false
    };
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


  render() {
    const { currentStep } = this.state;
    let button;
    if (currentStep === stepsArray.length) {
      button = <button onClick={() => this.handleClick("next")}>Submit <i class="fa fa-check" aria-hidden="true"></i></button>;
    } else {
      button = <button onClick={() => this.handleClick("next")}>Next <i class="fa fa-arrow-right" aria-hidden="true"></i></button>;
    }

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
                <div className="stepper-container-horizontal">
                  <Stepper
                    direction="horizontal"
                    currentStepNumber={currentStep - 1}
                    steps={stepsArray}
                    stepColor="#555555"
                  />
                </div>
              <div className="buttons-container">
                {this.state.isActive && <button onClick={() => this.handleClick()}><i class="fa fa-arrow-left" aria-hidden="true"> Back</i></button>}
                <button onClick={() => this.handleReset()}>Reset <i class="fa fa-redo-alt" aria-hidden="true"></i></button>
                {button}
              </div>
            </TabPanel>
            <TabPanel tabId="two">
              <br />
              <br />
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