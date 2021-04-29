import React, { useState } from "react";
import SimpleDialog from "../../../container/components/dialog";
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
 *Add Service Functional Component
 * @param props
 * @returns
 */
const AddService: React.FC<Props> = ({ open, close, data }) => {
  console.log({ data });
  return (
    <SimpleDialog
      open={open}
      onClose={close}
      dialogStyles={dialogStyles}
      header={popupHeader}
    >
      <DialogContent>
        <div className="popup-container">
        <div className="popup-content">
            <div className={`popup-title`}>
              <p>
                Points Redemption
              </p>
            </div>
          </div>
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

export default AddService;
