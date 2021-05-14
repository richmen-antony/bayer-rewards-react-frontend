import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import Loaders from "../../utility/widgets/loader";
import "../../assets/scss/scanLogs.scss";
import Loader from "../../utility/widgets/loader";
import { Pagination } from "../../utility/widgets/pagination";
import moment from "moment";
import SimpleDialog from "../../container/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import NoImage from "../../assets/images/Group_4736.svg";
import OrderTable from "./Order";
import ExpandWindowImg from "../../assets/images/expand-window.svg";
import maxImg from "../../assets/images/maximize.svg"
import CalenderIcon from "../../assets/icons/calendar.svg"
import ActiveIcon from "../../assets/images/check.svg";
import { sortBy } from "../../utility/base/utils/tableSort";

const popupHeader = {
  title: "Maria Joseph",
  sub: "Retailer",
};
const dialogStyles = {
  paperWidthSm: {
    width: "800px",
    maxWidth: "800px",
    background: "transparent",
    boxShadow: "none",
  },
  // title: {
  //   right: "150px",
  // },
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    justifyContent: "center",
    // boxShadow: "0px 3px 6px #c7c7c729",
    // border: "1px solid #89D329",
    // borderRadius: "50px",
  },
  button:{
    boxShadow: "0px 3px 6px #c7c7c729",
    border: "1px solid #89D329",
    borderRadius: "50px",

  }
}))(MuiDialogActions);

type Props = {
  data: any[];
  state: any;
  previous: any;
  next: any;
  pageNumberClick: any;
  handlePaginationChange:any
};

type States = {
  showPopup: boolean;
  showProductPopup: boolean;
  [key: string]: any;
  isAsc: Boolean;
};

class ScanLogsTable extends Component<Props, States> {
  tableCellIndex : any;

  constructor(props: any) {
    super(props);
    this.state = {
      showPopup: false,
      showProductPopup: false,
      isAsc: true,
    };
  }

  handleClosePopup = () => {
    this.setState({ showPopup: false });
  };

  showPopup = (e: any, key: keyof States) => {
    e.stopPropagation();
    this.setState<never>({
      [key]: true,
  });
    
  };
  handleCloseProductPopup = () => {
    this.setState({ showProductPopup: false });
  };
  updateOrderData =(value :any)=>{
    this.setState({
      orderData:value
    })

  }
  handleUpdateRetailer (value:any){
    this.setState({
      retailerPopupData:value
    })
  }

  onSort = (name: string, datas: any, isAsc: Boolean) => {
    let response = sortBy(name, datas);
    this.setState({ data: response, isAsc: !isAsc });
  };

  handleSort(e:any,columnname: string, data : any, isAsc : Boolean){
    this.tableCellIndex = e.currentTarget.cellIndex;
    this.onSort(columnname, data, isAsc)
  }

