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
import NoImage from "../../assets/images/no_image.svg";
import OrderTable from "./Order";
import ExpandWindowImg from "../../assets/images/expand-window.svg";

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
}))(MuiDialogActions);

type Props = {
  data: any[];
  state: any;
  previous: any;
  next: any;
  pageNumberClick: any;
};

type States = {
  showPopup: boolean;
  showProductPopup: boolean;
  [key: string]: any;
};

class ScanLogsTable extends Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      showPopup: false,
      showProductPopup: false,
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
  render() {
    const {
      isLoader,
      pageNo,
      totalData,
      rowsPerPage,
      showProductPopup,
    } = this.props.state;
    const { data } = this.props;

    return (
      <AUX>
        {isLoader && <Loader />}
        <div>
          {data.length > 0 ? (
            <div className="scanlog-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
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
                        onClick={(event) =>
                          this.showPopup(event, "showProductPopup")
                        }
                      >
                        <td>{value.order_id}</td>
                        <td>
                          <div className="retailer-id">
                            <p>
                              {value.sellername}
                              <img
                                className="retailer-icon"
                                onClick={(event) =>
                                  this.showPopup(event, "showPopup")
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
                            <i className="fas fa-clock"></i>
                            {value.status}
                          </span>
                        </td>
                        <td>
                          {moment(value.lastupdateddate).format("DD-MM-YYYY")}
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
            dialogStyles={dialogStyles}
            header={popupHeader}
          >
            <DialogContent>
              <div className="popup-container popup-retailer">
                <div className="img">
                  <img src={NoImage} />
                </div>
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p>
                      {popupHeader?.title}, <label>{popupHeader?.sub}</label>{" "}
                    </p>
                  </div>
                  <div className="popup-content-row">
                    <div className="content-list">
                      <label>UserName</label>
                      <p>GCHPU</p>
                    </div>
                    <div className="content-list">
                      <label>Account Name</label>
                      <p>Choke Mongkol Seeds</p>
                    </div>
                    <div className="content-list">
                      <label>Phone Number</label>
                      <p>+265 0987654321</p>
                    </div>
                    <div className="content-list">
                      <label>Region</label>
                      <p>Central Region</p>
                    </div>
                    <div className="content-list">
                      <label>District</label>
                      <p>Kasunga</p>
                    </div>
                    <div className="content-list">
                      <label>EPA</label>
                      <p>Chikwawa</p>
                    </div>
                    <div className="content-list">
                      <label>Postal Code</label>
                      <p>600091</p>
                    </div>
                    <div className="content-list">
                      <label>Account expiry date</label>
                      <p>24 Dec, 2021</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleClosePopup} color="primary">
                Close
              </Button>
              <Button
                onClick={this.handleClosePopup}
                color="secondary"
                autoFocus
              >
                Filter Scans
              </Button>
            </DialogActions>
          </SimpleDialog>
        ) : (
          ""
        )}

        {this.state.showProductPopup ? (
          <OrderTable
            open={showProductPopup}
            close={this.handleCloseProductPopup}
          />
        ) : (
          ""
        )}
      </AUX>
    );
  }
}

export default ScanLogsTable;
