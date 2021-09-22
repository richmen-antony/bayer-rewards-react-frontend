/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState,useCallback } from "react";
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import AUX from "../../hoc/Aux_";
import Filter from "../../containers/grid/Filter";
import OverallInventory  from './OverallInventory';
import BrandwiseInventory from './BrandwiseInventory';
import ProductwiseInventory from './ProductwiseInventory'
import { Button} from "reactstrap";
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
	downloadScansCsvFile
  } from '../../redux/actions/common/common';
import {
	getOverallInventory,
	getBrandwiseInventory,
	getProductwiseInventory,
	setBrandwiseInventory,
	setProductwiseInventory,
	setOverallInventory
} from '../../redux/actions/inventory/inventory';
import ReactSelect from "../../utility/widgets/dropdown/ReactSelect";
import _ from "lodash";
import * as myConstClass from "../../utility/constant";

let obj: any = getLocalStorageData("userData");
let userData = JSON.parse(obj);

const Inventory = (Props: any) => {
	let package_type = myConstClass.package_type;

    let closeToggle: any;
	const dispatch             = useDispatch();
	const geolevel1List        = useSelector(({common}:any) => common?.geoLevel1List);
	const geographicFields     = useSelector(({common}:any) => common?.geographicFields);
	const levelsName           = useSelector(({common}:any) => common?.levelsName);
	const commonErrorMessage   = useSelector(({common}:any) => common?.errorMessage);
	const allConsolidatedInventory = useSelector(({inventory}:any) => inventory?.allConsolidatedInventory);
	const BrandwiseInventories        = useSelector(({inventory}:any) => inventory?.BrandwiseInventory);
	const ProductwiseInventories      = useSelector(({inventory}:any) => inventory?.ProductwiseInventory);
	const isReduxLoader        = useSelector(({inventory}:any) => inventory?.isLoader);
	// const errorMessage         = useSelector(({consolidatedScans}:any) => consolidatedScans?.errorMessage);

	const [searchText, setSearchText]                          = useState<string>("");
	const [isLoader, setIsLoader]                              = useState<boolean>(false);
	const [dateErrMsg, setDateErrMsg]                          = useState<string>("");
	const [partnerTypeList, setpartnerTypeList]                = useState(["Retailers", "Distributors"]);
	const [partnerType, setPartnerType]                        = useState({ type: "Distributors" });
	const [selectedDistributorName,setselectedDistributorName] = useState('');
	const [selectedBrandName,setselectedBrandName]             = useState('');
	const [selectedDistributor,setselectedDistributor]         = useState(0);
	const [selectedBrand,setselectedBrand]                     = useState(0);
	const [countryList,setcountryList]                         = useState([{}]);
	const [dynamicFields, setdynamicFields]                    = useState([]);
	const [isFiltered, setIsFiltered]                          = useState<boolean>(true);
	const [overalltableIndex, setoveralltableIndex]            = useState<number>(0);
	const [brandtableIndex, setbrandtableIndex]                = useState<number>(0);
	const [producttableIndex, setproducttableIndex]            = useState<number>(0);
	const [isAsc, setIsAsc]                                    = useState<boolean>(true);
	const [soldbyid,setSoldbyid]                               = useState('');
	const [filterAppliedTime,setFilterAppliedTime]             = useState(Number);
	const [overallScanSuccess,setOverallScanSuccess]           = useState(Number);
	const [scannedBrandsSuccess,setScannedBrandsSuccess]       = useState(Number);
	const [filterSuccess,setFilterSuccess]                     = useState(Number);
	const [fiscalYear, setFiscalYear]                      = useState(new Date().getFullYear())
	const [packageType, setPackageType]                      = useState(package_type[0])

	const [selectedFilters, setSelectedFilters]                = useState({
			productgroup: "ALL",
			geolevel1: "ALL",
			geolevel2: "ALL",
			lastmodifieddatefrom: new Date(new Date().getFullYear(), 0, 1),
			lastmodifieddateto: new Date(new Date().getFullYear(), 11, 31),
			scanneddatefrom: new Date(new Date().getFullYear(), 0, 1),
			scanneddateto: new Date(new Date().getFullYear(), 11, 31),
			scannedPeriod: "All Months",
	  });

	  const [scannedPeriodsList, setscannedPeriodsList]         = useState([
		{
			label: "All Months",
			from :moment(selectedFilters.lastmodifieddatefrom).format("YYYY-MM-DD"),
			// from: moment().startOf("year").format("YYYY-MM-DD"),
			to: moment(selectedFilters.lastmodifieddateto).format("YYYY-MM-DD"),
		},
		{ label: "Custom", value: "" },
	]);


	const [selectedFromDateOfYear,setSelectedFromDateOfYear] = useState(`01/01/${new Date().getFullYear()}`);
	const [selectedToDateOfYear,setSelectedToDateOfYear] = useState(`12/31/${new Date().getFullYear()}`);
	
	const [productCategories, setproductCategories]             = useState([
		"ALL", "CORN SEED", "HERBICIDES", "FUNGICIDES", "INSECTICIDES"
	]);
	const [retailerPopupData,setretailerPopupData]              = useState({});


	let i = 2018;
	let year = [];
	for ( i === 2018; i <= new Date().getFullYear(); i++) {
        let yearObj = { label : i , value : i};
		year.push(yearObj);
	}
    year.reverse();	

	let packType:any = [];
	package_type.forEach((type:string) => {
		let packageObj = { label : type, value : type};
		packType.push(packageObj);
	})

	useEffect(()=>{
		if(commonErrorMessage) {
			Alert("warning", commonErrorMessage);
		}
	},[commonErrorMessage])
  
	useEffect(()=>{
		getCountryList();
		Promise.all([dispatch(getGeoLocationFields()),dispatch(getGeographicLevel1Options())]).then((response) => {
		});
		let data = {
			countrycode : userData?.countrycode,
			partnertype : (partnerType.type === "Retailers") ? "RETAILER" : "DISTRIBUTOR",
			isfiltered  : isFiltered,
		};
		let filteredDatas = {};

		filteredDatas = getFilteredDatas(filteredDatas);
		data = { ...data, ...filteredDatas };

		dispatch(getOverallInventory(data));
	},[]);

	useEffect(()=>{
		setOverallScanSuccess(new Date().getTime());
	},[allConsolidatedInventory])

	useEffect(()=>{
		let id = allConsolidatedInventory && allConsolidatedInventory[0]?.rtmppartnerid;
		let name = allConsolidatedInventory && allConsolidatedInventory[0]?.firstname+' '+allConsolidatedInventory[0]?.lastname;
		setSoldbyid(id);
		if(name){
			setselectedDistributorName(name);
		}
		setFilterSuccess(new Date().getTime())
	},[overallScanSuccess]);

	useEffect(()=>{
		if(soldbyid) {
			let filteredDatas = {};
			if(isFiltered) {
				filteredDatas = getFilteredDatas(filteredDatas);
			}
			dispatch(getBrandwiseInventory(soldbyid,isFiltered,filteredDatas));
		} else {
			dispatch(setBrandwiseInventory([]));
			dispatch(setProductwiseInventory([]));
			setselectedDistributorName('');
		}
	},[filterSuccess]);

	useEffect(()=>{
		if (BrandwiseInventories?.length > 0) {
			setselectedBrandName(BrandwiseInventories && BrandwiseInventories[0]?.productbrand);
			setScannedBrandsSuccess(new Date().getTime());
		}
	},[BrandwiseInventories]);

	useEffect(()=>{
		let filteredDatas = {};
			if(isFiltered) {
				filteredDatas = getFilteredDatas(filteredDatas);
			}
		dispatch(getProductwiseInventory(soldbyid,isFiltered, selectedBrandName,filteredDatas));
	},[scannedBrandsSuccess])

	useEffect(()=>{
		if ( searchText.length >= 3 || searchText.length === 0) {
			let data = {
				countrycode  : userData?.countrycode,
				partnertype  : (partnerType.type === "Retailers") ? "RETAILER" : "DISTRIBUTOR",
				isfiltered   : isFiltered,
				searchtext   : searchText
			};
			let filteredDatas = {};
			if(isFiltered) {
				filteredDatas = getFilteredDatas(filteredDatas);
				data = { ...data, ...filteredDatas };
			}
			dispatch(getOverallInventory(data));
		}
	},[searchText, partnerType,filterAppliedTime, fiscalYear, packageType])

	const getSelectedBrands = (soldbyidd : string, idx?:any, type?:string, productbrand?:any)=>{
		setSoldbyid(soldbyidd);
		if ( type === 'selected' ) {
			setselectedDistributor(idx);
			setselectedBrand(0);
		}
		allConsolidatedInventory?.forEach((item:any,index:number)=>{
			if( item.soldbyid === soldbyidd) {
				setselectedDistributorName(item.firstname+' '+ item.lastname);
			}
		})
		setselectedBrandName(productbrand);
		setFilterSuccess(new Date().getTime())
	};

	const getSelectedProducts = (soldby : string, productbrand:string, idx:number) => {
		let filteredDatas = {};
			if(isFiltered) {
				filteredDatas = getFilteredDatas(filteredDatas);
			}
		dispatch(getProductwiseInventory(soldby,isFiltered, productbrand,filteredDatas));
		setselectedBrand(idx);
		BrandwiseInventories?.forEach((item:any,index:number) => {
			if( item.productbrand === productbrand && item.rtmppartnerid === soldbyid) {
				setselectedBrandName(item.productbrand);
			}
		})
	}
	const getFilteredDatas = (filteredDatas:{}) => {
		let { scanneddatefrom ,scanneddateto ,productgroup,geolevel1,geolevel2,scannedPeriod,lastmodifieddatefrom,lastmodifieddateto  }:any = selectedFilters;
		let startDate = scannedPeriod === "Custom" ? lastmodifieddatefrom : scannedPeriod === "" ? null : scanneddatefrom;
		let endDate   = scannedPeriod === "Custom" ? lastmodifieddateto : scannedPeriod === "" ? null : scanneddateto;
			if(isFiltered) {
				filteredDatas = {
					scanneddatefrom : startDate ? moment(startDate).format("YYYY-MM-DD") : null,
					scanneddateto   : endDate ? moment(endDate).format("YYYY-MM-DD") : null,
					productgroup    : productgroup === "ALL" ? null : productgroup,
					geolevel1       :  geolevel1 === "ALL" ? null : userData?.geolevel1,
					geolevel2       : geolevel2 === "ALL" ? null : geolevel2,
					scannedPeriod   : scannedPeriod,
					pkglevel        : "SKU"
				}
			}
		return filteredDatas;
	}

	const getCountryList = ()=> {
		let res = [
		  { value: "India", text: "India" },
		  { value: "Malawi", text: "Malawi" },
		];
		setcountryList(res);
	}

	useEffect(()=>{
		getDynamicOptionFields();
	},[geographicFields]);

	const getDynamicOptionFields = (reset?: string) => {
		let level1List:any = geolevel1List;
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
		if (userrole === "RSM" ){
			let filteredLevel1:any = geolevel1List?.filter((list:any) => list.name === userData?.geolevel1);
			filteredLevel1 && filteredLevel1[0]?.geolevel2?.forEach((item: any) => {
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
			let level1Info = { label: "ALL", value :"ALL" };
			level2Options.push(level1Info);
		}
		let usergeolevel1 = userData?.geolevel1;
		let geolevel1Obj = { label : usergeolevel1, value : usergeolevel1};
		geographicFields?.forEach((list: any, i: number) => {
			setFormArray.push({
				name: list,
				placeHolder: true,
				value: (list ===  "geolevel1" && userrole === "RSM") ? geolevel1Obj : {label: "ALL",value: "ALL"},
				options:
					list === "geolevel0"
						? countryList
						: list === "geolevel1"
						? level1Options
						: list === "geolevel2"
						? level2Options
						: [{ label: "ALL",value: "ALL" }],
				error: "",
			});
		});
		setdynamicFields(setFormArray);
	};

	const getOptionLists = (cron: any, type: any, value: any, index: any) => {
		let newvalue = {label : value, name : value};
		let dynamicFieldVal:any = dynamicFields;
		if (type === "geolevel1") {
			let filteredLevel1:any = geolevel1List?.filter((level1: any) => level1.name === value);
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
			dynamicFieldVal[index].value = newvalue;
			dynamicFieldVal[index + 1].value = {label: "ALL",value: "ALL"};
			dynamicFieldVal[index + 2].value = {label: "ALL",value: "ALL"};
			setdynamicFields(dynamicFieldVal);
			setSelectedFilters({...selectedFilters, geolevel2: "ALL"});
		} else if (type === "geolevel2") {
			dynamicFieldVal[index].value = newvalue;
			setdynamicFields(dynamicFieldVal);
		}
	};

	const handleSearch = (e:any) => {
		let searchText = e.target.value;
		setSearchText(searchText);
		let timeOut: any;
		if (timeOut) {
		  clearTimeout(timeOut);
		}
		setIsFiltered(true);
	}

	const download = (type:string) => {
		let data = {
			countrycode  : userData?.countrycode,
			partnertype  : (partnerType.type === "Retailers") ? "RETAILER" : "DISTRIBUTOR",
			downloadtype : type,
			searchtext   : searchText || null,
			isfiltered   : isFiltered
		};
		let filteredDatas = {};
		if(isFiltered) {
			filteredDatas = getFilteredDatas(filteredDatas);
			data = { ...data, ...filteredDatas };
		}
		if( type === 'overall') {
			type = 'Overall_Scans'
		} else if(type === 'brand') {
			type = 'BrandWise_Scans'
		} else if(type === 'product') {
			type = 'ProductWise_Scans'
		}
		dispatch(downloadScansCsvFile(data, type));
	}

	const handlePartnerChange = (name: string) => {
		setPartnerType({
			type: name,
		});
		setselectedDistributor(0);
		setselectedBrand(0);
	};
	
	const handleFilterChange = (e: any, name: string, item: any, itemList?: any) => {
		e.stopPropagation();
		let val:any = selectedFilters;
		let flag = false;
		if (name === "type") {
			val[name] = e.target.value;
			flag = true;
		} else if (name === "scannedPeriod" && item !== "Custom") {
		
			val["scanneddatefrom"] = new Date(fiscalYear, 0, 1);
			val["scanneddateto"] = new Date(fiscalYear, 11, 31);
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
		if(e.name === 'fiscalYear') {
            setFiscalYear(selectedOption.value);
			setSelectedFromDateOfYear(`01/01/${selectedOption.value}`);
			setSelectedToDateOfYear(`12/31/${selectedOption.value}`);
			let fiscalStartDate= new Date(selectedOption.value, 0, 1);
			let fiscalEndDate= new Date(selectedOption.value, 11, 31);
			setSelectedFilters({...selectedFilters, lastmodifieddatefrom: fiscalStartDate,lastmodifieddateto : fiscalEndDate, scanneddatefrom :  fiscalStartDate , scanneddateto :  fiscalEndDate});
        } else if (e.name === 'packageType') {
			setPackageType(selectedOption.value);
        } else {
			setSelectedFilters({...selectedFilters, [e.name]: selectedOption.value});
		}

	};
	console.log('selectedFilters', selectedFilters)

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
								isDisabled = {list.name === "geolevel1" }
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
	const DateInput = React.forwardRef(
	  ({ onChange, placeholder, value, id, onClick }: IProps, ref: any) => (
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
	  )
	);

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
		closeToggle&&closeToggle();
	};

	const onSort = (name: string, data: any, isAsc: boolean,table:string) => {
		let response: any = sortBy(name, data);
		if(table === "overallScans"){
			dispatch(setOverallInventory(response));
		} else if (table === "BrandwiseInventory") {
			dispatch(setBrandwiseInventory(response));
		} else if(table === "ProductwiseInventory") {
			dispatch(setProductwiseInventory(response));
		}
		setIsAsc(!isAsc);
	};

	const handleSort = (
		e: any,
		columnname: string,
		allConsolidatedInventory: any,
		isAsc: boolean,
		table : string
	  ) => {
		if(table === "overallScans"){
			setoveralltableIndex(e.currentTarget.cellIndex);
			setbrandtableIndex(1);
			setproducttableIndex(1);
			// console.log('###', overalltableIndex)
		} else if (table === "BrandwiseInventory") {
			setbrandtableIndex(e.currentTarget.cellIndex);
			setoveralltableIndex(1);
			setproducttableIndex(1);
			// console.log('###brands', brandtableIndex)
		} else if(table === "ProductwiseInventory") {
			setproducttableIndex(e.currentTarget.cellIndex);
			setoveralltableIndex(1);
			setbrandtableIndex(1);
		}
		  onSort(columnname, allConsolidatedInventory, isAsc,table);
	};

	const handleUpdateRetailer = (value: object) => {
		setretailerPopupData(value)
	}
	const resetFilter = (e: any) => {
		let fiscalStartDate= new Date(fiscalYear, 0, 1);
			let fiscalEndDate= new Date(fiscalYear, 11, 31);
		// let conditionIsFilter = searchText ? true : false;
		const options:any = { value: "ALL", label: "ALL" };
		getDynamicOptionFields("reset");
		setSelectedFilters({
			productgroup: "ALL",
			geolevel1: "ALL",
			geolevel2: "ALL",
			lastmodifieddatefrom: fiscalStartDate,
			lastmodifieddateto: fiscalEndDate,
			scanneddatefrom: fiscalStartDate,
			scanneddateto: fiscalEndDate,
			scannedPeriod: "All Months",
		});
		setDateErrMsg("");
		setFilterAppliedTime(new Date().getTime());
		setselectedDistributor(0);
		setselectedBrand(0);
		closeToggle&&closeToggle();
	};

	return (

        <AUX>
			{(isLoader || isReduxLoader) && <Loader />}
            <div className="consolidatedSales-container">
                <div className="row">
                    <div className="filterSection col-sm-12">
                        <label className="font-weight-bold">Distributor Inventory</label>
                        <Filter
                            handleSearch={handleSearch}
                            searchText={searchText}
                            // partnerTypeList={partnerTypeList}
                            // selectedPartnerType={partnerType}
							downloadPopup={true}
                            isDownload={true}
                            handlePartnerChange={handlePartnerChange}
                            toolTipText="Search applicable for Partner Name/ID"
							download={download}
							onClose={(node: any) => {
								closeToggle = node;
							}}
							fiscalYear={fiscalYear}
							handleReactSelect={handleReactSelect}
							yearOptions = {year}
							isCustomDropdown = {true}
							packageType ={packageType}
							packageTypeOptions ={packType}
							isUploadAvailable={true}
					    >
						<label className="font-weight-bold pt-2">Product Group</label>
							<div className="form-group pt-1">
								{productCategories.map((item: any, i: number) => (
									<span className="mr-2 chipLabel" key={i}>
										<Button
											color={
												selectedFilters.productgroup === item
													? "btn activeColor rounded-pill"
													: "btn rounded-pill boxColor"
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
													minDate ={new Date(selectedFromDateOfYear)}
													maxDate={new Date(selectedToDateOfYear)}
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
													minDate ={new Date(selectedFromDateOfYear)}
													maxDate={new Date(selectedToDateOfYear)}
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
										disabled={ dateErrMsg ? true : false}
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
                <div className="row" style={{ opacity : '0.9'}}>
					<div className = "col-sm-6">
						<OverallInventory allConsolidatedInventory={allConsolidatedInventory} getSelectedBrands={getSelectedBrands} selectedDistributor={selectedDistributor} handleSort={handleSort} 
						isAsc={isAsc} tableCellIndex={overalltableIndex} tableName={'overallScans'} handleUpdateRetailer={handleUpdateRetailer} retailerPopupData={retailerPopupData} partnerType = {partnerType} setSearchText={setSearchText} setIsFiltered={setIsFiltered} />
					</div>
					<div className = "col-sm-6">
						<div>
							<BrandwiseInventory selectedBrandList={BrandwiseInventories} getSelectedProducts ={getSelectedProducts}  distributorName={selectedDistributorName} selectedBrand={selectedBrand} handleSort={handleSort} isAsc={isAsc} tableCellIndex={brandtableIndex} tableName={'BrandwiseInventory'} />
						</div>
						<div>
							<ProductwiseInventory selectedProductList = {ProductwiseInventories} brandName={selectedBrandName} handleSort={handleSort} isAsc={isAsc} tableCellIndex={producttableIndex} tableName={'ProductwiseInventory'} />
						</div>
					</div>
                </div>
            </div>
        </AUX>
    )
}

export default Inventory;

