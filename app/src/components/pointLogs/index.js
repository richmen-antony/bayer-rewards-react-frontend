import React , {Component } from 'react';
import AUX from '../../../hoc/Aux_';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import Loaders from '../../widgets/loader';
import '../scanLogs/scanLogs.scss';

const { ExportCSVButton } = CSVExport;
const columns = [{
    dataField: 'sNo',
    text: 'S.No'
  }, {
    dataField: 'name',
    text: 'Name'
  }, {
    dataField: 'gdCommission',
    text: 'Gordon Commission (\u20AC)'
  },
  , {
    dataField: 'driverCharges',
    text: 'Driver Charges (\u20AC)'
  }, {
    dataField: 'rideCharges',
    text: 'Ride Charges (\u20AC)'
  }, {
    dataField: 'cancelCharges',
    text: 'Cancelled Charges (\u20AC)'
  }, {
    dataField: 'netPay',
    text: 'Net to pay (\u20AC)'
  }
];

class ScanLogs extends Component{
    constructor(props) {
        super(props)
        this.state = {
            allRideList: [
                {
                    'sNo': "1",
                    'name': "mani",
                    'gdCommission': "test",
                    'driverCharges': "wer",
                    'rideCharges': "12",
                    'cancelCharges': "Total",
                    'netPay': 100
                },
                {
                    'sNo': "1",
                    'name': "Vijay",
                    'gdCommission': "test",
                    'driverCharges': "wer",
                    'rideCharges': "12",
                    'cancelCharges': "Total",
                    'netPay': 200
                }
            ]
        }
    }
 
render(){
    return(
            <AUX>
                <div className="container-fluid">
                    <div className="page-title-box mt-2">
                        <div className="row align-items-center">
                            <div className="col-sm-6">
                                <h4 className="page-title">Scan Logs</h4>
                            </div>
                            <div className="col-sm-6">
                            </div>
                        </div>
                    </div>
                    <div className="test">
                    <ToolkitProvider
                                keyField="id"
                                data={ this.state.allRideList }
                                columns={ columns }
                                exportCSV
                                >
                                {
                                    props => (
                                    <div>
                                        <div className="row">
                                            <div className="col-md-6 mt-4">
                                                { this.state.allRideList.length > 0 &&  
                                                    <ExportCSVButton className="btn-primary btn-sm" { ...props.csvProps }> Export CSV</ExportCSVButton>
                                                }
                                            </div>
                                            <div className="col-md-6 form-group mb-0">
                                                { this.state.allRideList.length > 0 &&   
                                                    <div className="form-group mt-3 d-flex justify-content-end">
                                                        <label className="col-form-label"> Search : </label>
                                                        <div className="ml-2"></div>
                                                        <div>
                                                            <input className="form-control" onChange={this.searchRecord} type="search" value={this.state.searchText} />
                                                        </div>
                                                    </div> 
                                                }
                                            </div>
                                        </div>  
                                        { this.state.allRideList.length > 0 ?   
                                            <BootstrapTable { ...props.baseProps } />
                            //                 <div className="table-responsive">
                            //     <table className="table table-hover mb-0">
                            //         <thead>
                            //             <tr>
                            //                 <th>S.No</th>
                            //                 <th>Name</th>
                            //                 <th>Gordon Commission</th>
                            //                 <th>Driver Charges</th>
                            //                 <th>Ride Charges</th>
                            //                 <th>Cancelled Charges</th>
                            //                 <th>Net to pay</th>
                            //             </tr>
                            //         </thead>
                            //         <tbody>
                            //             { this.state.allRideList.map((list,i) => 
                            //             <>
                            //                 <tr>
                            //                     <th scope="row">{i+1}</th>
                            //                     <td>{list.name}</td>
                            //                     <td>{list.gdCommission} {'\u20AC'} </td>
                            //                     <td>{list.driverCharges} {'\u20AC'}</td>
                            //                     <td>{list.rideCharges} {'\u20AC'}</td>
                            //                     <td>{list.cancelCharges} {'\u20AC'}</td>
                            //                     <td>{list.netPay} jj</td>
                            //                 </tr>
                                          
                            //             </> 
                            //             )
                            //             }
                                    
                            //         </tbody>
                            //     </table>
                            // </div>
                                            :
                                            this.state.isLoader ? <Loaders /> : 
                                            <div className="col-12 card mt-4">
                                                <div className="card-body ">
                                                    <div className="text-red py-4 text-center">No Data Found</div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    )
                                }
                            </ToolkitProvider>
                    </div>

                    
                   
                </div>
           
            </AUX>
        );
    }
}

export { ScanLogs };   