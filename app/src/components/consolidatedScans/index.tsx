/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import AUX from "../../hoc/Aux_";
import Filter from "../../containers/grid/Filter";
import OverallScans from "./OverallScans";
import ProductBrandList from "./ProductBrandList";
import ProductList from "./ProductList";
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
  getOverallScans,
  getScannedBrands,
  getScannedProducts,
  setselectedBrandList,
  setselectedProductList,
  setOverallList,
} from "../../redux/actions/consolidatedScans/consolidatedScans";
import ReactSelect from "../../utility/widgets/dropdown/ReactSelect";
import _ from "lodash";

let obj: any = getLocalStorageData("userData");
let userData = JSON.parse(obj);

const ConsolidatedScans = (Props: any) => {
  let closeToggle: any;
  const dispatch = useDispatch();
  const geolevel1List = useSelector(({ common }: any) => common?.geoLevel1List);
  const geographicFields = useSelector(({ common }: any) => common?.geographicFields);
  const levelsName = useSelector(({ common }: any) => common?.levelsName);
  const commonErrorMessage = useSelector(({ common }: any) => common?.errorMessage);
  const allConsolidatedScans = useSelector(({ consolidatedScans }: any) => consolidatedScans?.allConsolidatedScans);
  const scannedBrands = useSelector(({ consolidatedScans }: any) => consolidatedScans?.scannedBrands);
  const scannedProducts = useSelector(({ consolidatedScans }: any) => consolidatedScans?.scannedProducts);
  const isReduxLoader = useSelector(({ consolidatedScans }: any) => consolidatedScans?.isLoader);
  // const errorMessage         = useSelector(({consolidatedScans}:any) => consolidatedScans?.errorMessage);

  const [searchText, setSearchText] = useState<string>("");
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [dateErrMsg, setDateErrMsg] = useState<string>("");
  const [partnerTypeList, setpartnerTypeList] = useState([
    { value: "Distributors", label: "Distributors" },
    { value: "Retailers", label: "Retailers" },
  ]);
  const [partnerType, setPartnerType] = useState({ type: "Retailers" });
  const [selectedDistributorName, setselectedDistributorName] = useState("");
  const [selectedBrandName, setselectedBrandName] = useState("");
  const [selectedDistributor, setselectedDistributor] = useState(0);
  const [selectedBrand, setselectedBrand] = useState(0);
  const [countryList, setcountryList] = useState([{}]);
  const [dynamicFields, setdynamicFields] = useState([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [overalltableIndex, setoveralltableIndex] = useState<number>(0);
  const [brandtableIndex, setbrandtableIndex] = useState<number>(0);
  const [producttableIndex, setproducttableIndex] = useState<number>(0);
  const [isAsc, setIsAsc] = useState<boolean>(true);
  const [soldbyid, setSoldbyid] = useState("");
  const [filterAppliedTime, setFilterAppliedTime] = useState(Number);
  const [overallScanSuccess, setOverallScanSuccess] = useState(Number);
  const [scannedBrandsSuccess, setScannedBrandsSuccess] = useState(Number);
  const [filterSuccess, setFilterSuccess] = useState(Number);
  const [selectedFilters, setSelectedFilters] = useState({
    productgroup: "ALL",
    geolevel1: "ALL",
    geolevel2: "ALL",
    lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
    lastmodifieddateto: new Date(),
    scanneddatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
    scanneddateto: moment(new Date()).format("YYYY-MM-DD"),
    scannedPeriod: "",
  });
  const [scannedPeriodsList, setscannedPeriodsList] = useState([
    { label: "Today", from: moment(new Date()).format("YYYY-MM-DD"), to: moment(new Date()).format("YYYY-MM-DD") },
    {
      label: "This week (Sun - Sat)",
      from: moment().startOf("week").format("YYYY-MM-DD"),
      to: moment().endOf("week").format("YYYY-MM-DD"),
    },
    {
      label: "Last 30 days",
      from: moment().subtract(30, "days").format("YYYY-MM-DD"),
      to: moment(new Date()).format("YYYY-MM-DD"),
    },
    {
      label: "This year (Jan - Dec)",
      from: moment().startOf("year").format("YYYY-MM-DD"),
      to: moment().endOf("year").format("YYYY-MM-DD"),
    },
    {
      label: "Prev. year (Jan - Dec)",
      from: moment().subtract(1, "years").startOf("year").format("YYYY-MM-DD"),
      to: moment().subtract(1, "years").endOf("year").format("YYYY-MM-DD"),
    },
    { label: "Custom", value: "" },
  ]);

  const [productCategories, setproductCategories] = useState([
    "ALL",
    "CORN SEED",
    "HERBICIDES",
    "FUNGICIDES",
    "INSECTICIDES",
  ]);
  const [retailerPopupData, setretailerPopupData] = useState({});

  useEffect(() => {
    if (commonErrorMessage) {
      Alert("warning", commonErrorMessage);
    }
  }, [commonErrorMessage]);

  useEffect(() => {
    getCountryList();
    dispatch(getGeoLocationFields());
    // Promise.all([dispatch(getGeoLocationFields()),dispatch(getGeographicLevel1Options())]).then((response) => {
    // });
    let data = {
      countrycode: userData?.countrycode,
      geolevel1: userData?.geolevel1,
      partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
      isfiltered: true,
    };
    dispatch(getOverallScans(data));
  }, []);

  useEffect(() => {
    setOverallScanSuccess(new Date().getTime());
  }, [allConsolidatedScans]);

  useEffect(() => {
    let id = allConsolidatedScans && allConsolidatedScans[0]?.soldbyid;
    let name = allConsolidatedScans && allConsolidatedScans[0]?.firstname + " " + allConsolidatedScans[0]?.lastname;
    setSoldbyid(id);
    if (name) {
      setselectedDistributorName(name);
    }
    setFilterSuccess(new Date().getTime());
  }, [overallScanSuccess]);

  useEffect(() => {
    if (soldbyid) {
      let filteredDatas = {};
      if (isFiltered) {
        filteredDatas = getFilteredDatas(filteredDatas);
      }
      dispatch(getScannedBrands(soldbyid, isFiltered, filteredDatas));
    } else {
      dispatch(setselectedBrandList([]));
      dispatch(setselectedProductList([]));
      setselectedDistributorName("");
    }
  }, [filterSuccess]);

  useEffect(() => {
    setselectedBrandName(scannedBrands && scannedBrands[0]?.productbrand);
    setScannedBrandsSuccess(new Date().getTime());
  }, [scannedBrands]);

  useEffect(() => {
    let filteredDatas = {};
    if (isFiltered) {
      filteredDatas = getFilteredDatas(filteredDatas);
    }
    dispatch(getScannedProducts(soldbyid, isFiltered, selectedBrandName, filteredDatas));
  }, [scannedBrandsSuccess]);

  useEffect(() => {
    if (searchText.length >= 3 || searchText.length === 0) {
      let data = {
        countrycode: userData?.countrycode,
        geolevel1: userData?.geolevel1,
        partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
        isfiltered: true,
        searchtext: searchText,
      };
      let filteredDatas = {};
      if (isFiltered) {
        filteredDatas = getFilteredDatas(filteredDatas);
        data = { ...data, ...filteredDatas };
      }
      dispatch(getOverallScans(data));
    }
  }, [searchText, partnerType, filterAppliedTime]);

  const getSelectedBrands = (soldbyidd: string, idx?: any, type?: string, productbrand?: any) => {
    setSoldbyid(soldbyidd);
    if (type === "selected") {
      setselectedDistributor(idx);
      setselectedBrand(0);
    }
    allConsolidatedScans?.forEach((item: any, index: number) => {
      if (item.soldbyid === soldbyidd) {
        setselectedDistributorName(item.firstname + " " + item.lastname);
      }
    });
    setselectedBrandName(productbrand);
    setFilterSuccess(new Date().getTime());
  };

  const getSelectedProducts = (soldby: string, productbrand: string, idx: number) => {
    let filteredDatas = {};
    if (isFiltered) {
      filteredDatas = getFilteredDatas(filteredDatas);
    }
    dispatch(getScannedProducts(soldby, isFiltered, productbrand, filteredDatas));
    setselectedBrand(idx);
    scannedBrands?.forEach((item: any, index: number) => {
      if (item.productbrand === productbrand && item.soldbyid === soldbyid) {
        setselectedBrandName(item.productbrand);
      }
    });
  };
  const getFilteredDatas = (filteredDatas: {}) => {
    let {
      scanneddatefrom,
      scanneddateto,
      productgroup,
      geolevel1,
      geolevel2,
      scannedPeriod,
      lastmodifieddatefrom,
      lastmodifieddateto,
    }: any = selectedFilters;
    let startDate = scannedPeriod === "Custom" ? lastmodifieddatefrom : scannedPeriod === "" ? null : scanneddatefrom;
    let endDate = scannedPeriod === "Custom" ? lastmodifieddateto : scannedPeriod === "" ? null : scanneddateto;
    if (isFiltered) {
      filteredDatas = {
        scanneddatefrom: startDate ? moment(startDate).format("YYYY-MM-DD") : null,
        scanneddateto: endDate ? moment(endDate).format("YYYY-MM-DD") : null,
        productgroup: productgroup === "ALL" ? null : productgroup,
        geolevel1: geolevel1 === "ALL" ? null : userData?.geolevel1,
        geolevel2: geolevel2 === "ALL" ? null : geolevel2,
        scannedPeriod: scannedPeriod,
      };
    }
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
    geographicFields?.forEach((list: any, i: number) => {
      setFormArray.push({
        name: list,
        placeHolder: true,
        value: list === "geolevel1" && userrole === "RSM" ? usergeolevel1 : "ALL",
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
    let newvalue = { label: value, name: value };
    let dynamicFieldVal: any = dynamicFields;
    if (type === "geolevel1") {
      let filteredLevel1: any = geolevel1List?.filter((level1: any) => level1.name === value);
      let level2Options: any = [];
      filteredLevel1[0]?.geolevel2.forEach((item: any) => {
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
      partnertype: partnerType.type === "Retailers" ? "RETAILER" : "DISTRIBUTOR",
      downloadtype: type,
      searchtext: searchText || null,
      isfiltered: isFiltered,
    };
    let filteredDatas = {};
    if (isFiltered) {
      filteredDatas = getFilteredDatas(filteredDatas);
      data = { ...data, ...filteredDatas };
    }
    if (type === "overall") {
      type = "Overall_Scans";
    } else if (type === "brand") {
      type = "BrandWise_Scans";
    } else if (type === "product") {
      type = "ProductWise_Scans";
    }
    dispatch(downloadFile(data, type, "consolidatedScans"));
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
      val["scanneddatefrom"] = itemList?.from;
      val["scanneddateto"] = itemList?.to;
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
    if (e.name === "partnerType") {
      setPartnerType({
        type: selectedOption.value,
      });
    } else {
      setSelectedFilters({ ...selectedFilters, [e.name]: selectedOption.value });
    }
    let condOptionName = optionName?.includes("geolevel") ? "selected" + _.capitalize(optionName) + "Options" : optionName;
    setselectedDistributor(0);
    setselectedBrand(0);
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

  interface IProps {
    onChange?: any;
    placeholder?: any;
    value?: any;
    id?: any;
    onClick?: any;
    // any other props that come into the component
  }

  const ref = React.createRef();
  const DateInput = React.forwardRef(({ onChange, placeholder, value, id, onClick }: IProps, ref: any) => (
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

  const handleDateChange = (date: any, name: string) => {
    let val = selectedFilters;
    // to date
    if (name === "lastmodifieddateto") {
      if (date >= val.lastmodifieddatefrom) {
        setDateErrMsg("");
      } else if (date <= val.lastmodifieddatefrom) {
        setDateErrMsg("End Date should be greater than Start Date");
      } else {
        setDateErrMsg("Start Date should be lesser than  End Date");
      }
    }
    // from date
    if (name === "lastmodifieddatefrom") {
      if (date <= val.lastmodifieddateto) {
        setDateErrMsg("");
      } else if (date >= val.lastmodifieddateto) {
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
      dispatch(setOverallList(response));
    } else if (table === "scannedBrands") {
      dispatch(setselectedBrandList(response));
    } else if (table === "scannedProducts") {
      dispatch(setselectedProductList(response));
    }
    setIsAsc(!isAsc);
  };

  const handleSort = (e: any, columnname: string, allConsolidatedScans: any, isAsc: boolean, table: string) => {
    if (table === "overallScans") {
      setoveralltableIndex(e.currentTarget.cellIndex);
      setbrandtableIndex(1);
      setproducttableIndex(1);
      // console.log('###', overalltableIndex)
    } else if (table === "scannedBrands") {
      setbrandtableIndex(e.currentTarget.cellIndex);
      setoveralltableIndex(1);
      setproducttableIndex(1);
      // console.log('###brands', brandtableIndex)
    } else if (table === "scannedProducts") {
      setproducttableIndex(e.currentTarget.cellIndex);
      setoveralltableIndex(1);
      setbrandtableIndex(1);
    }
    onSort(columnname, allConsolidatedScans, isAsc, table);
  };

  const handleUpdateRetailer = (value: object) => {
    setretailerPopupData(value);
  };
  const resetFilter = (e: any) => {
    // let conditionIsFilter = searchText ? true : false;
    getDynamicOptionFields("reset");
    setSelectedFilters({
      productgroup: "ALL",
      geolevel1: "ALL",
      geolevel2: "ALL",
      lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 6),
      lastmodifieddateto: new Date(),
      scanneddatefrom: moment().subtract(30, "days").format("YYYY-MM-DD"),
      scanneddateto: moment(new Date()).format("YYYY-MM-DD"),
      scannedPeriod: "",
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
          <div className="filterSection col-sm-12">
            <label className="font-weight-bold">Consolidated Scans</label>
            <Filter
              handleSearch={handleSearch}
              searchText={searchText}
              partnerTypeList={partnerTypeList}
              selectedPartnerType={partnerType}
              isPartnerType={true}
              downloadPopup={true}
              isDownload={true}
              handlePartnerChange={handleReactSelect}
              toolTipText="Search applicable for Partner Name/ID"
              download={download}
              onClose={(node: any) => {
                closeToggle = node;
              }}
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
                        showYearDropdown
                        dropdownMode="select"
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
                        showYearDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
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
                    <img src={ArrowIcon} className="arrow-i" alt="" /> <img src={RtButton} className="layout" alt="" />
                  </span>
                </button>
              </div>
            </Filter>
          </div>
        </div>
        <div className="row" style={{ opacity: "0.9999" }}>
          <div className="col-sm-6">
            <OverallScans
              allConsolidatedScans={allConsolidatedScans}
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
            />
          </div>
          <div className="col-sm-6">
            <div>
              <ProductBrandList
                selectedBrandList={scannedBrands}
                getSelectedProducts={getSelectedProducts}
                distributorName={selectedDistributorName}
                selectedBrand={selectedBrand}
                handleSort={handleSort}
                isAsc={isAsc}
                tableCellIndex={brandtableIndex}
                tableName={"scannedBrands"}
              />
            </div>
            <div>
              <ProductList
                selectedProductList={scannedProducts}
                brandName={selectedBrandName}
                handleSort={handleSort}
                isAsc={isAsc}
                tableCellIndex={producttableIndex}
                tableName={"scannedProducts"}
              />
            </div>
          </div>
        </div>
      </div>
    </AUX>
  );
};

export default ConsolidatedScans;
