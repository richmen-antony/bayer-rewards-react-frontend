import * as React from 'react';
import PropTypes from 'prop-types';

import { Input } from '../../../../utility/widgets/input';

const dpstyle = {
  width: 185, 
  height: 35
};

export const CountrySetup = (props) => {
  const _onChangeActiveStep = nextActiveStep => {
    const { onChangeActiveStep } = props;

    if (onChangeActiveStep && typeof onChangeActiveStep === "function") {
      onChangeActiveStep(nextActiveStep);
    }

    // this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  // handleDropdownChange(e) {
  //   this.setState({ selectValue: e.target.value });
  // }

  return (
    <div className="col-md-10">
    <div className="container">
      <div className="row effectiveDate fo  rm-group">
        <div className="col-sm-3">
          <div><label className="font-weight-bold pt-4">Country</label></div>
          <div>   <select style={dpstyle} id="dropdown">
            <option value="N/A">N/A</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select></div>
        </div>
        <div className="col-sm-3">
          <div><label className="font-weight-bold pt-4">Country Code</label></div>
          <div>   <select style={dpstyle} id="dropdown">
            <option value="N/A">N/A</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select></div>
        </div>
        <div className="col-sm-3">
          <div><label className="font-weight-bold pt-4">Currency Code</label></div>
          <div>   <select style={dpstyle} id="dropdown">
            <option value="N/A">N/A</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select></div>
        </div>

        <div className="col-sm-3">
          <div><label className="font-weight-bold pt-4">Currency</label></div>
          <div>
            <Input  style={dpstyle} type="text" className="form-control" name="Currency" />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
};


CountrySetup.propTypes = {
     onChangeActiveStep: PropTypes.func.isRequired
};