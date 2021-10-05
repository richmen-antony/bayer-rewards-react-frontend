/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";
import AUX from "../../hoc/Aux_";
import Filter from "../../containers/grid/Filter";
import OverallInventory from "./OverallInventory";
import BrandwiseInventory from "./BrandwiseInventory";
import ProductwiseInventory from "./ProductwiseInventory";
import { Button } from "reactstrap";
import { sortBy } from "../../utility/base/utils/tableSort";
import { Alert } from "../../utility/widgets/toaster";
import Loader from "../../utility/widgets/loader";
import { getLocalStorageData } from "../../utility/base/localStore";
import CalenderIcon from "../../assets/icons/calendar.svg";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import {
  getGeographicLevel1Options,
  getGeoLocationFields,
  setGeolevel1Options,
  downloadFile,
} from "../../redux/actions/common/common";
import {
  getOverallInventory,
  getBrandwiseInventory,
  getProductwiseInventory,
  setBrandwiseInventory,
  setProductwiseInventory,
  setOverallInventory,
} from "../../redux/actions/inventory/inventory";
import ReactSelect from "../../utility/widgets/dropdown/ReactSelect";
import * as myConstClass from "../../utility/constant";
import { apiURL } from "../../utility/base/utils/config";
import { invokeGetAuthService, invokePostAuthService, invokePostFileAuthService } from "../../utility/base/service";
import * as XLSX from "xlsx";
import { Theme, withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import uploadIcon from "../../assets/icons/upload_cloud.png";
import SimpleDialog from "../../containers/components/dialog";
import Cancel from "../../assets/images/cancel.svg";
import "../../assets/scss/upload.scss";
import AdminPopup from "../../containers/components/dialog/AdminPopup";
import { CustomButton } from "../../utility/widgets/button";

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
  className?: any;
  disabled?: boolean;
}
const ref = React.createRef();
const DateInput = React.forwardRef(
  ({ onChange, placeholder, value, id, onClick, className, disabled }: IProps, ref: any) => (
    <div style={{ border: "1px solid grey", borderRadius: "4px" }}>
      <img src={CalenderIcon} style={{ padding: "2px 5px" }} alt="Calendar" />
      <input
        style={{
          border: "none",
          width: "120px",
          height: "31px",
          outline: "none",
        }}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        id={id}
        onClick={onClick}
        ref={ref}
        className={className}
        disabled={disabled}
      />
    </div>
  )
);

let obj: any = getLocalStorageData("userData");
let userData = JSON.parse(obj);

