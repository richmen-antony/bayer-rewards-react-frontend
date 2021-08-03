import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AUX from "../../../hoc/Aux_";
import Pagination from "../../../utility/widgets/pagination";
import AdminPopup from "../../../container/components/dialog/AdminPopup";
import Edit from "../../../assets/images/edit.svg";
import EditDisabled from "../../../assets/icons/edit_disabled.svg";
import NotActivated from "../../../assets/images/not_activated.svg";
import Check from "../../../assets/images/check.svg";
import Cancel from "../../../assets/images/cancel.svg";
import AddBtn from "../../../assets/icons/add_btn.svg";
import RemoveBtn from "../../../assets/icons/Remove_row.svg";
import RtButton from "../../../assets/icons/right_btn.svg";
import NoImage from "../../../assets/images/no_image.svg";
import blackmockup from "../../../assets/icons/black-mockup.svg";
import ArrowIcon from "../../../assets/icons/dark bg.svg";
import ExpandWindowImg from "../../../assets/images/expand-window.svg";
import "../../../assets/scss/users.scss";
import "../../../assets/scss/createUser.scss";
import { apiURL } from "../../../utility/base/utils/config";
import { patterns } from "../../../utility/base/utils/patterns";
import {
  invokeGetAuthService,
  invokePostAuthService,
} from "../../../utility/base/service";
import { Alert } from "../../../utility/widgets/toaster";
import { getLocalStorageData } from "../../../utility/base/localStore";
import { allowAlphabetsNumbers } from "../../../utility/base/utils/";
import { Input } from "../../../utility/widgets/input";
import CustomSwitch from "../../../container/components/switch";
import Table from "react-bootstrap/Table";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loader from "../../../utility/widgets/loader";
import _ from "lodash";

let phoneLength =
  process.env.REACT_APP_STAGE === "dev" || process.env.REACT_APP_STAGE === "int"
    ? 10
    : 9;

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

  type Props = {
    staffPopup : boolean;
    handleClosePopup : Function;
    userList: any;
    submitUpdateUser : Function;
    isLoader: boolean;
  }

  type States ={

  }

  class UserMappingPopup extends Component<Props, States> {
    tableCellIndex: any;
    loggedUserInfo: any;
    getStoreData: any;
    constructor(props: any) {
      super(props);
      this.state = {

      }
    }

    render() {
        const {staffPopup, handleClosePopup, userList, submitUpdateUser, isLoader } = this.props;
         return (
            <AUX>
                <AdminPopup
                open={staffPopup}
                onClose={handleClosePopup}
                maxWidth={"1300px"}
                >
                <DialogContent>
                {isLoader && <Loader />}
                <div className="popup-container">
                    <div className="popup-content">
                    <div className={`popup-title`}>
                        <p>
                        {_.startCase(_.toLower(userList?.whtaccountname)) || ""},{" "}
                        <label>{_.startCase(_.toLower(userList?.rolename))}</label>{" "}
                        </p>
                    </div>

                    </div>
                    <div></div>
                    <DialogActions>
                    <button
                        onClick={handleClosePopup()}
                        className="cus-btn-user reset buttonStyle"
                        style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329",borderRadius: "50px"}}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e: any) => {
                            submitUpdateUser(e);
                        }}
                        className="cus-btn-user buttonStyle"
                        style={{ boxShadow: "0px 3px 6px #c7c7c729", border: "1px solid #89D329",borderRadius: "50px"}}
                    >
                        Update
                        <span className="staffcount">
                        <img src={ArrowIcon} alt="" className="arrow-i" />{" "}
                        <img src={RtButton} alt="" className="layout" />
                        </span>
                    </button>
                    </DialogActions>
                </div>
                </DialogContent>
                </AdminPopup>
            </AUX>
        )
    }
}

export default UserMappingPopup;

