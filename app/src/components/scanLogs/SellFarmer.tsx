import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import "../../assets/scss/scanLogs.scss";
import Loader from "../../utility/widgets/loader";
import Pagination from "../../utility/widgets/pagination";
import moment from "moment";
import CalenderIcon from "../../assets/icons/calendar.svg";
import { Button } from "reactstrap";
import { ErrorMsg } from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import { invokeGetAuthService } from "../../utility/base/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import { getLocalStorageData } from "../../utility/base/localStore";
import Filter from "../../containers/grid/Filter";
import ReactSelect from "../../utility/widgets/dropdown/ReactSelect";
import AdvisorSales from "./AdvisorSales";
import WalkInSales from "./WalkInSales";
import { Alert } from "../../utility/widgets/toaster";
import {
  salesTypeSellToFarmer,
  scannedBySellToFarmer,
  RSM_ROLE,
  ADMIN_ROLE,
  SCANNED_DATE,
  PRODUCT_GROUP,
} from "../../utility/constant";
import { FormattedMessage } from "react-intl";
type PartnerTypes = {
  type: String;
};
interface IProps {
  onChange?: any;
  placeholder?: any;
  value?: any;
  id?: any;
  onClick?: any;
  // any other props that come into the component
}

const ref = React.createRef();
const Input = React.forwardRef(({ onChange, placeholder, value, id, onClick }: IProps, ref: any) => (
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
    />
  </div>
));

type Props = {};

type States = {
  showPopup: boolean;
  showProductPopup: boolean;
  [key: string]: any;
  isAsc: Boolean;
  partnerType: PartnerTypes;
};
let levelsName: any = [];
/**
 * SellFarmer component implement to WalkinSales and Advisor Sales management
 * @param props  define types
 * @param states define types
 */
