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

const UploadButton = (props: Sheet2CSVOpts) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [downloadedData, setDownloadedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isDragAndDrop, setIsDragAndDrop] = useState<boolean>(false);

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
        // let a: any = [];
        // let vals: any = response.slice(0, 75);
        // a.push(vals);
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
  };

  const cancelUpload = () => {
    setIsDragAndDrop(false);
    setSelectedFile(null);
    setFileName("");
  };

  const overrideEventDefaults = (event: any) => {
    event.preventDefault();
    setIsDragAndDrop(true);
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
      handleFileUploads(event);
    }
  };

  const onChangeHandler = (event: any) => {
    setIsDragAndDrop(false);
    let files = event.target.files;
    const theFileName = files.item(0).name;
    handleValidations(files, theFileName);
    handleFileUploads(event);
  };

  const handleValidations = (files: any, theFileName: any) => {
    let size = 5 * 1024 * 1024;
    const types = ["application/vnd.ms-excel"];
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
          //setSelectedFile(files);
          setFileName(theFileName);
        }
      }
    }
  };

  const handleFileUploads = (e: any) => {
    const file = isDragAndDrop ? e.dataTransfer.files[0] : e.target.files[0];
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
    //console.log("downloadedData", downloadedData, columns);
    if (_.isEqual(downloadedData, columns)) {
      const { uploadTemplate } = apiURL;
      const formData: any = new FormData();
      let data = selectedFile != null && formData.append("file", selectedFile);

      invokePostAuthService(uploadTemplate, formData)
        .then((response: any) => {
          console.log(response);
          setShowPopup(false);
          setTimeout(() => {
            Alert(
              "success",
              response.body.duplicate.length +
                " " +
                "- Inventory data Duplicated" +
                "\n" +
                response.body.inserted.length +
                " " +
                " -  Inventory data Uploaded"
            );
          }, 400);
          setSelectedFile(null);
        })
        .catch((error: any) => {
          let message = error.message;
          console.log("warning", message);
        });
    } else {
      Alert("warning", "Templete format mismatched. Please upload valid format");
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
                                accept=".csv"
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
