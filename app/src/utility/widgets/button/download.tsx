import React, {Fragment, useState} from "react";
import Download from "../../../assets/icons/download.svg";
import NoImage from "../../../assets/images/Group_4736.svg";
import {Dropdown, DropdownToggle, DropdownMenu} from "reactstrap";
import "../../../assets/scss/download.scss";
import {FormattedMessage} from "react-intl";

interface downloadProps {
  download: any;
  downloadPopup?: Boolean;
  isHelpText?: boolean;
  isInventoryDownloadPopup?: Boolean;
}

function CustomDownload(props: downloadProps) {
  const {download, downloadPopup, isHelpText, isInventoryDownloadPopup} = props;
  const [dropdownOpenDownload, settoggleDownload] = useState<boolean>(false);

  const toggleDownload = () => {
    settoggleDownload(!dropdownOpenDownload);
  };
  return (
    <Fragment>
      {!downloadPopup ? (
        <div>
          <button
            className="btn btn-primary"
            onClick={download}
            style={{
              backgroundColor: "#1f445a",
              borderColor: "#1f445a",
            }}
          >
            <img src={Download} width="17" alt={NoImage} />
            <span style={{padding: "15px"}}>
              <FormattedMessage id="download.download" />
            </span>
          </button>
        </div>
      ) : (
        <div className="downloadDropdown">
          <Dropdown isOpen={dropdownOpenDownload} toggle={toggleDownload}>
            <DropdownToggle>
              {
                <button
                  className="btn btn-primary"
                  onClick={(e: any) => (downloadPopup ? download : e.preventDefault())}
                  style={{
                    backgroundColor: "#1f445a",
                    borderColor: "#1f445a",
                  }}
                >
                  <img src={Download} width="17" alt={NoImage} />
                  <span style={{padding: "15px"}}>
                    <FormattedMessage id="download.download" />
                    <i className={`fas ${dropdownOpenDownload ? "fa-sort-up" : "fa-sort-down"} ml-3`}></i>
                  </span>
                </button>
              }
            </DropdownToggle>
            <DropdownMenu right>
              <div className="p-3 dropdownMenu">
                {!isInventoryDownloadPopup ? (
                  <div>
                    <div className="contents" onClick={() => download("overall")}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      <span className="dropdownContent">
                        <FormattedMessage id="download.overallScans" />
                      </span>
                    </div>
                    <hr />
                    <div className="contents" onClick={() => download("brand")}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      <span className="dropdownContent">
                        <FormattedMessage id="download.brandWiseScans" />
                      </span>
                    </div>
                    <hr />
                    <div className="contents" onClick={() => download("product")}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      <span className="dropdownContent">
                        <FormattedMessage id="download.productWiseScans" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="contents" onClick={() => download("overall")}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      <span className="dropdownContent">
                        <FormattedMessage id="download.overallInventory" />
                      </span>
                    </div>
                    <hr />
                    <div className="contents" onClick={() => download("brand")}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      <span className="dropdownContent">
                        <FormattedMessage id="download.brandWiseInventory" />
                      </span>
                    </div>
                    <hr />
                    <div className="contents" onClick={() => download("product")}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      <span className="dropdownContent">
                        <FormattedMessage id="download.productWiseInventory" />
                      </span>
                    </div>

                    <hr />
                    <div className="contents" onClick={() => download("template")}>
                      <i class="fa fa-download" aria-hidden="true"></i>
                      <span className="dropdownContent">
                        <FormattedMessage id="download.downloadTemplate" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
      {isHelpText && (
        <i
          className="fa fa-info-circle"
          style={{
            fontSize: "16px",
            fontFamily: "appRegular !important",
            marginLeft: "5px",
            marginTop: "-20px",
          }}
          title={"Full extract"}
        ></i>
      )}
    </Fragment>
  );
}
export {CustomDownload};
