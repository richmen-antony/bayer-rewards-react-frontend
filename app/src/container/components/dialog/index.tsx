import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

type Props = {
  open: Boolean;
  onClose: Function;
  children: any;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      width: '450px'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

// export interface DialogTitleProps extends WithStyles<typeof styles> {
//   id: string;
//   children: React.ReactNode;
//   onClose: Function;
// }

// const DialogTitle = withStyles(styles)(Props => {
//   const { classes, onClose } = Props;
//   return (
//     <MuiDialogTitle disableTypography className={classes.root}>
//       {onClose ? (
//         <IconButton className={classes.closeButton} onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </MuiDialogTitle>
//   );
// });

const DialogTitle = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
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
  },
}))(MuiDialogActions);


/**
 * @Dropdown
 *
 * Defines the Dialog component. This component is reusable and can be custom
 * rendered with props.
 *
 * @example
 * import SimpleDialog from "../../../container/components/dialog";
 * this.state: {
*    dialogOpen: false
*  }
* handleDialogClose = () => {
*  this.setState({ dialogOpen : false,});
* };
* handleDialogOpen = () => {
*  this.setState({dialogOpen : true});
* };
* 
* {this.state.dialogOpen &&
*  <SimpleDialog 
*  open={this.state.dialogOpen}
*  onClose={this.handleDialogClose}>
*      <DialogTitle id="customized-dialog-title">
*        <IconButton onClick={this.handleDialogClose}>
*          <CloseIcon />
*        </IconButton>
*    </DialogTitle>
*    <DialogContent>
*          <Typography gutterBottom>
*              Are you Sure. Do you want to activate the user?
*          </Typography>
*          <Typography gutterBottom>
*              Are you Sure. Do you want to deActivate the user?
*          </Typography> 
*    <DialogActions>
*          <button onClick={this.handleDialogClose}>Cancel</button>
*          <button>Confirm</button>
*    </DialogActions>
 * </SimpleDialog>
 */

export default function SimpleDialog({onClose,open, children}: Props) {
  return (
    <div>
      <Dialog onClose={()=>onClose()} aria-labelledby="customized-dialog-title" open={true}>
          {children}
      </Dialog>
    </div>
  );
}