class SellFarmer extends Component<Props, States> {
  tableCellIndex: any = 0;
  timeOut: any;
  paginationRef: any;
  closeToggle: any;
  walkinSalesRef: any;
  advisorSalesRef: any;
  constructor(props: any) {
    super(props);
    // To maintain the default initial state management for rendering components
    this.state = {
      showPopup: false,
      showProductPopup: false,
      isAsc: true,
      selectIndex: "",
      isRendered: false,
      allScanLogs: [],
      actions: ["All", "Distributor", "Retailer"],
      dropDownValue: "Select action",
      scanType: ["All", "Send Goods", "Receive Goods", "Sell to Farmers"],
      productCategories: PRODUCT_GROUP,
      status: ["ALL", "VALID", "INVALID"],
      advisorStatus: ["ALL", "FULFILLED"],
      list: ["ALL", "Distributor", "Retailer"],
      selectedAdvisorFilters: {
        productgroup: "ALL",
        status: "ALL",
        ordereddatefrom: new Date().setMonth(new Date().getMonth() - 6),
        ordereddateto: new Date(),
        lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 6),
        lastmodifiedto: new Date(),
        farmer: "ALL",
        retailer: "ALL",
        partnerType: "Retailers",
      },
      selectedWalkInFilters: {
        productgroup: "ALL",
        scanstatus: "ALL",
        //custom calender date values
        scannedDateFrom: new Date().setMonth(new Date().getMonth() - 6),
        scannedDateTo: new Date(),
        retailer: "ALL",
        partnerType: "Retailers",
        scannedPeriod: "",
        scandatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
        scandateto: moment(new Date()).format("YYYY-MM-DD"),
        batchno: "ALL",
        soldtoid: "ALL",
      },
      dateErrMsg: "",
      searchText: "",
      totalData: 0,
      isFiltered: false,
      userRole: "",
      tooltipOpen: false,
      isLoader: false,
      dropdownOpenFilter: false,
      accordionView: false,
      accordionId: "",
      // value: 0,
      value: moment(),
      lastUpdatedDateErr: "",
      farmerOptions: [],
      retailerOptions: [],
      loggedUserInfo: {},
      partnerTypeList: ["Retailers"],
      salesType: ["WALKIN_SALES", "ADVISOR_SALES"], //"WALKIN_SALES",
      partnerType: {
        type: "Retailers",
      },
      scannedPeriodsList: SCANNED_DATE,
      selectedScanType: "WALKIN_SALES",
      selectedScannedBy: "Retailer",
      scannedByList: scannedBySellToFarmer,
      scanTypeList: salesTypeSellToFarmer,
    };
    this.timeOut = 0;
  }
  /**
   * Inital rendering API calls to mount the component
   */
  componentDidMount() {
    //To get the logged current user information
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
    const condSalesType =
      userData?.role === RSM_ROLE ? this.state.scanTypeList : [{ value: "WALKIN_SALES", label: "Walk-In Sales" }];
    this.setState(
      {
        loggedUserInfo: userData,
        scanTypeList: condSalesType,
      },
      () => {
        this.getRetailerList();
        this.getLocationHierachyOrder();
        this.getCountryList();
        this.getHierarchyDatas();
        this.getBatchList();
      }
    );
  }

  /**
   * Get the country list and shown up  dropdown options values
   */
  getCountryList() {
    let res = [
      { value: "India", label: "India" },
      { value: "Malawi", label: "Malawi" },
    ];
    this.setState({ countryList: res });
  }

  /**
   * Retailer and Farmer dropdown list value
   * @param condIf
   */
  getRetailerList = (condIf?: any) => {
    const { rsmRetailerList } = apiURL;
    const { selectedAdvisorFilters } = this.state;
    let queryParams = {
      region: this.state.loggedUserInfo?.geolevel1,
      countrycode: this.state.loggedUserInfo?.countrycode,
      retailerid: selectedAdvisorFilters.retailer === "ALL" ? null : selectedAdvisorFilters.retailer,
    };
    let oneTimeUpdate = selectedAdvisorFilters.retailer !== "ALL" && condIf ? true : false;
    // TO call the retailer list api with filters
    invokeGetAuthService(rsmRetailerList, queryParams)
      .then((response) => {
        if (response.data) {
          const { farmers, retailers } = response.data;
          let options = [{ value: "ALL", label: "ALL" }];
          const farmerOptionsList =
            farmers?.length > 0
              ? farmers.map((val: any) => {
                  return { value: val.farmerid, label: val.farmername };
                })
              : [];
          const farmerOptions = [...options, ...farmerOptionsList];
          const retailerOptionsList =
            retailers?.length > 0
              ? retailers.map((val: any) => {
                  return { value: val.userid, label: val.username };
                })
              : [];
          const retailerOptions = [...options, ...retailerOptionsList];
          const retailerList =
            oneTimeUpdate && this.state.retailerOptions.length ? this.state.retailerOptions : retailerOptions;
          this.setState({
            isLoader: false,
            farmerOptions,
            retailerOptions: retailerList,
            selectedAdvisorFilters: { ...this.state.selectedAdvisorFilters, farmer: "ALL" },
          });
        }
      })
      .catch((error) => {
        this.setState({ isLoader: false });
        // handle the error message and display toaster message
        ErrorMsg(error);
      });
  };

  /**
   * To get location hierachy data order list
   */
  getLocationHierachyOrder = () => {
    const { getTemplateData } = apiURL;
    let data = {
      countryCode: this.state.loggedUserInfo?.countrycode,
    };
    invokeGetAuthService(getTemplateData, data).then((response: any) => {
      let locationData = response.body[0].locationhierarchy;
      let levels: any = [];
      locationData?.length > 0 &&
        locationData.forEach((item: any, index: number) => {
          if (index > 0) {
            let locationhierlevel = item.level;
            let geolevels = "geolevel" + locationhierlevel;
            let obj = { name: item.name, geolevels };
            levels.push(obj);
          }
        });
      this.setState({
        locationData: levels,
      });
    });
  };
  /**
   * To handle the searchText value
   * @param e
   */
  handleSearch = (e: any) => {
    let searchText = e.target.value;
    this.setState({ searchText: searchText, isFiltered: true });
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    if (searchText.length >= 3 || searchText.length === 0) {
      this.timeOut = setTimeout(() => {
        this.callChildAPI();
      }, 1000);
    }
  };
  /**
   * To hanlde the filter values
   * @param e
   * @param name
   * @param item
   * @param itemList
   */
  handleFilterChange = (e: any, name: string, item: any, itemList?: any) => {
    e.stopPropagation();
    const { selectedScanType, selectedAdvisorFilters, selectedWalkInFilters } = this.state;
    let val = selectedScanType === "WALKIN_SALES" ? { ...selectedWalkInFilters } : { ...selectedAdvisorFilters };
    let flag = false;
    if (name === "type") {
      val[name] = e.target.value;
      flag = true;
    } else if (name === "scannedPeriod" && item !== "Custom") {
      val["scandatefrom"] = itemList?.from;
      val["scandateto"] = itemList?.to;
      val[name] = item;
      flag = true;
    } else {
      val[name] = item;

      flag = true;
    }
    if (flag) {
      const name = selectedScanType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
      this.setState({ [name]: val });
    }
  };
  /**
   * This method handle reset the filter values in state
   * @param e
   */
  resetFilter = (e?: any) => {
    let conditionIsFilter = this.state.searchText ? true : false;
    const { selectedScanType } = this.state;
    const condName = selectedScanType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
    let val =
      selectedScanType === "WALKIN_SALES"
        ? {
            productgroup: "ALL",
            scanstatus: "ALL",
            scannedDateFrom: new Date().setMonth(new Date().getMonth() - 6),
            scannedDateTo: new Date(),
            scandatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
            scandateto: moment(new Date()).format("YYYY-MM-DD"),
            retailer: "ALL",
            partnerType: "Retailers",
            scannedPeriod: "",
            batchno: "ALL",
          }
        : {
            productgroup: "ALL",
            status: "ALL",
            ordereddatefrom: new Date().setMonth(new Date().getMonth() - 6),
            ordereddateto: new Date(),
            lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 6),
            lastmodifiedto: new Date(),
            farmer: "ALL",
            retailer: "ALL",
            partnerType: "Retailers",
          };
    this.getDynamicOptionFields("reset");
    this.setState(
      {
        [condName]: { ...val },
        isFiltered: conditionIsFilter,
        dateErrMsg: "",
        lastUpdatedDateErr: "",
        ScannedDateErrMsg: "",
        // searchText:""
      },
      () => {
        this.closeToggle();
        this.callChildAPI();
        if (selectedScanType === "ADVISOR_SALES") this.getRetailerList();
      }
    );
  };
  /**
   * To hanlde applicable to filter values and call the get list API
   */
  applyFilter = () => {
    this.setState({ isFiltered: true }, () => {
      this.callChildAPI();
      //To close the filter toggle
      this.closeToggle();
    });
  };
  /**
   * To accesssed the download features
   */
  download = () => {
    const { selectedScanType } = this.state;
    selectedScanType === "WALKIN_SALES" ? this.walkinSalesRef?.download() : this.advisorSalesRef?.download();
  };
  /**
   * To handle date fields for filter values
   * @param date
   * @param name
   */
  handleDateChange = (date: any, name: string) => {
    const { selectedScanType, selectedAdvisorFilters, selectedWalkInFilters } = this.state;
    let val = selectedScanType === "WALKIN_SALES" ? { ...selectedWalkInFilters } : { ...selectedAdvisorFilters };
    // Custom scanned date - check End date

    if (name === "scannedDateTo") {
      if (moment(date).format("YYYY-MM-DD") >= moment(val.scannedDateFrom).format("YYYY-MM-DD")) {
        this.setState({
          ScannedDateErrMsg: "",
        });
      } else if (moment(date).format("YYYY-MM-DD") <= moment(val.scannedDateFrom).format("YYYY-MM-DD")) {
        this.setState({
          ScannedDateErrMsg: "Scanned End Date should be greater than  Scanned Start Date",
        });
      } else {
        this.setState({
          ScannedDateErrMsg: "Scanned Start Date should be lesser than  Scanned End Date",
        });
      }
    }
    // Custom scanned date - check Start date
    if (name === "scannedDateFrom") {
      if (moment(date).format("YYYY-MM-DD") <= moment(val.scannedDateTo).format("YYYY-MM-DD")) {
        this.setState({
          ScannedDateErrMsg: "",
        });
      } else if (moment(date).format("YYYY-MM-DD") >= moment(val.scannedDateTo).format("YYYY-MM-DD")) {
        this.setState({
          ScannedDateErrMsg: "Scanned Start Date should be lesser than Scanned End Date",
        });
      } else {
        this.setState({
          ScannedDateErrMsg: "Scanned Start Date should be greater than Scanned End Date",
        });
      }
    }
    // order date - check End date
    if (name === "ordereddateto") {
      if (date >= val.ordereddatefrom) {
        this.setState({
          dateErrMsg: "",
        });
      } else if (date <= val.ordereddatefrom) {
        this.setState({
          dateErrMsg: "Ordered End Date should be greater than  Ordered Start Date",
        });
      } else {
        this.setState({
          dateErrMsg: "Ordered Start Date should be lesser than  Ordered End Date",
        });
      }
    }
    // order date - check Start date
    if (name === "ordereddatefrom") {
      if (date <= val.ordereddateto) {
        this.setState({
          dateErrMsg: "",
        });
      } else if (date >= val.ordereddateto) {
        this.setState({
          dateErrMsg: "Ordered Start Date should be lesser than Ordered End Date",
        });
      } else {
        this.setState({
          dateErrMsg: "Ordered Start Date should be greater than Ordered End Date",
        });
      }
    }
    // Last updated date - check End date
    if (name === "lastmodifiedto") {
      if (date >= val.lastmodifiedfrom) {
        this.setState({
          lastUpdatedDateErr: "",
        });
      } else if (date <= val.lastmodifiedfrom) {
        this.setState({
          lastUpdatedDateErr: "Last Updated End Date should be greater than  Last Updated Start Date",
        });
      } else {
        this.setState({
          lastUpdatedDateErr: "Last Updated Start Date should be lesser than  Last Updated End Date",
        });
      }
    }

    // Last updated date - check Start date
    if (name === "lastmodifiedfrom") {
      if (date <= val.lastmodifiedto) {
        this.setState({
          lastUpdatedDateErr: "",
        });
      } else if (date >= val.lastmodifiedto) {
        this.setState({
          lastUpdatedDateErr: "Last Updated Start Date should be lesser than Last Updated End Date",
        });
      } else {
        this.setState({
          lastUpdatedDateErr: "Last Updated Start Date should be greater than Last Updated End Date",
        });
      }
    }
    const condName = selectedScanType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
    this.setState({
      [condName]: { ...this.state[condName], [name]: date },
    });
  };

  handlePartnerChange = (name: string) => {
    this.setState({
      partnerType: {
        type: name,
      },
    });
  };

  handleButtonChange = (name: string, value: string) => {
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.callChildAPI();
      }
    );
  };
  handleReactSelect = (selectedOption: any, e: any, inActiveFilter?: boolean) => {
    const { selectedScanType, selectedAdvisorFilters, selectedWalkInFilters } = this.state;
    const condName = selectedScanType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
    let val = selectedScanType === "WALKIN_SALES" ? { ...selectedWalkInFilters } : { ...selectedAdvisorFilters };
    if (inActiveFilter) {
      // handle selectedScanType and selectedScannedBy value
      let oneTimeAPI = false;
      // when update scantype after call the api otherwise don't call the api
      if (e.name === "selectedScanType" && selectedOption.value !== this.state[e.name]) {
        oneTimeAPI = true;
      }
      this.setState(
        {
          [e.name]: selectedOption.value,
        },
        () => {
          oneTimeAPI && this.callChildAPI();
        }
      );
    } else {
      this.setState(
        {
          [condName]: {
            ...val,
            [e.name]: selectedOption.value,
          },
        },
        () => {
          if (e.name === "retailer") {
            let condIf = "retailer";
            this.getRetailerList(condIf);
          }
        }
      );
    }
  };

  getBatchList = () => {
    const { getBatchList } = apiURL;
    let countrycode = {
      countrycode: this.state.loggedUserInfo?.countrycode,
      soldbygeolevel1: this.state.loggedUserInfo?.role === ADMIN_ROLE ? null : this.state.loggedUserInfo?.geolevel1,
    };
    invokeGetAuthService(getBatchList, countrycode)
      .then((response: any) => {
        let data = Object.keys(response.data).length !== 0 ? response.data : [];
        let options = [{ value: "ALL", label: "ALL" }];
        const temp =
          data?.length > 0
            ? data.map((val: any) => {
                return { value: val.batchno, label: val.batchno };
              })
            : [];
        const list = [...options, ...temp];
        this.setState({ isLoader: false, batchOptions: list });
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        Alert("warning", message);
      });
  };

  getHierarchyDatas() {
    //To get all level datas
    this.setState({ isLoader: true });
    const { getHierarchyLevels } = apiURL;
    let countrycode = {
      countryCode: this.state.loggedUserInfo?.countrycode,
    };
    invokeGetAuthService(getHierarchyLevels, countrycode)
      .then((response: any) => {
        let geolevel1 = Object.keys(response.body).length !== 0 ? response.body.geolevel1 : [];
        this.setState({ isLoader: false, geolevel1List: geolevel1 }, () => {
          this.getGeographicFields();
        });
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        Alert("warning", message);
      });
  }
  getDynamicOptionFields = (reset?: string) => {
    let level1List = this.state.geolevel1List;
    if (!reset) {
      let allItem = { code: "ALL", name: "ALL", geolevel2: [] };
      level1List.unshift(allItem);
    }
    this.setState({ geolevel1List: level1List });
    let level1Options: any = [];
    this.state.geolevel1List?.forEach((item: any) => {
      let level1Info = { label: item.name, code: item.code, value: item.name };
      level1Options.push(level1Info);
    });

    let setFormArray: any = [];
    let localObj: any = getLocalStorageData("userData");
    let userData = JSON.parse(localObj);

    let userrole = userData?.role;
    let level2Options: any = [];
    if (userrole === RSM_ROLE) {
      let filteredLevel1: any = this.state.geolevel1List?.filter((list: any) => list.name === userData?.geolevel1);
      filteredLevel1[0]?.geolevel2?.forEach((item: any) => {
        let level2Info = { label: item.name, value: item.name, code: item.code };
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
    // let geolevel1Obj = { label: usergeolevel1, value: usergeolevel1 };
    this.state.geographicFields?.forEach((list: any, i: number) => {
      setFormArray.push({
        name: list,
        placeHolder: true,
        value: list === "geolevel1" && userrole === RSM_ROLE ? usergeolevel1 : "ALL",
        options:
          list === "geolevel0"
            ? this.state.countryList
            : list === "geolevel1"
            ? level1Options
            : list === "geolevel2"
            ? level2Options
            : [{ label: "ALL", name: "ALL" }],
        error: "",
      });
    });
    this.setState({ dynamicFields: setFormArray });
  };
  getOptionLists = (cron: any, type: any, value: any, index: any) => {
    let newvalue = { label: value, name: value };
    let geolevel1List = this.state.geolevel1List;
    this.setState({ level1Options: geolevel1List });
    let dynamicFieldVal = this.state.dynamicFields;
    if (type === "geolevel1") {
      let filteredLevel1 = geolevel1List?.filter((level1: any) => level1.name === value);
      let level2Options: any = [];
      filteredLevel1[0]?.geolevel2?.forEach((item: any) => {
        let level1Info = { label: item.name, value: item.name, code: item.code };
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
      this.setState({ dynamicFields: dynamicFieldVal });
      dynamicFieldVal[index + 2].options = geolevel3Obj;
      dynamicFieldVal[index].value = value;
      dynamicFieldVal[index + 1].value = "ALL";
      dynamicFieldVal[index + 2].value = "ALL";
      this.setState((prevState: any) => ({
        dynamicFields: dynamicFieldVal,
        selectedFilters: {
          ...prevState.selectedFilters,
          geolevel2: "ALL",
        },
        selectedGeolevel2Options: geolevel1Obj,
      }));
    } else if (type === "geolevel2") {
      dynamicFieldVal[index].value = value;
      this.setState((prevState: any) => ({
        dynamicFields: dynamicFieldVal,
        selectedFilters: {
          ...prevState.selectedFilters,
        },
      }));
    }
  };
  getGeographicFields() {
    this.setState({ isLoader: true });
    const { getTemplateData } = apiURL;
    let data = {
      countryCode: this.state.loggedUserInfo?.countrycode,
    };
    invokeGetAuthService(getTemplateData, data)
      .then((response: any) => {
        let locationData = response.body[0].locationhierarchy;
        let levels: any = [];
        locationData.forEach((item: any) => {
          levelsName.push(item.name.toLowerCase());
          let locationhierlevel = item.level;
          let geolevels = "geolevel" + locationhierlevel;
          levels.push(geolevels);
        });
        let levelsData: any = [];
        locationData?.length > 0 &&
          locationData.forEach((item: any, index: number) => {
            if (index > 0) {
              let locationhierlevel = item.level;
              let geolevels = "geolevel" + locationhierlevel;
              let obj = { name: item.name, geolevels };
              levelsData.push(obj);
            }
          });
        this.setState(
          {
            isLoader: false,
            geographicFields: levels,
            locationData: levelsData,
          },
          () => {
            this.getDynamicOptionFields();
          }
        );
      })
      .catch((error: any) => {
        this.setState({ isLoader: false });
        let message = error.message;
        Alert("warning", message);
      });
  }
  handlePagination = (data: any[], total: any) => {
    this.setState({
      paginationData: data,
      totalPagination: total,
    });
  };

  hanldeUpdateFilterScan = (value: any, name: string) => {
    const { selectedScanType, selectedAdvisorFilters, selectedWalkInFilters } = this.state;
    const condName = selectedScanType === "WALKIN_SALES" ? "selectedWalkInFilters" : "selectedAdvisorFilters";
    let val = selectedScanType === "WALKIN_SALES" ? { ...selectedWalkInFilters } : { ...selectedAdvisorFilters };
    this.setState(
      {
        [condName]: {
          ...val,
          [name]: value,
        },
        isFiltered: true,
      },
      () => {
        this.callChildAPI();
      }
    );
  };
  callChildAPI = () => {
    const { selectedScanType } = this.state;
    selectedScanType === "WALKIN_SALES" ? this.walkinSalesRef?.getWalkInSales() : this.advisorSalesRef?.getAdvisorSales();
  };
  handleUpdateSearch = (value: string) => {
    this.setState(
      {
        searchText: value,
        isFiltered: true,
      },
      () => {
        this.callChildAPI();
      }
    );
  };

  render() {
    const {
      isLoader,
      dateErrMsg,
      searchText,
      lastUpdatedDateErr,
      farmerOptions,
      retailerOptions,
      batchOptions,
      selectedWalkInFilters,
      selectedAdvisorFilters,
      isFiltered,
      ScannedDateErrMsg,
      scannedByList,
      selectedScannedBy,
      selectedScanType,
    } = this.state;
    const fields = this.state.dynamicFields;
    const locationList = fields?.map((list: any, index: number) => {
      let nameCapitalized = levelsName[index].charAt(0).toUpperCase() + levelsName[index].slice(1);
      let data: any = getLocalStorageData("userData");
      let userData = JSON.parse(data);
      return (
        <React.Fragment key={`geolevels` + index}>
          {index !== 0 && list.name !== "geolevel3" && list.name !== "geolevel4" && list.name !== "geolevel5" && (
            <div className="col" style={{ marginBottom: "5px" }}>
              <ReactSelect
                name={list.name}
                label={`Scanned by - ${nameCapitalized === "Add" ? "ADD" : nameCapitalized}`}
                options={list.options}
                handleChange={(selectedOptions: any, e: any) => {
                  list.value = selectedOptions.value;
                  this.getOptionLists("manual", list.name, selectedOptions.value, index);
                  this.handleReactSelect(selectedOptions, e);
                }}
                value={list.value}
                isDisabled={userData?.role === RSM_ROLE && list.name === "geolevel1"}
                id="geolevel-test"
                dataTestId="geolevel-test"
              />
            </div>
          )}
        </React.Fragment>
      );
    });
    const condToolTipText =
      selectedScanType === "WALKIN_SALES"
        ? "Label, Farmer Name, Product Name, Store Name and Scanned By"
        : "Order ID, Retailer Name/ID, Farmer Name/Phone, Advisor Name/ID and Store Name";
    return (
      <AUX>
        {isLoader ? (
          <Loader />
        ) : (
          <div>
            <div>
              <div className="scanlog-table filterWizard">
                <Filter
                  handleSearch={this.handleSearch}
                  searchText={searchText}
                  download={this.download}
                  isDownload={true}
                  toolTipText={`Search applicable for ${condToolTipText}`}
                  onClose={(node: any) => {
                    this.closeToggle = node;
                  }}
                  isDownloadHelpText={selectedScanType === "WALKIN_SALES" ? false : true}
                  isScannedBy
                  scannedByList={scannedByList}
                  isScanType
                  scanTypeList={this.state.scanTypeList}
                  handleReactSelect={this.handleReactSelect}
                  selectedScannedBy={selectedScannedBy}
                  selectedScanType={selectedScanType}
                >
                  {selectedScanType === "WALKIN_SALES" ? (
                    <React.Fragment>
                      <label className="font-weight-bold pt-2">
                        <FormattedMessage id="scanLog.filter.prodGp" />
                      </label>
                      <div className="form-group pt-1">
                        {this.state.productCategories.map((item: any, i: number) => (
                          <span className="mr-2 chipLabel" key={i}>
                            <Button
                              color={
                                selectedWalkInFilters.productgroup === item
                                  ? "btn activeColor rounded-pill"
                                  : "btn rounded-pill boxColor"
                              }
                              size="sm"
                              onClick={(e) => this.handleFilterChange(e, "productgroup", item)}
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
                      <div className="form-group container" onClick={(e) => e.stopPropagation()}>
                        <div className="row column-dropdown">
                          <div className="col">
                            <ReactSelect
                              name="batchno"
                              value={selectedWalkInFilters.batchno}
                              label={<FormattedMessage id="scanLog.filter.batch" />}
                              handleChange={(selectedOptions: any, e: any) => this.handleReactSelect(selectedOptions, e)}
                              options={batchOptions}
                              defaultValue="ALL"
                              id="batchno-test"
                              dataTestId="batchno-test"
                            />
                          </div>
                        </div>
                      </div>
                      <label className="font-weight-bold pt-2">
                        <FormattedMessage id="scanLog.filter.scanStatus" />
                      </label>
                      <div className="pt-1">
                        {this.state.status.map((item: any, statusIndex: number) => (
                          <span className="mr-2" key={statusIndex}>
                            <Button
                              color={
                                selectedWalkInFilters.scanstatus === item
                                  ? "btn activeColor rounded-pill"
                                  : "btn rounded-pill boxColor"
                              }
                              size="sm"
                              onClick={(e) => this.handleFilterChange(e, "scanstatus", item)}
                            >
                              {item}
                            </Button>
                          </span>
                        ))}
                      </div>
                      <label className="font-weight-bold pt-2">
                        {" "}
                        <FormattedMessage id="scanLog.filter.scanPer" />
                      </label>
                      <div className="pt-1">
                        {this.state.scannedPeriodsList.map((item: any, i: number) => (
                          <span className="mr-2 chipLabel" key={i}>
                            <Button
                              color={
                                selectedWalkInFilters.scannedPeriod === item.label
                                  ? "btn activeColor rounded-pill"
                                  : "btn rounded-pill boxColor"
                              }
                              size="sm"
                              onClick={(e) => this.handleFilterChange(e, "scannedPeriod", item.label, item)}
                              style={{ marginBottom: "5px" }}
                            >
                              {item.label}
                            </Button>
                          </span>
                        ))}
                      </div>
                      {selectedWalkInFilters.scannedPeriod === "Custom" && (
                        <React.Fragment>
                          <label className="font-weight-bold pt-2" htmlFor="order-date" style={{ width: "55%" }}>
                            <FormattedMessage id="common.from" />
                          </label>
                          <label className="font-weight-bold pt-2" htmlFor="order-todate">
                            <FormattedMessage id="common.to" />
                          </label>
                          <div className="d-flex">
                            <div className="user-filter-date-picker">
                              <DatePicker
                                id="order-date"
                                value={selectedWalkInFilters.scannedDateFrom}
                                dateFormat="dd-MM-yyyy"
                                customInput={<Input ref={ref} />}
                                selected={selectedWalkInFilters.scannedDateFrom}
                                onChange={(date: any) => this.handleDateChange(date, "scannedDateFrom")}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                              />
                            </div>
                            <div className="p-2">-</div>

                            <div className="user-filter-date-picker">
                              <DatePicker
                                value={selectedWalkInFilters.scannedDateTo}
                                dateFormat="dd-MM-yyyy"
                                customInput={<Input ref={ref} />}
                                selected={selectedWalkInFilters.scannedDateTo}
                                onChange={(date: any) => this.handleDateChange(date, "scannedDateTo")}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                              />
                            </div>
                          </div>
                          {ScannedDateErrMsg && <span className="error">{ScannedDateErrMsg} </span>}
                        </React.Fragment>
                      )}

                      <div className="filterFooter pt-3">
                        <button
                          className="cus-btn-scanlog-filter reset"
                          onClick={(e) => this.resetFilter(e)}
                          data-testid="reset-all"
                        >
                          <FormattedMessage id="button.resetAll" />
                        </button>
                        <button
                          className="cus-btn-scanlog-filter"
                          onClick={this.applyFilter}
                          disabled={ScannedDateErrMsg ? true : false}
                          data-testid="apply"
                        >
                          <FormattedMessage id="button.apply" />
                          <span>
                            <img src={ArrowIcon} className="arrow-i" alt="" />{" "}
                            <img src={RtButton} className="layout" alt="" />
                          </span>
                        </button>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="form-group" onClick={(e) => e.stopPropagation()}>
                        <ReactSelect
                          name="retailer"
                          value={selectedAdvisorFilters.retailer}
                          label={<FormattedMessage id="scanLog.filter.retailerName" />}
                          handleChange={(selectedOptions: any, e: any) => this.handleReactSelect(selectedOptions, e)}
                          options={retailerOptions}
                          defaultValue="ALL"
                          id="retailer-test"
                          dataTestId="retailer-test"
                        />
                      </div>

                      <div className="form-group" onClick={(e) => e.stopPropagation()}>
                        <ReactSelect
                          name="farmer"
                          value={selectedAdvisorFilters.farmer}
                          label={<FormattedMessage id="scanLog.filter.farmName" />}
                          handleChange={(selectedOptions: any, e: any) => this.handleReactSelect(selectedOptions, e)}
                          options={farmerOptions}
                          defaultValue="ALL"
                          id="farmer-test"
                          dataTestId="farmer-test"
                        />
                      </div>

                      <label className="pt-2">
                        <FormattedMessage id="scanLog.filter.prodGp" />
                      </label>
                      <div className="pt-1">
                        {this.state.productCategories.map((item: any, i: number) => (
                          <span className="mr-2 chipLabel" key={i}>
                            <Button
                              color={
                                selectedAdvisorFilters.productgroup === item
                                  ? "btn activeColor rounded-pill"
                                  : "btn rounded-pill boxColor"
                              }
                              size="sm"
                              onClick={(e) => this.handleFilterChange(e, "productgroup", item)}
                              style={{ marginBottom: "5px" }}
                            >
                              {item}
                            </Button>
                          </span>
                        ))}
                      </div>

                      {/* <label className="pt-2">Status</label>
										<div className="pt-1">
											{this.state.advisorStatus.map((item: any, statusIndex: number) => (
												<span className="mr-2" key={statusIndex}>
													<Button
														color={
															selectedAdvisorFilters.status === item
																? "btn activeColor rounded-pill"
																: "btn rounded-pill boxColor"
														}
														size="sm"
														onClick={(e) => this.handleFilterChange(e, "status", item)}
													>
														{item}
													</Button>
												</span>
											))}
										</div> */}

                      <label className="pt-2" htmlFor="order-date">
                        <FormattedMessage id="scanLog.filter.orderDt" />
                      </label>
                      <div className="d-flex">
                        <div className="user-filter-date-picker">
                          <DatePicker
                            id="order-date"
                            value={selectedAdvisorFilters.ordereddatefrom}
                            dateFormat="dd-MM-yyyy"
                            customInput={<Input ref={ref} />}
                            selected={selectedAdvisorFilters.ordereddatefrom}
                            onChange={(date: any) => this.handleDateChange(date, "ordereddatefrom")}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                          />
                        </div>
                        <div className="p-2">-</div>
                        <div className="user-filter-date-picker">
                          <DatePicker
                            value={selectedAdvisorFilters.ordereddateto}
                            dateFormat="dd-MM-yyyy"
                            customInput={<Input ref={ref} />}
                            selected={selectedAdvisorFilters.ordereddateto}
                            onChange={(date: any) => this.handleDateChange(date, "ordereddateto")}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                          />
                        </div>
                      </div>
                      {dateErrMsg && <span className="error">{dateErrMsg} </span>}
                      <label className="pt-2" htmlFor="update-date">
                        <FormattedMessage id="scanLog.filter.lastUpDt" />
                      </label>
                      <div className="d-flex">
                        <div className="user-filter-date-picker">
                          <DatePicker
                            id="update-date"
                            value={selectedAdvisorFilters.lastmodifiedfrom}
                            dateFormat="dd-MM-yyyy"
                            customInput={<Input ref={ref} />}
                            selected={selectedAdvisorFilters.lastmodifiedfrom}
                            onChange={(date: any) => this.handleDateChange(date, "lastmodifiedfrom")}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                          />
                        </div>

                        <div className="p-2">-</div>
                        <div className="user-filter-date-picker">
                          <DatePicker
                            value={selectedAdvisorFilters.lastmodifiedto}
                            dateFormat="dd-MM-yyyy"
                            customInput={<Input ref={ref} />}
                            selected={selectedAdvisorFilters.lastmodifiedto}
                            onChange={(date: any) => this.handleDateChange(date, "lastmodifiedto")}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                          />
                        </div>
                      </div>
                      {lastUpdatedDateErr && <span className="error">{lastUpdatedDateErr} </span>}

                      <div className="filterFooter pt-3">
                        <button
                          className="cus-btn-scanlog-filter reset"
                          onClick={(e) => this.resetFilter(e)}
                          data-testid="reset-all"
                        >
                          <FormattedMessage id="button.resetAll" />
                        </button>
                        <button
                          className="cus-btn-scanlog-filter"
                          onClick={this.applyFilter}
                          disabled={lastUpdatedDateErr || dateErrMsg ? true : false}
                          data-testid="apply"
                        >
                          <FormattedMessage id="button.apply" />
                          <span>
                            <img src={ArrowIcon} className="arrow-i" alt="" />{" "}
                            <img src={RtButton} className="layout" alt="" />
                          </span>
                        </button>
                      </div>
                    </React.Fragment>
                  )}
                </Filter>

                <div className="scanlog-container">
                  {selectedScanType === "WALKIN_SALES" ? (
                    <WalkInSales
                      onRef={(node: any) => {
                        this.walkinSalesRef = node;
                      }}
                      paginationRef={this.paginationRef}
                      handleUpdate={this.handlePagination}
                      loggedUser={this.state.loggedUserInfo}
                      searchText={searchText}
                      selectedFilters={selectedWalkInFilters}
                      isFiltered={isFiltered}
                      updateSearch={this.handleUpdateSearch}
                    />
                  ) : (
                    <AdvisorSales
                      onRef={(node: any) => {
                        this.advisorSalesRef = node;
                      }}
                      paginationRef={this.paginationRef}
                      handleUpdate={this.handlePagination}
                      loggedUser={this.state.loggedUserInfo}
                      searchText={searchText}
                      selectedFilters={selectedAdvisorFilters}
                      isFiltered={isFiltered}
                      handleFilterScan={this.hanldeUpdateFilterScan}
                    />
                  )}
                </div>
              </div>
            </div>
            <div>
              <Pagination
                totalData={
                  selectedScanType === "WALKIN_SALES"
                    ? this.walkinSalesRef?.state?.totalWalkInData
                    : this.advisorSalesRef?.state?.totalAdvisorSalesData
                }
                data={
                  selectedScanType === "WALKIN_SALES"
                    ? this.walkinSalesRef?.state?.allWalkInSalesData
                    : this.advisorSalesRef?.state?.allAdvisorSalesData
                }
                totalLabel={selectedScanType === "WALKIN_SALES" ? "Walk-In Sales" : "Advisor Sales"}
                onRef={(node: any) => {
                  this.paginationRef = node;
                }}
                getRecords={
                  selectedScanType === "WALKIN_SALES"
                    ? this.walkinSalesRef?.getWalkInSales
                    : this.advisorSalesRef?.getAdvisorSales
                }
              />
            </div>
          </div>
        )}
      </AUX>
    );
  }
}

export default SellFarmer;
