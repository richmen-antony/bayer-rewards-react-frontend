import React, { useState } from "react";
import AdminPopup from "../../../container/components/dialog";
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

const popupHeader = {
  title: "Order ID",
  sub: "1538",
};
const dialogStyles = {
  paperWidthSm: {
    maxWidth: "600px",
    background: "transparent",
    boxShadow: "none",
  },
};
// const DialogTitle = withStyles((theme: Theme) => ({
//   root: {
//     padding: theme.spacing(2),
//   },
//   closeButton: {
//     position: "absolute",
//     right: theme.spacing(1),
//     top: theme.spacing(1),
//     color: theme.palette.grey[500],
//   },
// }))(MuiDialogTitle);

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
 *Add Service Functional Component
 * @param props
 * @returns
 */
const AddService: React.FC<Props> = ({ open, close, data }) => {
  return (
    <AdminPopup
      open={open}
      onClose={close}
      dialogStyles={dialogStyles}
      header={popupHeader}
    >
      <DialogContent>
        <div className="popup-container">
          <div className="popup-content">
            <div className={`popup-title`}>
              <p>Points Redemption</p>
            </div>
          </div>
          <div>
            <form>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputEmail4">Service Name</label>
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail4"
                    placeholder="Points Management"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputState">State</label>
                  <select id="inputState" className="form-control">
                    <option selected>Choose...</option>
                    <option>...</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputAddress">URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputAddress"
                  placeholder="get/points/management/details"
                />
              </div>
              <div className="form-group">
                <label htmlFor="inputAddress2">Params</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputAddress2"
                  placeholder="tokenId"
                />
              </div>
              <div className="form-group">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="gridCheck"
                  />
                  <label className="form-check-label" htmlFor="gridCheck">
                    Is Active?
                  </label>
                </div>
              </div>
            </form>
          </div>
          <DialogActions>
        <Button autoFocus onClick={close} className="admin-popup-btn close-btn">
          Cancel
        </Button>
        <Button
          // onClick={this.handleClosePopup}
          className="admin-popup-btn filter-scan"
          autoFocus
        >
          Add Service
        </Button>
      </DialogActions>
        </div>
      </DialogContent>
    </AdminPopup>
  );
};

export default AddService;
