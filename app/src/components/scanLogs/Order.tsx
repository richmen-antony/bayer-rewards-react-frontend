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
const popupHeader = {
  title: "Order ID",
  sub: "1538",
};
const dialogStyles = {
  paperWidthSm: {
    maxWidth: "800px",
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
}
/**
 *OrderTable Functional Component
 * @param props
 * @returns
 */
const OrderTable: React.FC<Props> = ({ open, close }) => {
  return (
    <SimpleDialog
      open={open}
      onClose={close}
      dialogStyles={dialogStyles}
      header={popupHeader}
    >
      <DialogContent>
        <div className="odered-table">
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
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
              <td></td>
                <td></td>
                <td></td>
                <td>16</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={close} color="primary">
          Close
        </Button>
      </DialogActions>
    </SimpleDialog>
  );
};

export default OrderTable;
