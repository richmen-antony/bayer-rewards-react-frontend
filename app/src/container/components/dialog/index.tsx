import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "../../../assets/images/cancel.svg"


type Props = {
  open: Boolean;
  onClose: Function;
  children: any;
  dialogStyles?:any
  header?:any
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      // position: "absolute",
      // right: theme.spacing(1),
      // top: theme.spacing(1),
      // color: theme.palette.grey[500],
      position: "static",
    display: "block",
    marginLeft: "auto",
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  header: any;
  onClose: () => void;
  style?:any
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { header, classes, onClose,style, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
        
      
     
       
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <img src={CancelIcon} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
  open: Boolean;
  classes:any
  dialogStyles ?:any
  header?:any
 
}

export default function SimpleDialog({ onClose, open, children,dialogStyles,header }: Props) {


  const CusDialog = withStyles(dialogStyles)((props: DialogProps) => {
    const { children, classes, onClose,header, ...other } = props;
    return (
      <Dialog
        classes={{ paper: classes.paperWidthSm }}
        onClose={() => onClose()}
        aria-labelledby="customized-dialog-title"
        open={true}
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
  });
  
  return <CusDialog onClose={() => onClose()} open={open} children={children} dialogStyles={dialogStyles} header={header} />
  
}
