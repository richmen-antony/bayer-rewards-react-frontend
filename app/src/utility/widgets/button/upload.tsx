import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import * as XLSX from "xlsx";
import { Theme, withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Upload from "../../../assets/icons/upload.svg";
import uploadIcon from "../../../assets/icons/upload_cloud.png";
import SimpleDialog from "../../../containers/components/dialog";
import CalenderIcon from "../../../assets/icons/calendar.svg";
import Cancel from "../../../assets/images/cancel.svg";
import "../../../assets/scss/upload.scss";
import { Alert } from "../../../utility/widgets/toaster";
import { CustomButton } from ".";
import {
  invokeGetAuthService,
  invokePostAuthService,
} from "../../base/service";
import { getLocalStorageData } from "../../base/localStore";
import { apiURL } from "../../base/utils/config";
import _ from "lodash";
import { DateNFOption } from "xlsx";
import { Button } from "@material-ui/core";
import AdminPopup from "../../../containers/components/dialog/AdminPopup";

interface Sheet2CSVOpts {
  header?: any;
}

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

let obj: any = getLocalStorageData("userData");
let userData = JSON.parse(obj);

const UploadButton = (props: Sheet2CSVOpts) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [dataValidated, setDataValidated] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [downloadedData, setDownloadedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showUploadedMessageBox, setShowUploadedMessageBox] =
    useState<boolean>(false);
  const [totalDuplicateRecords, setTotalDuplicateRecords] = useState<number>(0);
  const [totalRecordsInserted, setTotalRecordsInserted] = useState<number>(0);

  const uploadPopup = () => {
    setShowPopup(true);
    let obj: any = getLocalStorageData("userData");
    let userData = JSON.parse(obj);
    const { downloadTemplate } = apiURL;
    let data = {
      countrycode: userData?.countrycode,
    };
    invokeGetAuthService(downloadTemplate, data)
      .then((response) => {
        const text =
          '["countrycode","rtmpartnerid","rtmrolename","materialid","openinginventory"]';
        const myArr = JSON.parse(text);

        setDownloadedData(myArr);
      })
      .catch((error) => {
        console.log("Error message", error.message);
      });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFile(null);
    setDataValidated(false);
    setFileName("");
    setDownloadedData([]);
    setColumns([]);
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setFileName("");
    setDataValidated(false);
    setColumns([]);
  };

  const overrideEventDefaults = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragAndDropFiles = (event: any) => {
    overrideEventDefaults(event);
    if (!event.dataTransfer) return;
    let files = event.dataTransfer.files[0];
    const theFileName = files.name;
    if (files.length > 1) {
      Alert("warning", "Select only one file");
    } else {
      handleValidations(files, theFileName);
    }
  };

  const onChangeHandler = (event: any) => {
    let files = event.target.files[0];
    let theFileName = files.name;
    handleValidations(files, theFileName);
  };

  const handleValidations = (files: any, theFileName: any) => {
    let size = 5 * 1024 * 1024;
    let supportedDataFormat = /(.*?)\.(csv)$/;
    if (!files.name.match(supportedDataFormat)) {
      setDataValidated(false);
      Alert("warning", "Format not supported");
    } else {
      if (files.size > size) {
        setDataValidated(false);
        Alert("warning", "Please pick a file size less than 5MB");
      } else {
        //setSelectedFile(files);
        setDataValidated(true);
        setFileName(theFileName);
        handleFileUploads(files);
      }
    }
  };

  const handleFileUploads = (file: any) => {
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const { header } = props;
      const data = XLSX.utils.sheet_to_csv(ws, header);
      processDatas(data);
    };
    reader.readAsBinaryString(file);
    setSelectedFile(file);
  };

  const processDatas = (dataString: any) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    // prepare columns list from headers
    const columns = headers.map((c: any) => ({
      name: c,
      selector: c,
    }));

    let uploadedColumnNameArray: any = [];
    columns.forEach((c: any) => {
      uploadedColumnNameArray.push(Object.values(c)[0]);
    });

    setColumns(uploadedColumnNameArray);
  };

  const finalUploadData = () => {
    if (fileName === "") {
      Alert("error", "Browse a file");
    } else {
      if (_.isEqual(downloadedData, columns)) {
        const { uploadTemplate } = apiURL;
        const formData: any = new FormData();
        selectedFile != null && formData.append("file", selectedFile);
        let data: any = {
          geolevel1: userData?.geolevel1,
          rolename: "DISTRIBUTOR",
        };
        invokePostAuthService(uploadTemplate, data, formData)
          .then((response: any) => {
            console.log(response);
            setShowPopup(false);
            setShowUploadedMessageBox(true);
            setTotalDuplicateRecords(response.body.duplicate.length);
            setTotalRecordsInserted(response.body.inserted.length);

            setSelectedFile(null);
          })
          .catch((error: any) => {
            let message = error.message;
            console.log("warning", message);
          });
      } else {
        Alert(
          "warning",
          "Templete format mismatched. Please upload valid format"
        );
      }
    }
  };

  const handleCloseMessagePopup = () => {
    setShowUploadedMessageBox(false);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <>
      <div>
        {showUploadedMessageBox && (
          <AdminPopup
            open={true}
            onClose={handleCloseMessagePopup}
            maxWidth={"600px"}
          >
            <DialogContent>
              <div className="popup-container">
                <div className="popup-content">
                  <div className={`popup-title`}></div>
                </div>
                <div
                  style={{
                    textAlign: "left",
                    margin: "5px 144px",
                    lineHeight: "3",
                  }}
                >
                  <h3 style={{ textAlign: "center" }}>Upload History</h3>
                  <label style={{ fontSize: "16px", marginTop: "11px" }}>
                    Total number of data inserted&nbsp;&nbsp;-&nbsp;
                    {totalRecordsInserted} <br />
                    Total number of data already exists&nbsp;&nbsp;-&nbsp;
                    {totalDuplicateRecords}
                  </label>
                </div>
                <DialogActions>
                  <Button
                    autoFocus
                    onClick={handleCloseMessagePopup}
                    className="admin-popup-btn close-btn"
                    style={{
                      boxShadow: "0px 3px 6px #c7c7c729",
                      border: "1px solid #89D329",
                      borderRadius: "50px",
                    }}
                  >
                    OK
                  </Button>
                </DialogActions>
              </div>
            </DialogContent>
          </AdminPopup>
        )}

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
                    <p>Files Supported CSV</p>
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
                        {selectedFile === null ||
                        (selectedFile != null && !dataValidated) ? (
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
                                accept=".csv"
                                onChange={onChangeHandler}
                              />
                            </div>
                          </div>
                        ) : (
                          dataValidated &&
                          selectedFile != null && (
                            <div
                              className="browse"
                              style={{
                                height: "185px",
                                justifyContent: "center",
                              }}
                            >
                              <div class="selected-file-name">
                                <strong>
                                  <h3 className="selected-file">{fileName}</h3>
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
                          )
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
                handleClick={(e: any) => {
                  e.preventDefault();
                  finalUploadData();
                }}
              />
            </DialogActions>
          </SimpleDialog>
        )}

        <button className="btn btn-success" onClick={uploadPopup}>
          <img src={Upload} width="17" alt="upload file" />
          <span style={{ padding: "15px" }}>Upload</span>
        </button>
      </div>
    </>
  );
};

export default UploadButton;
