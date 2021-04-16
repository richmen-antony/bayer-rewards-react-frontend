import * as React from 'react';
import PropTypes from 'prop-types';

import { Input } from '../../../../utility/widgets/input';
import Button from 'react-bootstrap/esm/Button'
const dpstyle = {
  width: 185, 
  height: 35
};
const btncircle = {
  width: 40,
  height: 40,
  borderRadius:20,
  marginTop:10,
}

export const LocationHierarchy = (props) => {
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
        <div className="row rm-group">
          <div className="col-sm-2">
            <div><label className="font-weight-bold pt-4">Location Level</label></div>
            <div><label className="font-weight-bold">0</label></div>
          </div>
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
            <div><label className="font-weight-bold pt-4">Parent Location</label></div>
            <div>   <select style={dpstyle} id="dropdown">
              <option value="N/A">N/A</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select></div>
          </div>
          <div>
            <div><label className="pt-4"></label></div>
            <div><Button variant="success" style={btncircle} >+</Button>{' '}</div>
          </div>
        </div>
      </div>
    </div>
  )
};

LocationHierarchy.propTypes = {
    onChangeActiveStep: PropTypes.func.isRequired
 };
