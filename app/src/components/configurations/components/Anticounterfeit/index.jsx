import * as React from 'react';
import PropTypes from 'prop-types';

const tableStyle = {
  border: "none",
  textAlign: "center",
  width: 200,
  height: 35,
};

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
            <table className="table" id="tab_logic">
              <tbody>
                <tr>
                  <td style={tableStyle}><label for="check1">SMS Authentication</label></td>
                  <td style={tableStyle}> <input type="checkbox" id="check1" /></td>
                </tr>
                <tr>
                  <td style={tableStyle}><label for="check1">Digital Scan</label></td>
                  <td style={tableStyle}> <input type="checkbox" id="check2" /></td>
                </tr>
                <tr>
                  <td style={tableStyle}><label for="check1">Smart Live</label></td>
                  <td style={tableStyle}><input type="checkbox" id="check13" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
};

Anticounterfeit.propTypes = {
  onChangeActiveStep: PropTypes.func.isRequired
};
