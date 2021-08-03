import React, {Component} from 'react';
import Dropdown from "../../../utility/widgets/dropdown";
import CustomSwitch from "../../../container/components/switch";
import { Input } from "../../../utility/widgets/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { allowAlphabetsNumbers } from "../../../utility/base/utils/";
import UserMappings from './UserMappings';
// import "../../../assets/scss/createUser.scss";

// type Props = {
//     handleChange : Function;
//     userData: any;
//     role: Array<object>;
//     areaManagerStatus: any;
// }
// type States = {
//     asaDatas : {
//         active: boolean;
//         fullname: string;
//         email: string;
//         phonenumber: string;
//     }
// }

class AreaSalesManager extends Component<any, any> {
    constructor(props:any){
        super(props);
        this.state = {
        }
    }

    render(){
        const {asahandleChange,
             asaDatas, 
             role, 
             userData, 
             handleChange, 
             countryCodeLower,
             currentStep,
             geolevel1List,
             handleAddRow,
             handleRemoveSpecificRow,
             partnerhandleChange,
             partnerDatas,
             channelPartnersOptions
            } = this.props;
        return (
            <>
                {currentStep === 1 && 
                <div className="areasales" style={{ width: "115%" }}>
                    <div className="row fieldsAlign">
                        <div className="col-sm-3">
                            <Dropdown
                                name="rolename"
                                label="User Type"
                                options={role}
                                handleChange={(e: any) =>
                                    // handleChange("", e, "", "othersteps", "")
                                    asahandleChange(e)
                                }
                                value={userData.rolename}
                                isPlaceholder
                            />
                        </div>
                        <div className="col-sm-3">
                            <Input
                                type="text"
                                className="form-control"
                                name="fullname"
                                placeHolder="Full Name"
                                value={asaDatas.fullname}
                                onChange={(e: any) =>
                                    asahandleChange(e)
                                }
                                onKeyPress={(e: any) =>
                                    allowAlphabetsNumbers(e)
                                }
                            />
                        </div>
                        <div className = "col-sm-3">
                            <label className="font-weight-bold">Is Active?</label>
                            <CustomSwitch checked={asaDatas.active}
                                onChange={(e: any) =>
                                    asahandleChange(e)
                                }
                                name="active"
                            />
                        </div>
                    </div>
                    <div className="row fieldsAlign">
                        <div className="col-sm-3">
                        <div className="flagInput">
                            <PhoneInput
                                placeholder="Mobile Number"
                                inputProps={{
                                name: "mobilenumber",
                                required: true,
                                maxLength:
                                    process.env.REACT_APP_STAGE ===
                                    "dev" ||
                                    process.env.REACT_APP_STAGE ===
                                    "int"
                                    ? 12
                                    : 11,
                                }}
                                country={countryCodeLower}
                                value={asaDatas.mobilenumber}
                                // disabled={isEditPage ? true : false}
                                onChange={(value, e) =>
                                    asahandleChange(e, value, "mobilenumber")
                                }
                                onlyCountries={[countryCodeLower]}
                                autoFormat
                                disableDropdown
                                disableCountryCode
                            />
                            </div>
                        </div>
                        <div className="col-sm-3">
                        <Input
                            data-testid = "email-input"
                            type="email"
                            className="form-control"
                            name="email"
                            placeHolder="Eg: abc@mail.com"
                            value={asaDatas.email}
                            onChange={(e: any) =>
                                asahandleChange(e)
                            }
                            // onKeyUp={(e: any) =>
                            //     this.validateEmail(
                            //     e.target.value,
                            //     idx,
                            //     "owner"
                            //     )
                            // }
                            />
                        </div>
                    </div>
                </div>
                }
                {currentStep === 3 && (
                    <UserMappings geolevel1List={geolevel1List} handleAddRow={handleAddRow} handleRemoveSpecificRow={handleRemoveSpecificRow} partnerhandleChange={partnerhandleChange} partnerDatas={partnerDatas}
                    channelPartnersOptions={channelPartnersOptions} />
                )}
            </>

        );
    }
}

export default AreaSalesManager;