  render() {
    const {retailerPopupData,showProductPopup, isAsc}= this.state;
    const {
      isLoader,
      pageNo,
      totalData,
      rowsPerPage,
    } = this.props.state;
    const { data } = this.props;
    console.log({retailerPopupData});

    return (
      <AUX>
        {isLoader && <Loader />}
        <div>
          {data.length > 0 ? (
            <div className="scanlog-table">
              <table className="table">
                <thead>
                  <tr>
                  <th onClick={e => this.handleSort(e, "order_id", data, isAsc)}>
                    ORDER ID
                    {/* {
                      this.tableCellIndex !== undefined ? (this.tableCellIndex === 0 ? <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i> : null) : <i className={"fas fa-sort-up ml-3"}></i>
                    } */}
                  </th>
                    <th>RETAILER NAME/ID</th>
                    <th>PRODUCT SOLD</th>
                    <th>ORDERED QTY</th>
                    <th>TOTAL COST</th>
                    <th>FARMER NAME/ID</th>
                    <th>FARMER #</th>
                    <th>ORDERED DATE</th>
                    <th>STATUS</th>
                    <th>LAST UPDATED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((value, i) => {
                    return (
                      <tr
                        onClick={(event) =>{
                          this.showPopup(event, "showProductPopup");
                          this.updateOrderData(value)
                        }
                        
                        }
                      >
                        <td>{value.order_id}</td>
                        <td>
                          <div className="retailer-id">
                            <p>
                              {value.sellername}
                              <img
                                className="retailer-icon"
                                onClick={(event) =>{
                                  this.showPopup(event, "showPopup");
                                  this.handleUpdateRetailer(value);
                                }
                              }
                                src={ExpandWindowImg}
                              ></img>
                            </p>
                            <label>DHCIP</label>
                          </div>
                        </td>
                        <td>{value.products_ordered?.length || 0}</td>
                        <td>{value.orderedquantity}</td>
                        <td>{value.totalcost}</td>
                        <td>{value.farmername}</td>
                        <td>{value.farmerphone}</td>
                        <td>
                          {moment(value.ordereddate).format("DD-MM-YYYY")}
                        </td>
                        <td>
                          <span className={`status ${value.status ==="Fulfilled" ? "active":"inactive"}`}>
                          {value.status ==="Fulfilled" ? <img src={ActiveIcon} style={{ marginRight: "8px" }}  width="17"/> :
                            <i className="fas fa-clock"></i>}
                            {value.status}
                          </span>
                        </td>
                        <td>
                          {moment(value.lastupdateddate).format("DD-MM-YYYY")}
                          <img  className="max-image" src={maxImg} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div>
                <Pagination
                  totalData={totalData}
                  rowsPerPage={rowsPerPage}
                  previous={this.props.previous}
                  next={this.props.next}
                  pageNumberClick={this.props.pageNumberClick}
                  pageNo={pageNo}
                  handlePaginationChange={this.props.handlePaginationChange}
                />
              </div>
            </div>
          ) : isLoader ? (
            <Loaders />
          ) : (
            <div className="col-12 card mt-4">
              <div className="card-body ">
                <div className="text-red py-4 text-center">No Data Found</div>
              </div>
            </div>
          )}
        </div>
        {this.state.showPopup ? (
          <SimpleDialog
            open={this.state.showPopup}
            onClose={this.handleClosePopup}
            header={popupHeader}
            maxWidth= {"800px"}
          >
            <DialogContent>
              <div className="popup-container popup-retailer">
                <div className="img">
                  <img src={NoImage} />
                </div>
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {retailerPopupData.sellername}, <label>{popupHeader?.sub}</label>{" "}
                    </p>
                  </div>
                  <div className="popup-content-row">
                    <div className="content-list">
                      <label>UserName</label>
                      <p>{retailerPopupData.username}</p>
                    </div>
                    <div className="content-list">
                      <label>Account Name</label>
                      <p>{retailerPopupData.accountname}</p>
                    </div>
                    <div className="content-list">
                      <label>Phone Number</label>
                      <p>{retailerPopupData.mobilenumber}</p>
                    </div>
                    <div className="content-list">
                      <label>Region</label>
                      <p>{retailerPopupData.region}</p>
                    </div>
                    <div className="content-list">
                      <label>District</label>
                      <p>{retailerPopupData.district}</p>
                    </div>
                    <div className="content-list">
                      <label>EPA</label>
                      <p>{retailerPopupData.epa}</p>
                    </div>
                    <div className="content-list">
                      <label>Postal Code</label>
                      <p>{retailerPopupData.postalcode}</p>
                    </div>
                    <div className="content-list">
                      <label>Account expiry date</label>
                      <div style={{minWidth:"130px"}}> 
                      
                      <p> <img src={CalenderIcon} style={{paddingRight:"5px"}} />{retailerPopupData.expirydate&&moment(retailerPopupData.expirydate).format("Do MMMM, YYYY")}</p>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleClosePopup} className="popup-btn close-btn" >
                Close
              </Button>
              <Button
                onClick={this.handleClosePopup}
                className="popup-btn filter-scan"
                autoFocus
              >
                Filter Scans
              </Button>
            </DialogActions>
          </SimpleDialog>
        ) : (
          ""
        )}

        {showProductPopup ? (
          <OrderTable
            open={showProductPopup}
            close={this.handleCloseProductPopup}
            data={this.state.orderData}
          />
        ) : (
          ""
        )}
      </AUX>
    );
  }
}

export default ScanLogsTable;
