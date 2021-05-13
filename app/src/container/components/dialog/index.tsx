import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  makeStyles,
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "../../../assets/images/cancel-1.svg";

type Props = {
  open: boolean;
  onClose: Function;
  children: any;
  header?: any;
  maxWidth: any;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
    },
    closeButton: {
      position: "static",
      display: "block",
      marginLeft: "auto",
      padding: 0,
      marginRight: "15px",
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  header: any;
  onClose: () => void;
  style?: any;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { header, classes, onClose, style, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <img src={CancelIcon} className="close-popup-icon" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  classes: any;
  dialogStyles?: any;
  header?: any;
}
export interface StyleProps {
  maxWidth?: string;
}
const DialogStyles = makeStyles<Theme, StyleProps>((theme) => ({
  paperWidthSm: {
    maxWidth: ({ maxWidth }) => (maxWidth ? maxWidth : "600px"),
    background: "transparent",
    boxShadow: "none",
  },
}));
export default function SimpleDialog({
  onClose,
  open,
  children,
  header,
  maxWidth,
}: Props) {
  const classes = DialogStyles({ maxWidth });
  return (
    <Dialog
      classes={{ paper: classes.paperWidthSm }}
      onClose={() => onClose()}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={() => onClose()}
        header={header}
        style={classes}
      ></DialogTitle>
      {children}
    </Dialog>
  );
}
