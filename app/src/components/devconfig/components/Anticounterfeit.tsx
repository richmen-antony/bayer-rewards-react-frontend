import React from "react";
import { connect } from "react-redux";
import "../../devconfig/devconfig.scss";
import CustomSwitch from "../../../containers/components/switch";

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
          <div className="col-sm-5">
            <table className="table" id="tab_logic">
              <tbody>
                <tr>
                  <td className="tableStyle label">
                    <label>SMS Authentication</label>
                  </td>
                  <td className="tableStyle label">
                    <CustomSwitch
                      name="SMSAuthentication"
                      onChange={(e) => {
                        setAnticounterfeitSmsAuthentication(e.target.checked);
                      }}
                      checked={sms_authentication}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="tableStyle label">
                    <label>Digital Scan</label>
                  </td>
                  <td className="tableStyle label">
                    <CustomSwitch
                      name="DigitalScan"
                      onChange={(e) => {
                        setAnticounterfeitDigitalScan(e.target.checked);
                      }}
                      checked={digital_scan}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="tableStyle label">
                    <label>Smart Label</label>
                  </td>
                  <td className="tableStyle label">
                    <CustomSwitch
                      name="SmartLabel"
                      onChange={(e) => {
                        setAnticounterfeitSmartLabel(e.target.checked);
                      }}
                      checked={smart_label}
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
