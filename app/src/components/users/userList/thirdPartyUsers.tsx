import React, { Component } from "react";
import '../../../assets/scss/users.scss';
import AUX from "../../../hoc/Aux_";
import Loaders from "../../../utility/widgets/loader";

type Props = {
    location?: any;
    history?: any;
    // classes?: any;
    onSort : Function;
    allThirdParty : any;
    isAsc: Boolean;
}
type States = {
    isActivateUser: boolean;
    isdeActivateUser: boolean;
    isEditUser: boolean;
    dialogOpen: boolean;
    isLoader: boolean;
}

class ThirdPartyUsers extends Component<Props, States> {
    constructor(props: any) {
      super(props);
      this.state={
        dialogOpen: false,
        isActivateUser: false,
        isdeActivateUser: false,
        isEditUser: false,
        isLoader: false
      }
    }


    render() {
        const {allThirdParty, isAsc, onSort } = this.props;
        return (
            <>
            {allThirdParty.length > 0 ?   
            <div className="table-responsive">
            <table className="table" id="tableData">
                <thead>
                <tr>
                    <th>User Name
                        <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => onSort('username', allThirdParty, isAsc)}></i>
                    </th>
                    <th>Field</th>
                    <th>Old Value
                    <i className={`fa ${ isAsc ? 'fa-angle-down' : 'fa-angle-up'} ml-3`} onClick={() => onSort('role', allThirdParty, isAsc)}></i>
                    </th>
                    <th>New Value</th>
                    <th>Modified Date</th>
                    <th>Modified Time</th>
                </tr>
                </thead>
                <tbody>
                { allThirdParty.map((list: any ,i: number) => 
                    <AUX key={i}>
                        <tr style={list.activeStatus ? {borderLeft: '5px solid #89D329'} : {borderLeft: '5px solid #FF4848' }}>
                            <td >{list.accountname}</td>
                            <td>{list.district}  </td>
                            <td>{list.mobilenumber}  </td>
                            <td>{list.state}  </td>
                            <td>{list.expirydate}  </td>
                            <td>{list.expirydate}  </td>
                        </tr>
                    </AUX>
                )}
                </tbody>
            </table>
        </div> : (
            this.state.isLoader ? <Loaders /> : 
            <div className="col-12 card mt-4">
                <div className="card-body ">
                    <div className="text-red py-4 text-center">No Data Found</div>
                </div>
            </div> )
        }
        </>
        );
    }
}

export default ThirdPartyUsers;