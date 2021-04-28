import React, { useState } from "react";
import SimpleDialog from "../../container/components/dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import advisorImg from "../../assets/images/advisor.svg"
import farmerImg from "../../assets/images/farmer.svg"
import retailerImg from "../../assets/images/retailer.svg"

const popupHeader = {
  title: "Order ID",
  sub: "1538",
};
const dialogStyles = {
  paperWidthSm: {
    maxWidth: "800px",
    background: "transparent",
    boxShadow: "none",
  },
};
const DialogTitle = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))(MuiDialogTitle);

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
  },
}))(MuiDialogActions);

interface Props {
  open: boolean;
  close: () => void;
  data: any;
}
/**
 *OrderTable Functional Component
 * @param props
 * @returns
 */
const OrderTable: React.FC<Props> = ({ open, close, data }) => {
  console.log({ data });
  return (
    <SimpleDialog
      open={open}
      onClose={close}
      dialogStyles={dialogStyles}
      header={popupHeader}
    >
      <DialogContent>
        <div className="popup-container ordered-table">
        <div className="popup-content">
            <div className={`popup-title`}>
              <p>
                {popupHeader?.title}, <label>{data?.order_id}</label>{" "}
              </p>
            </div>
          </div>
          <div className="wrapper-progressBar">
            <ul className="progressBar">
              <li className="active">
                <div className="content">
                  <img
                    src={advisorImg }
                    alt=""
                  />

                  <p>Advisor ID & Name</p>
                </div>
              </li>
              <li className="active">
                <div className="content">
                  <img
                    src={retailerImg }
                    alt=""
                  />
                  <p>Retailer ID & Name</p>
                </div>
              </li>
              <li>
                <div className="content">
                  <img
                    src={farmerImg }
                    alt=""
                  />
                  <p>Farmer ID & Name</p>
                </div>
              </li>
            </ul>
          </div>

          
          {data?.products_ordered?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>INTENDED QTY</th>
                  <th>ORDERED QTY</th>
                  <th>TOTAL COST</th>
                </tr>
              </thead>
              <tbody>
                {data.products_ordered.map((value: any, index: number) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{value.productsku}</td>
                      <td>{value.type}</td>
                      <td>{value.intendedqty}</td>
                      <td>{value.orderedqty}</td>
                      <td>{value.price}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    Total <span>16</span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="col-12 card mt-4">
              <div className="card-body ">
                <div className="text-red py-4 text-center">No Data Found</div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={close} className="popup-btn close-btn">
          Close
        </Button>
      </DialogActions>
    </SimpleDialog>
  );
};

export default OrderTable;