const Inventory = (Props: Sheet2CSVOpts) => {
  let package_type = myConstClass.package_type;
  let closeToggle: any;
  const dispatch = useDispatch();
  const geolevel1List = useSelector(({ common }: any) => common?.geoLevel1List);
  const geographicFields = useSelector(({ common }: any) => common?.geographicFields);
  const levelsName = useSelector(({ common }: any) => common?.levelsName);
  const commonErrorMessage = useSelector(({ common }: any) => common?.errorMessage);
  const allConsolidatedInventory = useSelector(({ inventory }: any) => inventory?.allConsolidatedInventory);
  const BrandwiseInventories = useSelector(({ inventory }: any) => inventory?.BrandwiseInventory);
  const ProductwiseInventories = useSelector(({ inventory }: any) => inventory?.ProductwiseInventory);
  const isReduxLoader = useSelector(({ inventory }: any) => inventory?.isLoader);
  // const errorMessage         = useSelector(({consolidatedScans}:any) => consolidatedScans?.errorMessage);

  const [searchText, setSearchText] = useState<string>("");
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [dateErrMsg, setDateErrMsg] = useState<string>("");
  const [partnerTypeList, setpartnerTypeList] = useState(["Retailers", "Distributors"]);
  const [partnerType, setPartnerType] = useState({ type: "Distributors" });
  const [selectedDistributorName, setselectedDistributorName] = useState("");
  const [selectedBrandName, setselectedBrandName] = useState("");
  const [selectedDistributor, setselectedDistributor] = useState(0);
  const [selectedBrand, setselectedBrand] = useState(0);
  const [countryList, setcountryList] = useState([{}]);
  const [dynamicFields, setdynamicFields] = useState([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(true);
  const [overalltableIndex, setoveralltableIndex] = useState<number>(0);
  const [brandtableIndex, setbrandtableIndex] = useState<number>(0);
  const [producttableIndex, setproducttableIndex] = useState<number>(0);
  const [isAsc, setIsAsc] = useState<boolean>(true);
  const [soldbyid, setSoldbyid] = useState("");
  const [filterAppliedTime, setFilterAppliedTime] = useState(Number);
  const [uploadAppliedTime, setUploadAppliedTime] = useState<number>();
  const [overallScanSuccess, setOverallScanSuccess] = useState(Number);
  const [scannedBrandsSuccess, setScannedBrandsSuccess] = useState(Number);
  const [filterSuccess, setFilterSuccess] = useState(Number);
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState(package_type[0]);

  const [selectedFilters, setSelectedFilters] = useState({
    productgroup: "ALL",
    geolevel1: "ALL",
    geolevel2: "ALL",
    lastmodifieddatefrom: new Date(new Date().getFullYear(), 0, 1),
    lastmodifieddateto: fiscalYear === new Date().getFullYear() ? new Date() : new Date(new Date().getFullYear(), 11, 31),
    fromdate: new Date(new Date().getFullYear(), 0, 1),
    todate: fiscalYear === new Date().getFullYear() ? new Date() : new Date(new Date().getFullYear(), 11, 31),
    scannedPeriod: "All Months",
  });

  const [scannedPeriodsList, setscannedPeriodsList] = useState([
    {
      label: "All Months",
      from: moment(selectedFilters.lastmodifieddatefrom).format("YYYY-MM-DD"),
      to: moment(selectedFilters.lastmodifieddateto).format("YYYY-MM-DD"),
    },
    { label: "Custom", value: "" },
  ]);

  const [selectedFromDateOfYear, setSelectedFromDateOfYear] = useState(`01/01/${new Date().getFullYear()}`);
  const [selectedToDateOfYear, setSelectedToDateOfYear] = useState(`12/31/${new Date().getFullYear()}`);

  const [productCategories, setproductCategories] = useState([
    "ALL",
    "CORN SEED",
    "HERBICIDES",
    "FUNGICIDES",
    "INSECTICIDES",
  ]);
  const [retailerPopupData, setretailerPopupData] = useState({});

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [dataValidated, setDataValidated] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [downloadedData, setDownloadedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showUploadedMessageBox, setShowUploadedMessageBox] = useState<boolean>(false);
  const [totalDuplicateRecords, setTotalDuplicateRecords] = useState<number>(0);
  const [totalRecordsInserted, setTotalRecordsInserted] = useState<number>(0);
  const [totalInvalidRecords, setTotalInvalidRecords] = useState<number>(0);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  let i = 2018;
  let year = [];
  for (i === 2018; i <= new Date().getFullYear(); i++) {
    let yearObj = { label: i, value: i };
    year.push(yearObj);
  }
  year.reverse();

  let packType: any = [];
  package_type.forEach((type: string) => {
    let packageObj = { label: type, value: type };
    packType.push(packageObj);
  });

  useEffect(() => {
    if (commonErrorMessage) {
      Alert("warning", commonErrorMessage);
    }
  }, [commonErrorMessage]);

  useEffect(() => {
    getCountryList();
    dispatch(getGeoLocationFields());
    let data = {
      countrycode: userData?.countrycode,
      geolevel1: userData?.geolevel1,
      partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
      isfiltered: true,
      viewtype: viewType === "Cost(Mk)" ? "COST" : viewType.toUpperCase(),
    };
    let filteredDatas = {};
    if (isFiltered) {
      filteredDatas = getFilteredDatas(filteredDatas);
      data = { ...data, ...filteredDatas };
    }

    dispatch(getOverallInventory(data));
  }, []);

  useEffect(() => {
    setOverallScanSuccess(new Date().getTime());
  }, [allConsolidatedInventory]);

  useEffect(() => {
    let id = allConsolidatedInventory && allConsolidatedInventory[0]?.rtmppartnerid;
    let name =
      allConsolidatedInventory && allConsolidatedInventory[0]?.firstname + " " + allConsolidatedInventory[0]?.lastname;
    setSoldbyid(id);
    if (name) {
      setselectedDistributorName(name);
    }
    setFilterSuccess(new Date().getTime());
  }, [overallScanSuccess]);

  useEffect(() => {
    if (soldbyid) {
      let data = {
        partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
        viewtype: viewType === "Cost(Mk)" ? "COST" : viewType.toUpperCase(),
      };
      let filteredDatas = {};
      if (isFiltered) {
        filteredDatas = getFilteredDatas(filteredDatas);
      }
      dispatch(getBrandwiseInventory(soldbyid, isFiltered, filteredDatas, data));
    } else {
      dispatch(setBrandwiseInventory([]));
      dispatch(setProductwiseInventory([]));
      setselectedDistributorName("");
    }
  }, [filterSuccess]);

  useEffect(() => {
    if (BrandwiseInventories?.length > 0) {
      setselectedBrandName(BrandwiseInventories && BrandwiseInventories[0]?.productbrand);
      setScannedBrandsSuccess(new Date().getTime());
    }
  }, [BrandwiseInventories]);

  useEffect(() => {
    let data = {
      partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
      viewtype: viewType === "Cost(Mk)" ? "COST" : viewType.toUpperCase(),
    };
    let filteredDatas = {};
    if (isFiltered) {
      filteredDatas = getFilteredDatas(filteredDatas);
    }
    dispatch(getProductwiseInventory(soldbyid, isFiltered, selectedBrandName, filteredDatas, data));
  }, [scannedBrandsSuccess]);

  useEffect(() => {
    if (searchText.length >= 3 || searchText.length === 0) {
      let data = {
        countrycode: userData?.countrycode,
        geolevel1: userData?.geolevel1,
        partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
        isfiltered: true,
        searchtext: searchText,
        viewtype: viewType === "Cost(Mk)" ? "COST" : viewType.toUpperCase(),
      };
      let filteredDatas = {};
      if (isFiltered) {
        filteredDatas = getFilteredDatas(filteredDatas);
        data = { ...data, ...filteredDatas };
      }
      dispatch(getOverallInventory(data));
    }
  }, [searchText, partnerType, filterAppliedTime, fiscalYear, viewType, uploadAppliedTime]);

  const getSelectedBrands = (soldbyidd: string, idx?: any, type?: string, productbrand?: any) => {
    setSoldbyid(soldbyidd);
    if (type === "selected") {
      setselectedDistributor(idx);
      setselectedBrand(0);
    }
    allConsolidatedInventory?.forEach((item: any, index: number) => {
      if (item.username === soldbyidd) {
        setselectedDistributorName(item.firstname + " " + item.lastname);
      }
    });
    setselectedBrandName(productbrand);
    setFilterSuccess(new Date().getTime());
  };

  const getSelectedProducts = (soldby: string, productbrand: string, idx: number) => {
    let data = {
      partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
      viewtype: viewType === "Cost(Mk)" ? "COST" : viewType.toUpperCase(),
    };
    let filteredDatas = {};
    if (isFiltered) {
      filteredDatas = getFilteredDatas(filteredDatas);
    }
    dispatch(getProductwiseInventory(soldby, isFiltered, productbrand, filteredDatas, data));
    setselectedBrand(idx);
    BrandwiseInventories?.forEach((item: any, index: number) => {
      if (item.productbrand === productbrand && item.rtmppartnerid === soldbyid) {
        setselectedBrandName(item.productbrand);
      }
    });
  };
  const getFilteredDatas = (filteredDatas: {}) => {
    let { fromdate, todate, productgroup, geolevel2, scannedPeriod, lastmodifieddatefrom, lastmodifieddateto }: any =
      selectedFilters;
    let startDate = scannedPeriod === "Custom" ? lastmodifieddatefrom : scannedPeriod === "" ? null : fromdate;
    let endDate = scannedPeriod === "Custom" ? lastmodifieddateto : scannedPeriod === "" ? null : todate;
    filteredDatas = {
      fromdate: startDate ? moment(startDate).format("YYYY-MM-DD") : null,
      todate: endDate ? moment(endDate).format("YYYY-MM-DD") : null,
      productgroup: productgroup === "ALL" ? null : productgroup,
      geolevel1: userData?.geolevel1,
      geolevel2: geolevel2 === "ALL" ? null : geolevel2,
      scannedPeriod: scannedPeriod,
    };

    return filteredDatas;
  };

  const getCountryList = () => {
    let res = [
      { value: "India", text: "India" },
      { value: "Malawi", text: "Malawi" },
    ];
    setcountryList(res);
  };

  useEffect(() => {
    dispatch(getGeographicLevel1Options());
  }, [geographicFields]);

  useEffect(() => {
    getDynamicOptionFields();
  }, [geolevel1List]);

  const getDynamicOptionFields = (reset?: string) => {
    let level1List: any = geolevel1List;
    if (!reset) {
      let allItem = { code: "ALL", name: "ALL", geolevel2: [] };
      level1List?.unshift(allItem);
    }
    dispatch(setGeolevel1Options(level1List));
    let level1Options: any = [];
    geolevel1List?.forEach((item: any) => {
      let level1Info = { label: item.name, code: item.code, value: item.name };
      level1Options.push(level1Info);
    });
    let setFormArray: any = [];
    let localObj: any = getLocalStorageData("userData");
    let userData = JSON.parse(localObj);

    let userrole = userData?.role;
    let level2Options: any = [];
    if (userrole === "RSM") {
      let filteredLevel1: any = geolevel1List?.filter((list: any) => list.name === userData?.geolevel1);
      filteredLevel1 &&
        filteredLevel1[0]?.geolevel2?.forEach((item: any) => {
          let level2Info = {
            label: item.name,
            value: item.name,
            code: item.code,
          };
          level2Options.push(level2Info);
        });
      let geolevel2Obj = {
        label: "ALL",
        value: "ALL",
        code: "ALL",
      };
      level2Options.unshift(geolevel2Obj);
    } else {
      let level1Info = { label: "ALL", value: "ALL" };
      level2Options.push(level1Info);
    }
    let usergeolevel1 = userData?.geolevel1;
    geographicFields?.forEach((list: any, i: number) => {
      setFormArray.push({
        name: list,
        placeHolder: true,
        value: list === "geolevel1" && userrole === "RSM" ? usergeolevel1 : "All",
        options:
          list === "geolevel0"
            ? countryList
            : list === "geolevel1"
            ? level1Options
            : list === "geolevel2"
            ? level2Options
            : [{ label: "ALL", value: "ALL" }],
        error: "",
      });
    });
    setdynamicFields(setFormArray);
  };

  const getOptionLists = (cron: any, type: any, value: any, index: any) => {
    let dynamicFieldVal: any = dynamicFields;
    if (type === "geolevel1") {
      let filteredLevel1: any = geolevel1List?.filter((level1: any) => level1.name === value);
      let level2Options: any = [];
      filteredLevel1[0]?.geolevel2.forEach((item: any) => {
        let level1Info = {
          label: item.name,
          value: item.name,
          code: item.code,
        };
        level2Options.push(level1Info);
      });
      let geolevel1Obj = {
        label: "ALL",
        value: "ALL",
        code: "ALL",
      };
      let geolevel3Obj = [{ label: "ALL", code: "ALL", name: "ALL", value: "ALL" }];
      level2Options.unshift(geolevel1Obj);
      dynamicFieldVal[index + 1].options = level2Options;
      dynamicFieldVal[index + 2].options = geolevel3Obj;
      dynamicFieldVal[index].value = value;
      dynamicFieldVal[index + 1].value = "ALL";
      dynamicFieldVal[index + 2].value = "ALL";
      setdynamicFields(dynamicFieldVal);
      setSelectedFilters({ ...selectedFilters, geolevel2: "ALL" });
    } else if (type === "geolevel2") {
      dynamicFieldVal[index].value = value;
      setdynamicFields(dynamicFieldVal);
    }
  };

  const handleSearch = (e: any) => {
    let searchText = e.target.value;
    setSearchText(searchText);
    let timeOut: any;
    if (timeOut) {
      clearTimeout(timeOut);
    }
    setIsFiltered(true);
  };

  const download = (type: string) => {
    let data = {
      countrycode: userData?.countrycode,
      geolevel1: userData?.geolevel1,
      partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
      downloadtype: type,
      searchtext: searchText || null,
      isfiltered: isFiltered,
      viewtype: viewType === "Cost(Mk)" ? "COST" : viewType.toUpperCase(),
    };
    let filteredDatas = {};
    if (isFiltered) {
      filteredDatas = getFilteredDatas(filteredDatas);
    }
    data = { ...data, ...filteredDatas };
    if (type === "overall") {
      type = "Overall_Invt";
    } else if (type === "brand") {
      type = "BrandWise_Invt";
    } else if (type === "product") {
      type = "ProductWise_Invt";
    } else if (type === "template") {
      type = "Download_Template";
    }
    if (type === "Download_Template") {
      let templateData = { countrycode: userData?.countrycode };
      dispatch(downloadFile(templateData, type, "template"));
    } else {
      dispatch(downloadFile(data, type, "inventory"));
    }
  };

  const handlePartnerChange = (name: string) => {
    setPartnerType({
      type: name,
    });
    setselectedDistributor(0);
    setselectedBrand(0);
  };

  const handleFilterChange = (e: any, name: string, item: any, itemList?: any) => {
    e.stopPropagation();
    let val: any = selectedFilters;
    let flag = false;
    if (name === "type") {
      val[name] = e.target.value;
      flag = true;
    } else if (name === "scannedPeriod" && item !== "Custom") {
      val["fromdate"] = new Date(fiscalYear, 0, 1);
      val["todate"] = new Date(fiscalYear, 11, 31);
      val[name] = item;
      flag = true;
    } else {
      val[name] = item;

      flag = true;
    }
    if (flag) {
      setSelectedFilters((prevState) => ({
        ...selectedFilters,
        val,
      }));
    }
  };

  const handleReactSelect = (selectedOption: any, e: any, optionName?: string) => {
    setDateErrMsg("");
    setIsFiltered(true);
    if (e.name === "fiscalYear") {
      setFiscalYear(selectedOption.value);
      setSelectedFromDateOfYear(`01/01/${selectedOption.value}`);
      setSelectedToDateOfYear(
        fiscalYear === new Date().getFullYear() ? moment(new Date()).format("DD/MM/YYYY") : `12/31/${selectedOption.value}`
      );
      let fiscalStartDate = new Date(selectedOption.value, 0, 1);
      let fiscalEndDate =
        selectedOption.value === new Date().getFullYear() ? new Date() : new Date(selectedOption.value, 11, 31);
      setSelectedFilters({
        ...selectedFilters,
        lastmodifieddatefrom: fiscalStartDate,
        lastmodifieddateto: fiscalEndDate,
        fromdate: fiscalStartDate,
        todate: fiscalEndDate,
      });
    } else if (e.name === "viewType") {
      setViewType(selectedOption.value);
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [e.name]: selectedOption.value,
      });
    }
  };

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
        const text = '["countrycode","rtmpartnerid","rtmrolename","materialid","openinginventory"]';
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
    setResponseStatus(null);
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
      const { header } = Props;
      const data = XLSX.utils.sheet_to_csv(ws, header);
      processDatas(data);
    };
    reader.readAsBinaryString(file);
    setSelectedFile(file);
  };

  const processDatas = (dataString: any) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

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
        let formData: any = new FormData();
        selectedFile != null && formData.append("file", selectedFile);
        formData.append("geolevel1", userData?.geolevel1);
        formData.append("rolename", "DISTRIBUTOR");
        invokePostFileAuthService(uploadTemplate, formData)
          .then((response: any) => {
            console.log(response, response.status, response.message_response);
            setResponseStatus(response.status);
            setResponseMessage(response.message_response);
            setTotalDuplicateRecords(response.body.duplicate.length);
            setTotalRecordsInserted(response.body.inserted.length);
            setTotalInvalidRecords(response.body.invalid.length);
            setShowPopup(false);                
            setShowUploadedMessageBox(true);
            setSelectedFile(null);
          })
          .catch((error: any) => {
            let message = error.message; 
            console.log("warning", message);
            setShowPopup(false);
            setShowUploadedMessageBox(true);
            setSelectedFile(null);
          });
      } else {
        Alert("warning", "Templete format mismatched. Please upload valid format");
      }
    }
  };

  const handleCloseMessagePopup = () => {
    setShowUploadedMessageBox(false);
    setUploadAppliedTime(new Date().getTime());
  };

  const fields = dynamicFields;
  const locationList = fields?.map((list: any, index: number) => {
    let nameCapitalized = levelsName[index]?.charAt(0).toUpperCase() + levelsName[index]?.slice(1);
    return (
      <React.Fragment key={`geolevels` + index}>
        {index !== 0 && list.name !== "geolevel3" && list.name !== "geolevel4" && list.name !== "geolevel5" && (
          <div className="col" style={{ marginBottom: "5px" }}>
            <ReactSelect
              name={list.name}
              label={`${nameCapitalized === "Add" ? "ADD" : nameCapitalized}`}
              options={list.options}
              handleChange={(selectedOptions: any, e: any) => {
                list.value = selectedOptions.value;
                getOptionLists("manual", list.name, selectedOptions.value, index);
                handleReactSelect(selectedOptions, e, list.name);
              }}
              value={list.value}
              isDisabled={list.name === "geolevel1"}
              id="geolevel-test"
              dataTestId="geolevel-test"
            />
          </div>
        )}
      </React.Fragment>
    );
  });

  const handleDateChange = (date: any, name: string) => {
    let val = selectedFilters;
    // to date

    if (name === "lastmodifieddateto") {
      if (moment(date).format("YYYY-MM-DD") >= moment(val.lastmodifieddatefrom).format("YYYY-MM-DD")) {
        setDateErrMsg("");
      } else if (moment(date).format("YYYY-MM-DD") <= moment(val.lastmodifieddatefrom).format("YYYY-MM-DD")) {
        setDateErrMsg("End Date should be greater than Start Date");
      } else {
        setDateErrMsg("Start Date should be lesser than  End Date");
      }
    }
    // from date
    if (name === "lastmodifieddatefrom") {
      if (moment(date).format("YYYY-MM-DD") <= moment(val.lastmodifieddateto).format("YYYY-MM-DD")) {
        setDateErrMsg("");
      } else if (moment(date).format("YYYY-MM-DD") >= moment(val.lastmodifieddateto).format("YYYY-MM-DD")) {
        setDateErrMsg("Start Date should be lesser than End Date");
      } else {
        setDateErrMsg("Start Date should be greater than  End Date");
      }
    }
    setSelectedFilters({ ...selectedFilters, [name]: date });
  };

  const applyFilter = () => {
    setIsFiltered(true);
    setFilterAppliedTime(new Date().getTime());
    setselectedDistributor(0);
    setselectedBrand(0);
    closeToggle && closeToggle();
  };

  const onSort = (name: string, data: any, isAsc: boolean, table: string) => {
    let response: any = sortBy(name, data);
    if (table === "overallScans") {
      dispatch(setOverallInventory(response));
    } else if (table === "BrandwiseInventory") {
      dispatch(setBrandwiseInventory(response));
    } else if (table === "ProductwiseInventory") {
      dispatch(setProductwiseInventory(response));
    }
    setIsAsc(!isAsc);
  };

  const handleSort = (e: any, columnname: string, allConsolidatedInventory: any, isAsc: boolean, table: string) => {
    if (table === "overallScans") {
      setoveralltableIndex(e.currentTarget.cellIndex);
      setbrandtableIndex(1);
      setproducttableIndex(1);
    } else if (table === "BrandwiseInventory") {
      setbrandtableIndex(e.currentTarget.cellIndex);
      setoveralltableIndex(1);
      setproducttableIndex(1);
    } else if (table === "ProductwiseInventory") {
      setproducttableIndex(e.currentTarget.cellIndex);
      setoveralltableIndex(1);
      setbrandtableIndex(1);
    }
    onSort(columnname, allConsolidatedInventory, isAsc, table);
  };

  const handleUpdateRetailer = (value: object) => {
    setretailerPopupData(value);
  };
  const resetFilter = (e: any) => {
    let fiscalStartDate = new Date(fiscalYear, 0, 1);
    let fiscalEndDate = fiscalYear === new Date().getFullYear() ? new Date() : new Date(fiscalYear, 11, 31);
    // let conditionIsFilter = searchText ? true : false;
    getDynamicOptionFields("reset");
    setSelectedFilters({
      productgroup: "ALL",
      geolevel1: userData?.geolevel1,
      geolevel2: "ALL",
      lastmodifieddatefrom: fiscalStartDate,
      lastmodifieddateto: fiscalEndDate,
      fromdate: fiscalStartDate,
      todate: fiscalEndDate,
      scannedPeriod: "All Months",
    });
    setDateErrMsg("");
    setFilterAppliedTime(new Date().getTime());
    setselectedDistributor(0);
    setselectedBrand(0);
    closeToggle && closeToggle();
  };

  return (
    <AUX>
      {(isLoader || isReduxLoader) && <Loader />}
      <div className="consolidatedSales-container">
        <div className="row">
          <div className="filterSection col-sm-12 consolidatedFilterWizard">
            <label className="font-weight-bold">Distributor Inventory</label>
            <Filter
              handleSearch={handleSearch}
              searchText={searchText}
              downloadPopup={true}
              isDownload={true}
              handlePartnerChange={handlePartnerChange}
              toolTipText="Search applicable for Partner Name/ID"
              download={download}
              onClose={(node: any) => {
                closeToggle = node;
              }}
              uploadPopup={uploadPopup}
              fiscalYear={fiscalYear}
              handleReactSelect={handleReactSelect}
              yearOptions={year}
              isCustomDropdown={true}
              viewType={viewType}
              packageTypeOptions={packType}
              isUploadAvailable={true}
              isInventoryDownloadPopup={true}
            >
              <label className="font-weight-bold pt-2">Product Group</label>
              <div className="form-group pt-1">
                {productCategories.map((item: any, i: number) => (
                  <span className="mr-2 chipLabel" key={i}>
                    <Button
                      color={
                        selectedFilters.productgroup === item ? "btn activeColor rounded-pill" : "btn rounded-pill boxColor"
                      }
                      size="sm"
                      onClick={(e) => handleFilterChange(e, "productgroup", item)}
                      style={{ marginBottom: "5px" }}
                    >
                      {item}
                    </Button>
                  </span>
                ))}
              </div>
              <div className="form-group container" onClick={(e) => e.stopPropagation()}>
                <div className="row column-dropdown">{locationList}</div>
              </div>
              <label className="font-weight-bold pt-2">Scanned Period</label>
              <div className="pt-1">
                {scannedPeriodsList.map((item: any, i: number) => (
                  <span className="mr-2 chipLabel" key={i}>
                    <Button
                      color={
                        selectedFilters.scannedPeriod === item.label
                          ? "btn activeColor rounded-pill"
                          : "btn rounded-pill boxColor"
                      }
                      size="sm"
                      onClick={(e) => handleFilterChange(e, "scannedPeriod", item.label, item)}
                      style={{ marginBottom: "5px" }}
                    >
                      {item.label}
                    </Button>
                  </span>
                ))}
              </div>
              {selectedFilters.scannedPeriod === "Custom" && (
                <React.Fragment>
                  <label className="font-weight-bold pt-2" htmlFor="order-date" style={{ width: "55%" }}>
                    From
                  </label>
                  <label className="font-weight-bold pt-2" htmlFor="order-todate">
                    To
                  </label>
                  <div className="d-flex">
                    <div className="user-filter-date-picker">
                      <DatePicker
                        id="order-date"
                        value={selectedFilters.lastmodifieddatefrom}
                        dateFormat="dd-MM-yyyy"
                        customInput={<DateInput ref={ref} />}
                        selected={selectedFilters.lastmodifieddatefrom}
                        onChange={(date: any) => handleDateChange(date, "lastmodifieddatefrom")}
                        showMonthDropdown
                        // showYearDropdown
                        dropdownMode="select"
                        // maxDate={new Date()}
                        minDate={new Date(selectedFromDateOfYear)}
                        // maxDate={new Date(selectedToDateOfYear)}
                        maxDate={new Date()}
                      />
                    </div>
                    <div className="p-2">-</div>

                    <div className="user-filter-date-picker">
                      <DatePicker
                        value={selectedFilters.lastmodifieddateto}
                        dateFormat="dd-MM-yyyy"
                        customInput={<DateInput ref={ref} />}
                        selected={selectedFilters.lastmodifieddateto}
                        onChange={(date: any) => handleDateChange(date, "lastmodifieddateto")}
                        showMonthDropdown
                        // showYearDropdown
                        dropdownMode="scroll"
                        minDate={new Date(selectedFromDateOfYear)}
                        maxDate={fiscalYear === new Date().getFullYear() ? new Date() : new Date(selectedToDateOfYear)}
                        // showDateMonthPicker
                      />
                    </div>
                  </div>
                  {dateErrMsg && <span className="error">{dateErrMsg} </span>}
                </React.Fragment>
              )}

              <div className="filterFooter pt-3">
                <button
                  className="cus-btn-consolidatedscanlog-filter reset"
                  onClick={(e) => resetFilter(e)}
                  data-testid="reset-all"
                >
                  Reset All
                </button>
                <button
                  className="cus-btn-consolidatedscanlog-filter"
                  onClick={applyFilter}
                  disabled={dateErrMsg ? true : false}
                  data-testid="apply"
                >
                  Apply
                  <span>
                    <img src={ArrowIcon} className="arrow-i" alt="" />
                    <img src={RtButton} className="layout" alt="" />
                  </span>
                </button>
              </div>
            </Filter>
            <div>
              {showUploadedMessageBox && (
                <AdminPopup open={true} onClose={handleCloseMessagePopup} maxWidth={"450px"}>
                  <DialogContent>
                    <div className="popup-container">
                      <div className="popup-content">
                        <div className={`popup-title`} style={{ fontSize: "18px" }}>
                          Upload History
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          lineHeight: "1.5",
                        }}
                      >
                        {responseStatus === 404 ? (
                          <label style={{ margin: "28px" }}>
                            {responseMessage}
                          </label>
                        ) : responseStatus === 500 ? (
                          <label style={{ margin: "28px" }}>
                            <p>Data error. Please check uploaded excel</p>
                          </label>
                        ) : (
                          <label style={{ marginTop: "11px" }}>
                            <ul style={{ fontSize: "14px" }}>
                              <li>
                                Total number of data inserted&nbsp;&nbsp;-&nbsp;
                                {totalRecordsInserted} <br />
                              </li>
                              <li>
                                Total number of data already exists&nbsp;&nbsp;-&nbsp;
                                {totalDuplicateRecords}
                              </li>
                              <li>
                                Total number of invalid/empty data&nbsp;&nbsp;-&nbsp;
                                {totalInvalidRecords}
                              </li>
                            </ul>
                          </label>
                        )}
                      </div>
                      <DialogActions>
                        <Button
                          autoFocus
                          onClick={handleCloseMessagePopup}
                          className="admin-popup-btn filter-scan"
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
                              {selectedFile === null || (selectedFile != null && !dataValidated) ? (
                                <div className="browse">
                                  <img className="upload-cloud-image" src={uploadIcon} alt="upload cloud icon" />
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
                                    <div className="selected-file-name">
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
                            customInput={<DateInput ref={ref} className="update-date-input-field" disabled={true} />}
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
            </div>
          </div>
        </div>
        <div className="row" style={{ opacity: "0.9999" }}>
          <div className="col-sm-6">
            <OverallInventory
              allConsolidatedInventory={allConsolidatedInventory}
              getSelectedBrands={getSelectedBrands}
              selectedDistributor={selectedDistributor}
              handleSort={handleSort}
              isAsc={isAsc}
              tableCellIndex={overalltableIndex}
              tableName={"overallScans"}
              handleUpdateRetailer={handleUpdateRetailer}
              retailerPopupData={retailerPopupData}
              partnerType={partnerType}
              setSearchText={setSearchText}
              setIsFiltered={setIsFiltered}
              viewType={viewType}
            />
          </div>
          <div className="col-sm-6">
            <div>
              <BrandwiseInventory
                selectedBrandList={BrandwiseInventories}
                getSelectedProducts={getSelectedProducts}
                distributorName={selectedDistributorName}
                selectedBrand={selectedBrand}
                handleSort={handleSort}
                isAsc={isAsc}
                tableCellIndex={brandtableIndex}
                tableName={"BrandwiseInventory"}
              />
            </div>
            <div>
              <ProductwiseInventory
                selectedProductList={ProductwiseInventories}
                brandName={selectedBrandName}
                handleSort={handleSort}
                isAsc={isAsc}
                tableCellIndex={producttableIndex}
                tableName={"ProductwiseInventory"}
              />
            </div>
          </div>
        </div>
      </div>
    </AUX>
  );
};

export default Inventory;
