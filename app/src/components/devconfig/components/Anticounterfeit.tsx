import React, { useState, useEffect } from 'react';
import "../../devconfig/devconfig.scss";
import plus_icon from "../../../assets/icons/plus_icon.svg";
import minus from "../../../assets/icons/minus.svg";


interface IAnticounterfeitProps {
    prevStep: () => void;
    setAnticounterfeit: (data: any) => void;
}

export const Anticounterfeit = (props: IAnticounterfeitProps) => {
    const { setAnticounterfeit } = props;
    const [valSMSAuthentication, setSMSAuthentication] = useState(false);
    const [valDititalScan, setDigitalScan] = useState(false);
    const [valSmartLabel, setSmartLabel] = useState(false);

    return (
        <div className="col-md-10">
            <div className="container">
                <div className="row rm-group">
                    <div className="col-sm-3">
                        <table className="table" id="tab_logic">
                            <tbody>
                                <tr>
                                    <td className="tableStyle"><label>SMS Authentication</label></td>
                                    <td className="tableStyle"><input type="checkbox" id="check1" /></td>
                                </tr>
                                <tr>
                                    <td className="tableStyle"><label>Digital Scan</label></td>
                                    <td className="tableStyle"><input type="checkbox" id="check2" /></td>
                                </tr>
                                <tr>
                                    <td className="tableStyle"><label>Smart Label</label></td>
                                    <td className="tableStyle"><input type="checkbox" id="check13" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
