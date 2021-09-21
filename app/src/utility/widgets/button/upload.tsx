import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Theme, withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Download from "../../../assets/icons/upload.svg";
import uploadIcon from "../../../assets/icons/upload_cloud.png";
import SimpleDialog from "../../../containers/components/dialog";
import CalenderIcon from "../../../assets/icons/calendar.svg";
import Cancel from "../../../assets/images/cancel.svg";
import "../../../assets/scss/upload.scss";
import { Alert } from "../../../utility/widgets/toaster";
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
          width: "37px",
          height: "31px",
          outline: "none",
        }}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        id={id}
        onClick={onClick}
        ref={ref}
        disabled={true}
      />
    </div>
  )
);

const UploadButton = (Props: any) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const uploadPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setFileName("");
  };

  const overrideEventDefaults = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragAndDropFiles = (event: any) => {
    overrideEventDefaults(event);
    if (!event.dataTransfer) return;
    let files = event.dataTransfer.files;
    const theFileName = files.item(0).name;
    if (files.length > 1) {
      Alert("warning", "Select only one file");
    } else {
      handleValidations(files, theFileName);
    }
  };

  const onChangeHandler = (event: any) => {
    let files = event.target.files;
    const theFileName = files.item(0).name;
    handleValidations(files, theFileName);
  };

  const handleValidations = (files: any, theFileName: any) => {
    let size = 5 * 1024 * 1024;
    const types = ["application/vnd.ms-excel", ".xls", ".xlsx"];
    let err = "";
    for (var x = 0; x < files.length; x++) {
      if (types.every((type) => files[x].type !== type)) {
        Alert("warning", (err += files[x].type + " is not a supported format"));
      } else {
        if (files[x].size > size) {
          Alert(
            "warning",
            (err += files[x].type + "is too large, please pick a smaller file")
          );
        } else {
          setSelectedFile(files);
          setFileName(theFileName);
        }
      }
    }
  };

  return (
    <>
      <div>
        {showPopup && (
          <SimpleDialog
            open={showPopup}
            onClose={handleClosePopup}
            header={"Upload Inventory Files"}
            maxWidth={"685px"}
          >
            <DialogContent>
              <div className="popup-container" style={{ height: "355px" }}>
                <div className="popup-content">
                  <div>
                    <p className="upload-heading">Upload Inventory Files</p>
                  </div>
                  <div className="file-size-and-length">
                    <p>Files Supported XSLS, CSV</p>
                    <p>Max upload size: 5 MB</p>
                  </div>
                  <div
                    id="dragAndDropContainer"
                    className="dragAndDropContainer"
                    onDrop={overrideEventDefaults}
                    onDragEnter={overrideEventDefaults}
                    onDragLeave={overrideEventDefaults}
                    onDragOver={overrideEventDefaults}
                  >
                    <div
                      id="dragAndDropArea"
                      className="dragAndDropArea"
                      onDrop={handleDragAndDropFiles}
                      onDragEnter={overrideEventDefaults}
                      onDragLeave={overrideEventDefaults}
                      onDragOver={overrideEventDefaults}
                    >
                      <div className="browse-content">
                        {selectedFile === null ? (
                          <div className="browse">
                            <img
                              className="upload-cloud-image"
                              src={uploadIcon}
                              alt="upload cloud icon"
                            />
                            <div>Drag and drop your file here</div>
                            <span>or</span>
                            <div className="selectFile">
                              <label htmlFor="file">Browse</label>
                              <input
                                type="file"
                                name="file"
                                id="file"
                                className="input-file"
                                //  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={onChangeHandler}
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            className="browse"
                            style={{
                              height: "185px",
                              justifyContent: "center",
                            }}
                          >
                            <div class="selected-file-name">
                              <strong>
                                <h3>{fileName}</h3>
                              </strong>
                              &nbsp;&nbsp;
                              <img
                                className="cancel-uploaded-file"
                                src={Cancel}
                                alt="upload cloud icon"
                                title="remove file"
                                onClick={cancelUpload}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="updated-year">
                    <p>Updated Year</p>
                    <DatePicker
                      id="update-date"
                      disabled={true}
                      selected={startDate}
                      value={startDate}
                      dateFormat="yyyy"
                      customInput={<DateInput ref={ref} />}
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
                //	handleClick={}
              />
            </DialogActions>
          </SimpleDialog>
        )}

        <button className="btn btn-success" onClick={uploadPopup}>
          <img src={Download} width="17" alt="upload file" />
          <span style={{ padding: "15px" }}>Upload</span>
        </button>
      </div>
    </>
  );
};

export default UploadButton;
