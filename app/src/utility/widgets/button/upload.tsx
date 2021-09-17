import React, { Fragment, useState } from "react";
import Download from "../../../assets/icons/upload.svg";
import "../../../assets/scss/download.scss";
import { Theme, withStyles } from "@material-ui/core/styles";
import SimpleDialog from "../../../containers/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CalenderIcon from "../../../assets/icons/calendar.svg";
import "../../../assets/scss/upload.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomButton } from ".";

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
interface IProps {
  onChange?: any;
  placeholder?: any;
  value?: any;
  id?: any;
  onClick?: any;
}
const ref = React.createRef();
const DateInput = React.forwardRef(
  ({ onChange, placeholder, value, id, onClick }: IProps, ref: any) => (
    <div style={{ border: "1px solid grey", borderRadius: "4px" }}>
      <img src={CalenderIcon} style={{ padding: "2px 5px" }} alt="Calendar" />
      <input
        style={{
          border: "none",
          width: "60px",
          height: "31px",
          outline: "none",
        }}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        id={id}
        onClick={onClick}
        ref={ref}
      />
    </div>
  )
);

const UploadButton = (Props: any) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const upload = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const onChangeHandler = (event: any) => {
    let files = event.target.files;
    let size = 1280;
    const types = ["image/png", "image/jpeg", "image/gif"];
    let err = "";
    for (var x = 0; x < files.length; x++) {
      if (types.every((type) => files[x].type !== type)) {
        alert((err += files[x].type + " is not a supported format\n"));
      }
      if (files[x].size > size) {
        alert(
          (err += files[x].type + "is too large, please pick a smaller file\n")
        );
      }
    }
    // if (err !== "") {
    //   event.target.value = null;
    //   console.log(err);
    //   return false;
    // }
    // return true;
  };
  return (
    <>
      <div>
        {showPopup && (
          <SimpleDialog
            open={showPopup}
            onClose={handleClosePopup}
            header={"Upload Inventory Files"}
            maxWidth={"800px"}
          >
            <DialogContent>
              <div
                className="popup-container popup-partner"
                style={{ height: "355px" }}
              >
                <div className="popup-content">
                  <div className={`popup-title`}>
                    <p className="upload-heading">Upload Inventory Files</p>
                  </div>
                  <div className="sub-topics">
                    <p>Files Supported XSLS, CSV</p>
                    <p>Max upload size: 5 MB</p>
                  </div>
                  <div className="popup-content-row">
                    <div className="zone">
                      <div id="dropZ">
                        <i className="fa fa-cloud-upload"></i>
                        <div className="popup-content">
                          Drag and drop your file here
                        </div>
                        <span>or</span>
                        <div className="selectFile">
                          <label htmlFor="file">Browse</label>
                          <input
                            type="file"
                            name="file"
                            id="file"
                            accept=".csv"
                            onChange={onChangeHandler}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sub-topicss">
                    <p>Updated Year</p>

                    <DatePicker
                      id="update-date"
                      //value={selectedFilters.lastmodifieddatefrom}
                      dateFormat="yyyy"
                      customInput={<DateInput ref={ref} />}
                      // selected={selectedFilters.lastmodifieddatefrom}
                      // onChange={(date: any) =>
                      //   this.handleDateChange(date, "lastmodifieddatefrom")
                      // }
                      showYearPicker
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>

            <DialogActions>
              <CustomButton
                label="Upload File"
                style={{
                  borderRadius: "30px",
                  backgroundColor: "#7eb343",
                  width: "190px",
                  padding: "7px",
                  border: "1px solid  #7eb343",
                }}
                //	handleClick={() => this.filterScans(retailerPopupData.username)}
              />
            </DialogActions>
          </SimpleDialog>
        )}

        <button className="btn btn-success" onClick={upload}>
          <img src={Download} width="17" alt="upload file" />
          <span style={{ padding: "15px" }}>Upload</span>
        </button>
      </div>
    </>
  );
};

export default UploadButton;
