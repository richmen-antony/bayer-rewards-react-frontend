import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";
import {
  setAnticounterfeitSmsAuthentication,
  setAnticounterfeitDigitalScan,
  setAnticounterfeitSmartLabel,
} from "../../../redux/actions/devconfig/add";

interface IAnticounterfeitProps {
  setAnticounterfeitSmartLabel: (data: any) => void;
  setAnticounterfeitSmsAuthentication: (data: any) => void;
  setAnticounterfeitDigitalScan: (data: any) => void;
  smart_label: any;
  sms_authentication: any;
  digital_scan: any;
}

const mapDispatchToProps = {
  setAnticounterfeitSmsAuthentication,
  setAnticounterfeitDigitalScan,
  setAnticounterfeitSmartLabel,
};

const mapStateToProps = ({ devconfig: { anticounterfeit } }: any) => {
  return {
    sms_authentication: anticounterfeit.sms_authentication,
    digital_scan: anticounterfeit.digital_scan,
    smart_label: anticounterfeit.smart_label,
  };
};

const AnticounterfeitComp = (props: IAnticounterfeitProps) => {
  const {
    sms_authentication,
    digital_scan,
    smart_label,
    setAnticounterfeitSmartLabel,
    setAnticounterfeitDigitalScan,
    setAnticounterfeitSmsAuthentication,
  } = props;

  return (
    <div className="col-md-10">
      <div className="container">
        <div className="row rm-group">
          <div className="col-sm-3">
            <table className="table" id="tab_logic">
              <tbody>
                <tr>
                  <td className="tableStyle">
                    <label>SMS Authentication</label>
                  </td>
                  <td className="tableStyle">
                    <input
                      type="checkbox"
                      id="check1"
                      onChange={(e) => {
                        setAnticounterfeitSmsAuthentication(e.target.checked);
                      }}
                      checked={sms_authentication}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="tableStyle">
                    <label>Digital Scan</label>
                  </td>
                  <td className="tableStyle">
                    <input
                      type="checkbox"
                      id="check2"
                      checked={digital_scan}
                      onChange={(e) => {
                        setAnticounterfeitDigitalScan(e.target.checked);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="tableStyle">
                    <label>Smart Label</label>
                  </td>
                  <td className="tableStyle">
                    <input
                      type="checkbox"
                      id="check13"
                      checked={smart_label}
                      onChange={(e) => {
                        setAnticounterfeitSmartLabel(e.target.checked);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Anticounterfeit = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnticounterfeitComp);
