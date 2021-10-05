import React, {Component} from 'react';
import Dropdown from "../../../utility/widgets/dropdown";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
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

const partnertypeOptions = [
    { value: "DISTRIBUTOR", text: "Distributor" },
    { value: "RETAILER", text: "Retailer" },
];
class UserMappings extends Component<any, any> {
    constructor(props:any){
        super(props);
        this.state = {
            partnertype : 'Distributor',

        }
    }

    render(){
        const {geolevel1List, handleRemoveSpecificRow, handleAddRow, partnerhandleChange, partnerDatas, channelPartnersOptions, page} = this.props;
        let level1Datas:any =[];
        geolevel1List?.forEach((item: any) => {
            let level1Info = { text: item.name, code: item.code, value: item.name };
            level1Datas.push(level1Info);
        });
        if (page === "listuser") {
            level1Datas.shift();
        }

        return (
            <div className="userMappings">
                <table className="table table-borderless" data-testid="table">
                    <thead>
                        <tr>
                            <th>Channel Partner Type</th>
                            <th>Location</th>
                            <th>Channel Partner Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partnerDatas.map((item:any, idx:number) => {
                        return (
                        <tr>
                            <td>
                                <div className="col-sm-3 form-group">
                                    <Dropdown
                                        name="partnertype"
                                        label="Select Type"
                                        options={partnertypeOptions}
                                        handleChange={(e: any) =>
                                            partnerhandleChange(e, idx)
                                        }
                                        value={item.partnertype}
                                        isPlaceholder
                                    />
                                    {item.errObj?.typeErr && (
                                        <span className="error">
                                            {item.errObj.typeErr}{" "}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="col-sm-3 form-group">
                                    <Dropdown
                                        name="geolevel1"
                                        label="Select Location"
                                        options={level1Datas}
                                        handleChange={(e: any) =>
                                            partnerhandleChange(e, idx)
                                        }
                                        value={item.geolevel1}
                                        isPlaceholder
                                    />
                                     {item.errObj?.locationErr && (
                                        <span className="error">
                                            {item.errObj.locationErr}{" "}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="col-sm-3 form-group">
                                    <Dropdown
                                        name="channelpartnerid"
                                        label="Select Name"
                                        options={channelPartnersOptions[idx]}
                                        handleChange={(e: any, options:any) =>
                                            partnerhandleChange(e, idx)
                                        }
                                        value={item.channelpartnerid}
                                        isPlaceholder
                                    />
                                     {item.errObj?.nameErr && (
                                        <span className="error">
                                            {item.errObj.nameErr}{" "}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>
                            <div>
                                {idx ===
                                partnerDatas.length - 1 ? (
                                (() => {
                                    if (idx === 0 && idx === partnerDatas.length - 1 ) {
                                    return (
                                        <div>
                                            <img
                                                style={{
                                                width: "50px",
                                                height: "50px",
                                                }}
                                                src={AddBtn}
                                                alt=""
                                                onClick={() =>
                                                    handleAddRow()
                                                }
                                            />
                                        </div>
                                    );
                                    } else if (idx > 0 && idx === partnerDatas.length -1) {
                                    return (
                                        <div>
                                            <span className="addIcon">
                                            <img
                                                style={{
                                                width: "50px",
                                                height: "50px",
                                                }}
                                                src={RemoveBtn}
                                                alt=""
                                                onClick={handleRemoveSpecificRow(idx)}
                                            />
                                            <img
                                                style={{
                                                width: "50px",
                                                height: "50px",
                                                }}
                                                src={AddBtn}
                                                alt=""
                                                onClick={() =>
                                                    handleAddRow()
                                                }
                                            />
                                            </span>
                                        </div>
                                    );
                                    }
                                })()
                                ) : (
                                <img
                                    style={{
                                    width: "50px",
                                    height: "50px",
                                    }}
                                    src={RemoveBtn}
                                    alt=""
                                    onClick={handleRemoveSpecificRow(idx)}
                                />
                                )}
                            </div>
                            </td>
                        </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default UserMappings;