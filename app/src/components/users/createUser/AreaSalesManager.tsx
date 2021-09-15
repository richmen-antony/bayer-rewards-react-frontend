import React, {Component} from 'react';
import Dropdown from "../../../utility/widgets/dropdown";
import CustomSwitch from "../../../containers/components/switch";
import { Input } from "../../../utility/widgets/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { allowAlphabetsNumbers } from "../../../utility/base/utils/";
import UserMappings from './UserMappings';
import { patterns } from "../../../utility/base/utils/patterns";
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
            asaEmailErr :""
        }
    }

    validateEmail = (value:any) => {
        let emailErr = this.state.asaemailErr;
        if (patterns.emailFormat.test(value)) {
            emailErr = "";
          } else if (value === "") {
            emailErr = "";
          } else {
            emailErr = "Please enter a valid email";
          }
          this.setState({asaemailErr: emailErr })
    }

    render(){
        const {asahandleChange,
             asaDatas, 
             role, 
             userData, 
             countryCodeLower,
             currentStep,
             geolevel1List,
             handleAddRow,
             handleRemoveSpecificRow,
             partnerhandleChange,
             partnerDatas,
             channelPartnersOptions,
             asafirstnameErr,
             asalastnameErr,
             asamobilenumberErr,
             isEditPage
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
                                name="firstname"
                                placeHolder="First Name"
                                value={asaDatas.firstname}
                                onChange={(e: any) =>
                                    asahandleChange(e)
                                }
                                onKeyPress={(e: any) =>
                                    allowAlphabetsNumbers(e)
                                }
                            />
                             {asafirstnameErr && (
                                <span className="error">
                                    {asafirstnameErr}{" "}
                                </span>
                            )}
                        </div>
                        <div className="col-sm-3">
                            <Input
                                type="text"
                                className="form-control"
                                name="lastname"
                                placeHolder="Last Name"
                                value={asaDatas.lastname}
                                onChange={(e: any) =>
                                    asahandleChange(e)
                                }
                                onKeyPress={(e: any) =>
                                    allowAlphabetsNumbers(e)
                                }
                            />
                             {asalastnameErr && (
                                <span className="error">
                                    {asalastnameErr}{" "}
                                </span>
                            )}
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
                                    disabled={isEditPage ? true : false}
                                    onChange={(value, e) =>
                                        asahandleChange(e, value, "mobilenumber")
                                    }
                                    onlyCountries={[countryCodeLower]}
                                    autoFormat
                                    disableDropdown
                                    disableCountryCode
                                />
                                 {asamobilenumberErr && (
                                <span className="error" data-testid="error-msg">
                                    {asamobilenumberErr}{" "}
                                </span>
                                )}
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
                            onKeyUp={(e: any) =>
                                this.validateEmail(e.target.value)
                            }
                            />
                            {this.state.asaemailErr && (
                                <span className="error" data-testid="error-msg">
                                    {this.state.asaemailErr}{" "}
                                </span>
                                )}
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
                </div>
                }
                {currentStep === 3 && (
                    <UserMappings geolevel1List={geolevel1List} handleAddRow={handleAddRow} handleRemoveSpecificRow={handleRemoveSpecificRow} partnerhandleChange={partnerhandleChange} partnerDatas={partnerDatas}
                    channelPartnersOptions={channelPartnersOptions}
                    page = "createuser" />
                )}
            </>

        );
    }
}

export default AreaSalesManager;