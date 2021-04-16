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

export const Anticounterfeit = (props) => {
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
          <div className="col-sm-3">
          <div>
			<label for="check1">SMS Authentication</label>
            <input type="checkbox" id="check1"/>
           </div>
           <div>
			<label for="check1">Digital Scan</label>
            <input type="checkbox" id="check1"/>
           </div>
           <div>
			<label for="check1">Smart Live</label>
            <input type="checkbox" id="check1"/>
           </div>
          </div>
        </div>
      </div>
    </div>
  )
};

Anticounterfeit.propTypes = {
    onChangeActiveStep: PropTypes.func.isRequired
 };
