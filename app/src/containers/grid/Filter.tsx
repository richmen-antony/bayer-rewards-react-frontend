import React, { useState, useEffect } from "react";
import { SearchInput } from "../../utility/widgets/input/search-input";
import { Button, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterIcon from "../../assets/icons/filter_icon.svg";
import { CustomDownload } from "../../utility/widgets/button/download";
import ReactSelect from "../../utility/widgets/dropdown/ReactSelect";
import "../../assets/scss/filter.scss";
import Upload from "../../assets/icons/upload.svg";
interface Props {
  uploadPopup?: any;
  handleSearch: (e: any) => any;
  download?: Function;
  downloadPopup?: Boolean;
  searchText: string;
  children: any;
  partnerTypeList?: any[];
  isDownload?: boolean;
  selectedPartnerType?: any;
  handlePartnerChange?: any;
  toolTipText: string;
  internalUserTypeFilterHeading?: boolean;
  isPartnerType?: boolean;
  isPartner?: boolean;
  condType?: string;
  condTypeList?: any[];
  buttonChange?: any;
  condSelectedButton?: string;
  onClose?: any;
  isDownloadHelpText?: boolean;
  fiscalYear?: Number;
  handleReactSelect?: any;
  yearOptions?: {};
  isCustomDropdown?: Boolean;
  isScannedBy?: boolean;
  isScanType?: boolean;
  scannedByList?: any[];
  scanTypeList?: any[];
  selectedScannedBy?: string;
  selectedScanType?: string;
  viewType?: any;
  packageTypeOptions?: any;
  isUploadAvailable?: boolean;
  isInventoryDownloadPopup?: boolean;
}

/**
 *Filter Functional Component
 * @param props
 * @returns
 */
const Filter: React.FC<Props> = (props: Props) => {
  const [dropdownOpenFilter, setToggleFilter] = useState<boolean>(false);

  const toggleFilter = () => {
    setToggleFilter(!dropdownOpenFilter);
  };
  const {
    uploadPopup,
    handleSearch,
    searchText,
    download,
    children,
    partnerTypeList,
    isDownload,
    selectedPartnerType,
    handlePartnerChange,
    toolTipText,
    internalUserTypeFilterHeading = false,
    condType,
    condTypeList,
    buttonChange,
    condSelectedButton,
    onClose,
    downloadPopup,
    isDownloadHelpText,
    isPartnerType,
    isPartner,
    fiscalYear,
    handleReactSelect,
    yearOptions,
    isCustomDropdown,
    isScannedBy,
    scannedByList,
    isScanType,
    scanTypeList,
    selectedScanType,
    selectedScannedBy,
    viewType,
    packageTypeOptions,
    isUploadAvailable = false,
    isInventoryDownloadPopup,
  } = props;
  // show up the dropdown using without toggle popup filter
  const notToggleDropdown = true;

  useEffect(() => {
    onClose && onClose(toggleFilter);
  }, [dropdownOpenFilter, onClose]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="grid-filter">
      <div className="filter-left-side">
        <SearchInput
          name="searchText"
          data-testid="search-input"
          placeHolder="Search (min 3 letters)"
          type="text"
          onChange={handleSearch}
          value={searchText}
          tolltip={toolTipText}
        />
      </div>
      <div className="filter-right-side">
        {isCustomDropdown && (
          <>
            <div className="customDropdown">
              <div style={{ width: "110px" }} className="yearlabel">
                <label className="font-weight-bold yeartext">Fiscal Year</label>
              </div>
              <div style={{ width: "100%" }}>
                <ReactSelect
                  name="fiscalYear"
                  options={yearOptions}
                  handleChange={(selectedOptions: any, e: any) => {
                    handleReactSelect(selectedOptions, e);
                  }}
                  value={fiscalYear}
                  defaultValue={fiscalYear}
                  id="year-test"
                  dataTestId="year-test"
                />
              </div>
            </div>
            <div className="customDropdown">
              <div className="yearlabel">
                <label className="font-weight-bold yeartext">Type</label>
              </div>
              <div style={{ width: "105px" }}>
                <ReactSelect
                  name="viewType"
                  options={packageTypeOptions}
                  handleChange={(selectedOptions: any, e: any) => {
                    handleReactSelect(selectedOptions, e);
                  }}
                  value={viewType}
                  defaultValue={viewType}
                  id="partner-test"
                  dataTestId="partner-test"
                />
              </div>
            </div>
          </>
        )}
        {isScannedBy && (
          <ReactSelect
            name="selectedScannedBy"
            value={selectedScannedBy}
            options={scannedByList}
            handleChange={(selectedOptions: any, e: any) => handleReactSelect(selectedOptions, e, notToggleDropdown)}
            label="Scanned By"
            width="150px"
            inActiveFilter={notToggleDropdown}
          />
        )}
        {isScanType && (
          <ReactSelect
            name="selectedScanType"
            value={selectedScanType}
            options={scanTypeList}
            label="Scan Type"
            width="150px"
            inActiveFilter={notToggleDropdown}
            handleChange={(selectedOptions: any, e: any) => handleReactSelect(selectedOptions, e, notToggleDropdown)}
          />
        )}

        {isPartnerType && (
          <div className="customDropdown">
            <div className="yearlabel">
              <label className="font-weight-bold yeartext">Partner Type</label>
            </div>
            <div style={{ width: "127px" }}>
              <ReactSelect
                name="partnerType"
                options={partnerTypeList}
                handleChange={(selectedOptions: any, e: any) => {
                  handlePartnerChange(selectedOptions, e);
                }}
                value={selectedPartnerType.type}
                defaultValue={selectedPartnerType.type}
                id="year-test"
                dataTestId="year-test"
              />
            </div>
          </div>
        )}

        <div className="filter-right-side">
          {isPartner && (
            <div className="filter-partnertype">
              <label className="font-weight-bold pt-2" style={{ color: "#363636", fontSize: "12px" }}>
                {internalUserTypeFilterHeading ? "User Type" : "Partner Type"}
              </label>
              <div className="partnertype-list">
                {partnerTypeList &&
                  partnerTypeList.map((item: any, index: number) => {
                    return (
                      <span className="mr-2" key={index}>
                        <Button
                          color={
                            selectedPartnerType.type === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"
                          }
                          size="md"
                          onClick={(e: any) => handlePartnerChange(item)}
                        >
                          {item}
                        </Button>
                      </span>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
        {/* {condTypeList && condTypeList.length > 0 && (
						<div className="filter-partnertype" style={{ marginLeft: "10px" }}>
							<label className="font-weight-bold pt-2" style={{ color: "#363636", fontSize: "12px" }}>
								{condType}
							</label>
							<div className="partnertype-list">
								{condTypeList &&
									condTypeList.map((item: any, index: number) => {
										return (
											<span className="mr-2" key={index}>
												<Button
													color={condSelectedButton === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"}
													size="md"
													onClick={() =>
														buttonChange(condType === "Scan Type" ? "selectedScanType" : "selectedSalesType", item)
													}
												>
													{condType === "Scan Type" ? item : item === "WALKIN_SALES" ? "Walk-In Sales" : "Advisor Sales"}
												</Button>
											</span>
										);
									})}
							</div>
						</div>
					)} */}
        <div className="filterRow">
          <Dropdown isOpen={dropdownOpenFilter} toggle={toggleFilter}>
            <DropdownToggle>{!dropdownOpenFilter && <img src={filterIcon} width="17" alt="filter" />}</DropdownToggle>
            <DropdownMenu right>
              <div className="p-3" style={{ minWidth: "23rem" }}>
                <i className="fa fa-filter boxed float-right" aria-hidden="true" onClick={toggleFilter}></i>
                {children}
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
        {isUploadAvailable && (
          <button className="btn btn-success" onClick={uploadPopup}>
            <img src={Upload} width="17" alt="upload file" />
            <span style={{ padding: "15px" }}>Upload</span>
          </button>
        )}
        {isDownload && (
          <CustomDownload
            download={download}
            downloadPopup={downloadPopup}
            isHelpText={isDownloadHelpText}
            isInventoryDownloadPopup={isInventoryDownloadPopup}
          />
        )}
      </div>
    </div>
  );
};

export default Filter;
