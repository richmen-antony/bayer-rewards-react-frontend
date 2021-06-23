import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import AdminPopup from "../../container/components/dialog/AdminPopup";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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
      marginTop: "30px",
    },
    button: {
      boxShadow: "0px 3px 6px #c7c7c729",
      border: "1px solid #89D329",
      borderRadius: "50px",
    },
  }))(MuiDialogActions);


interface Props {
    when: boolean;
    onOK: () => any;
    onCancel: () => any;
    title: any;
    okText: any;
    cancelText: any;
  }
  /**
   * To handle the router prompt  when notify popup
   * @param props 
   * @returns 
   */
const RouterPrompt :React.FC<Props>=(props:Props)=> {
  const { when, onOK, onCancel, title, okText, cancelText } = props;

  const history = useHistory();

  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (when) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname);
        setShowPrompt(true);
        return "true";
      });
    } else {
      history.block(() => {});
    }

    return () => {
      history.block(() => {});
    };
  }, [history, when]);

  const handleOK = useCallback(async () => {
    if (onOK) {
      const canRoute = await Promise.resolve(onOK());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
  }, [currentPath, history, onOK]);

  const handleCancel = useCallback(async () => {
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
    setShowPrompt(false);
  }, [currentPath, history, onCancel]);
 
  return showPrompt ? (
    <AdminPopup
    open={showPrompt}
    onClose={handleCancel}
    maxWidth={"600px"}
  >
    <DialogContent>
      <div className="popup-container">
        <div className="popup-content">
          <div className={`popup-title`}>
            <p>
              Confirmation
            </p>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <label>
          There are unsaved changes. Are you sure want to leave this page ?
          </label>
        </div>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleCancel}
            className="admin-popup-btn close-btn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleOK}
            className="admin-popup-btn filter-scan"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </div>
    </DialogContent>
  </AdminPopup>
  ) : null;
}

export default RouterPrompt;