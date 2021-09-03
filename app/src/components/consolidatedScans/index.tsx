/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState,useCallback } from "react";
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AUX from "../../hoc/Aux_";
import Filter from "../../container/grid/Filter";
import OverallScans  from './OverallScans';
import ProductBrandList from './ProductBrandList';
import ProductList from './ProductList';
import { Button} from "reactstrap";
import { NativeDropdown } from "../../utility/widgets/dropdown/NativeSelect";
import { apiURL } from "../../utility/base/utils/config";
import { sortBy } from "../../utility/base/utils/tableSort";
import { Alert } from "../../utility/widgets/toaster";
import Pagination from "../../utility/widgets/pagination";
import Loader from "../../utility/widgets/loader";
import {
  invokeGetAuthService,
  invokePostAuthService,
} from "../../utility/base/service";
import { getLocalStorageData } from "../../utility/base/localStore";
import CalenderIcon from "../../assets/icons/calendar.svg";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import {
	getGeographicLevel1Options,
	getGeoLocationFields
  } from '../../redux/actions/common/common';
  import ReactSelect from "../../utility/widgets/dropdown/ReactSelect";
  import _ from "lodash";

let levelsName: any = [];

const ConsolidatedScans = (Props: any) => {
	// const dispatch            = useDispatch();
	// const geoLevel1List        = useSelector(({common}:any) => common?.geoLevel1List);
	const [searchText, setSearchText] = useState<string>("");
	const [retailerOptions, setRetailerOptions] = useState<string[]>([]);
	const [optionslist, setOptionslist] = useState([]);
	const [isLoader, setIsLoader] = useState<boolean>(false);
	const [dateErrMsg, setDateErrMsg] = useState<string>("");
	const [dropdownOpenFilter,setdropdownOpenFilter] = useState(false);
	const [partnerTypeList, setpartnerTypeList] = useState(["Retailers", "Distributors"]);
	const [partnerType, setPartnerType] = useState({ type: "Retailers" });
	const [selectedBrandList,setselectedBrandList] = useState([{}]);
	const [selectedProductList,setselectedProductList] = useState([{}]);
	const [selectedDistributorName,setselectedDistributorName] = useState('');
	const [selectedBrandName,setselectedBrandName] = useState('');
	const [selectedDistributor,setselectedDistributor] = useState(0);
	const [selectedBrand,setselectedBrand] = useState(0);
	const [productCategories, setproductCategories] = useState([
		"ALL", "HYBRID", "CORN SEED", "HERBICIDES", "FUNGICIDES", "INSECTICIDES"
	])

	const [countryList,setcountryList] = useState([{}]);
	const [geographicFields, setgeographicFields] = useState([]);
	const [dynamicFields, setdynamicFields] = useState([]);
	const [level1Options,setlevel1Options] = useState([]);
	const [geolevel1List,setgeolevel1List] = useState([]);
	const [scannedPeriodsList, setscannedPeriodsList] = useState([
		{label: "Today", value: ""},
		{ label: "This week (Sun - Sat)", value: "" },
		{ label: "Last 30 days", value: "" },
		{ label: "This year (Jan - Dec)", value: "" },
		{ label: "Prev. year (Jan - Dec)", value: "" },
		{ label: "Custom", value: "" },
	]);
	const [isFiltered, setIsFiltered] = useState<boolean>(false);
	const [overalltableIndex, setoveralltableIndex] = useState<number>(0);
	const [brandtableIndex, setbrandtableIndex] =useState<number>(0);
	const [producttableIndex, setproducttableIndex] = useState<number>(0);
	const [isAsc, setIsAsc] = useState<boolean>(true);

	const [selectedFilters, setSelectedFilters] = useState({
			productgroup: "ALL",
			status: "ALL",
			geolevel1: "ALL",
			geolevel2: "ALL",
			lastmodifieddatefrom: new Date().setMonth(new Date().getMonth() - 3),
			lastmodifieddateto: new Date(),
			partnerType: "Retailers",
			scannedPeriod: "Today",
	  });
	  const [distributorScans,setdistributorScans] = useState([
			{
				"distributorId" : 1,
				"name" : "vidhya",
				"sendgoods" : 3131,
				"receivegoods" : 3243,
				"walkinsales" : 432,
				"advisorsales" :434,
				"label" : "GCHPU"
			},
			{
			  "distributorId" : 2,
				"name" : "demo",
				"sendgoods" : 343,
				"receivegoods" : 89,
				"walkinsales" : 978,
				"advisorsales" :65,
				"label" : "RANDM"
			},
			{
			  "distributorId" : 3,
			  "name" : "demo1",
			  "sendgoods" : 343,
			  "receivegoods" : 89,
			  "walkinsales" : 978,
			  "advisorsales" :65,
			  "label" : "DHUHN"
		  },
		  {
			  "distributorId" : 4,
			  "name" : "demo2",
			  "sendgoods" : 343,
			  "receivegoods" : 89,
			  "walkinsales" : 978,
			  "advisorsales" :65,
			  "label" : "AMJKHJ"
		  },
		  {
			"distributorId" : 5,
			"name" : "demo2",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65,
			"label" : "AMJKHJ" 
		},
		{
		  "distributorId" : 6,
		  "name" : "demo2",
		  "sendgoods" : 343,
		  "receivegoods" : 89,
		  "walkinsales" : 978,
		  "advisorsales" :65,
		  "label" : "RANDM" 
	  },
	  {
		"distributorId" : 7,
		"name" : "demo2",
		"sendgoods" : 343,
		"receivegoods" : 89,
		"walkinsales" : 978,
		"advisorsales" :65,
		"label" : "RANDM"
	  },
	  {
		"distributorId" : 8,
		"name" : "demo2",
		"sendgoods" : 343,
		"receivegoods" : 89,
		"walkinsales" : 978,
		"advisorsales" :65,
		"label" : "GCHPU" 
	  },
		{
		  "distributorId" : 9,
		  "name" : "demo2",
		  "sendgoods" : 343,
		  "receivegoods" : 89,
		  "walkinsales" : 978,
		  "advisorsales" :65,
		  "label" : "GCHPU" 
		},
		{
		  "distributorId" : 10,
		  "name" : "demo2",
		  "sendgoods" : 343,
		  "receivegoods" : 89,
		  "walkinsales" : 978,
		  "advisorsales" :65,
		  "label" : "GCHPU" 
		},
		{
		  "distributorId" :11,
		  "name" : "demo2",
		  "sendgoods" : 343,
		  "receivegoods" : 89,
		  "walkinsales" : 978,
		  "advisorsales" :65,
		  "label" : "GCHPU"
		}]
	  );
	  const [scannedBrands,setscannedBrands] = useState([
		{
			"distributorId" : 1,
			"brandId" : 1,
			"brandname" : "brand1",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65 
		  },
		  {
			  "distributorId" : 1,
			  "brandId" : 2,
			  "brandname" : "arand2",
			  "sendgoods" : 343,
			  "receivegoods" : 89,
			  "walkinsales" : 978,
			  "advisorsales" :65 
			},
		  {
			"distributorId" : 2,
			"brandId" : 3,
			"brandname" : "brand3",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65 
		  },

		  {
			"distributorId" : 2,
			"brandId" : 4,
			"brandname" : "brand4",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65 
		  },
		  {
			  "distributorId" : 1,
			  "brandId" : 5,
			  "brandname" : "brand5",
			  "sendgoods" : 343,
			  "receivegoods" : 89,
			  "walkinsales" : 978,
			  "advisorsales" :65 
			},
			{
				"distributorId" : 1,
				"brandId" : 6,
				"brandname" : "brand6",
				"sendgoods" : 343,
				"receivegoods" : 89,
				"walkinsales" : 978,
				"advisorsales" :65 
			  },
	  ]);
	  const [scannedProducts,setscannedProducts] = useState([ 
		{
			"distributorId" :1,
			"brandId" : 1,
			"productId" : 1,
			"productname" : "product1",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65,
			"label" : 322324,
			"packagetype": "SKU" 
		  },
		  {
			"distributorId" :1,
			"brandId" : 1,
			"productId" : 2,
			"productname" : "product2",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65,
			"label" : 45454,
			"packagetype": "BOX" 
		  },
		  {
			"distributorId" : 1,
			"brandId" : 1,
			"productId" : 3,
			"productname" : "product3",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65,
			"label" : 322324,
			"packagetype": "SKU" 
		  },
		  {
			"distributorId" :1,
			"brandId" : 2,
			"productId" : 4,
			"productname" : "product4",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65,
			"label" : 322324,
			"packagetype": "SKU" 
		  },
		  {
			"distributorId" :2,
			"brandId" : 1,
			"productId" : 5,
			"productname" : "product5",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65,
			"label" : 322324,
			"packagetype": "BOX" 
		  },
		  {
			"distributorId" :2,
			"brandId" : 3,
			"productId" : 6,
			"productname" : "product6",
			"sendgoods" : 343,
			"receivegoods" : 89,
			"walkinsales" : 978,
			"advisorsales" :65, 
			"label" : 322324,
			"packagetype": "PALATTE"
		  },
	  ]);

	useEffect(()=>{
		// dispatch(getGeographicLevel1Options());
		let distributorId = distributorScans[0].distributorId;
		getSelectedBrands(distributorId);
		getCountryList();
		getHierarchyDatas();
		getGeographicFields();
	},[]);

	const getSelectedBrands = (distributorId : number, idx?:any, type?:string)=>{
		let allBrands = scannedBrands?.filter((brands:any) => brands.distributorId === distributorId);
		let allProducts = scannedProducts?.filter((product:any) => (product.distributorId === distributorId && allBrands[0]?.brandId === product.brandId));
		setselectedBrandList(allBrands);
		setselectedProductList(allProducts);
		setselectedBrandName(allBrands[0]?.brandname)

		if ( type === 'selected' ) {
			setselectedDistributor(idx);
			setselectedBrand(0);
		}
		distributorScans?.forEach((item:any,index:number)=>{
			if( item.distributorId === distributorId) {
				setselectedDistributorName(item.name);
			}
		})
	};

	const getSelectedProducts = (distributorId: number, brandId:number, idx:number, type?:String) => {
		let allProducts = scannedProducts?.filter((product:any) => (product.distributorId === distributorId && brandId === product.brandId));
		if ( type === 'selected' ) {
			setselectedBrand(idx);
		}
		scannedBrands?.forEach((item:any,index:number)=>{
			if( item.brandId === brandId && item.distributorId === distributorId) {
				setselectedBrandName(item.brandname);
			}
		})
		setselectedProductList(allProducts)
	}

	const getCountryList = ()=> {
		//service call
		let res = [
		  { value: "India", text: "India" },
		  { value: "Malawi", text: "Malawi" },
		];
		setcountryList(res);
	  }

	const getHierarchyDatas = () => {
		//To get all level datas
		setIsLoader(true);
		const { getHierarchyLevels } = apiURL;
		let localObj: any = getLocalStorageData("userData");
		let userData = JSON.parse(localObj);
		let countrycode = {
			countryCode: userData?.countrycode,
		};
		invokeGetAuthService(getHierarchyLevels, countrycode)
			.then((response: any) => {
				let geolevel1 = Object.keys(response.body).length !== 0 ? response.body.geolevel1 : [];
				setIsLoader(true);
				setgeolevel1List(geolevel1);

				// this.setState({ isLoader: false, geolevel1List: geolevel1 }, () => {
				// 	this.getGeographicFields();
				// });
			})
			.catch((error: any) => {
				setIsLoader(false);
				let message = error.message;
				Alert("warning", message);
			});
	}

	const getGeographicFields = () => {
		setIsLoader(true);
		const { getTemplateData } = apiURL;
		let localObj: any = getLocalStorageData("userData");
		let userData = JSON.parse(localObj);
		let countrycode = {
			countryCode: userData?.countrycode,
		};
		invokeGetAuthService(getTemplateData, countrycode)
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
					setIsLoader(false);
					setgeographicFields(levels);
					// getDynamicOptionFields();
				// this.setState(
				// 	{
				// 		isLoader: false,
				// 		geographicFields: levels,
				// 		locationData: levelsData,
				// 	},
				// 	() => {
				// 		this.getDynamicOptionFields();
				// 	}
				// );
			})
			.catch((error: any) => {
				setIsLoader(false);
				let message = error.message;
				Alert("warning", message);
			});
	}

	useEffect(()=>{
		// if(geographicFields.length > 0) {
			getDynamicOptionFields();
		// }
	},[geographicFields]);

	const getDynamicOptionFields = (reset?: string) => {
		let level1List:any = geolevel1List;
		if (!reset) {
			let allItem = { code: "ALL", name: "ALL", geolevel2: [] };
			level1List.unshift(allItem);
		}
		setgeolevel1List(level1List);
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
			let level1Info = { label: "ALL", value :"ALL" };
			level2Options.push(level1Info);
		}
		let usergeolevel1 = userData?.geolevel1;
		let geolevel1Obj = { label : usergeolevel1, value : usergeolevel1};
		geographicFields?.forEach((list: any, i: number) => {
			setFormArray.push({
				name: list,
				placeHolder: true,
				value: list ===  "geolevel1" && (userrole === "RSM") ? geolevel1Obj : {label: "ALL",value: "ALL"},
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
			console.log('filteredLevel1',filteredLevel1)
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
			// this.setState((prevState: any) => ({
			// 	dynamicFields: dynamicFieldVal,
			// 	selectedFilters: {
			// 		...prevState.selectedFilters,
			// 		geolevel2: "ALL",
			// 		geolevel3: "ALL",
			// 	},
			// }));

		} else if (type === "geolevel2") {
			dynamicFieldVal[index].value = newvalue;
			setdynamicFields(dynamicFieldVal);
			// this.setState((prevState: any) => ({
			// 	dynamicFields: dynamicFieldVal,
			// 	selectedFilters: {
			// 		...prevState.selectedFilters,
			// 		geolevel3: "ALL",
			// 	},
			// }));
		}
	};
	const handleSearch = () => {

	}
	const overallDownload = () => {

	}
	const brandWiseDownload = () => {

	}
	const productWiseDownload = () => {

	}
	const handlePartnerChange = () => {

	}

	const handleFilterChange = (e: any, name: string, item: any) => {
		e.stopPropagation();
		let val: any = selectedFilters;
		let flag = false;
		if (name === "type") {
		  val[name] = e.target.value;
		  flag = true;
		} else if (name === "lastmodifieddatefrom") {
		  if (e.target.value <= val.lastmodifieddateto) {
			val[name] = e.target.value;
			flag = true;
		  } else {
			setDateErrMsg("Start date should be lesser than End Date");
		  }
		} else if (name === "endDate") {
		  if (e.target.value > new Date().toISOString().substr(0, 10)) {
			setDateErrMsg("End Date should not be greater than todays date");
		  } else if (e.target.value <= val.lastmodifieddatefrom) {
			setDateErrMsg("End Date should be greater than Start Date");
		  } else {
			val[name] = e.target.value;
			flag = true;
		  }
		} else if (name === "isregionmapped") {
		  const a = item === "Mapped" ? true : item === "UnMapped" ? false : null;
		  val[name] = a;
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
	  
	// const handleGeolevelDropdown = (value: string, label: any) => {
	// 	setSelectedFilters((prevState) => ({
	// 		...selectedFilters,
	// 		[label.toLocaleLowerCase()]: value,
	// 	}))
	// };
	const handleReactSelect = (selectedOption: any, e: any, optionName: string) => {
		let condOptionName = optionName.includes("geolevel") ? "selected" + _.capitalize(optionName) + "Options" : optionName;
		console.log({ condOptionName });
		setSelectedFilters({...selectedFilters, [e.name]: selectedOption.value});

		// this.setState({
		// 	selectedFilters: {
		// 		...this.state.selectedFilters,
		// 		[e.name]: selectedOption.value,
		// 	},
		// 	[condOptionName]: selectedOption,
		// });
	};
	console.log('geographicfields',geographicFields);
	console.log('dynamicFields',dynamicFields);
	console.log('levelsName',levelsName)
	const fields = dynamicFields;
	const locationList = fields?.map((list: any, index: number) => {
		let nameCapitalized = levelsName[index]?.charAt(0).toUpperCase() + levelsName[index]?.slice(1);
		return (
			<React.Fragment key={`geolevels` + index}>
				{index !== 0 && list.name !== "geolevel3" && list.name !== "geolevel4" && list.name !== "geolevel5" && (
					<div className="col" style={{ marginBottom: "5px" }}>
						{/* <NativeDropdown
							name={list.name}
							label={nameCapitalized}
							options={list.options}
							handleChange={(e: any) => {
								e.stopPropagation();
								list.value = e.target.value;
								getOptionLists("manual", list.name, e.target.value, index);
								handleGeolevelDropdown(e.target.value, list.name);
							}}
							value={list.value}
							id="geolevel-test"
							dataTestId="geolevel-test"
						/> */}
						<ReactSelect
								name={list.name}
								label={`${nameCapitalized === "Add" ? "ADD" : nameCapitalized}`}
								options={list.options}
								handleChange={(selectedOptions: any, e: any) => {
									list.value = selectedOptions.value;
									getOptionLists("manual", list.name, selectedOptions.value, index);
									handleReactSelect(selectedOptions, e, list.name);
									// this.handleGeolevelDropdown(selectedOptions.value, list.name);
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
		// this.setState({ isFiltered: true, inActiveFilter: false }, () => {
		// 	this.getScanLogs();
		// 	this.toggleFilter();
		// });
	};

	const onSort = (name: string, data: any, isAsc: boolean,table:string) => {
		let response: any = sortBy(name, data);
		if(table === "overallScans"){
			setdistributorScans(response);
		} else if (table === "scannedBrands") {
			setselectedBrandList(response);
		} else if(table === "scannedProducts") {
			setselectedProductList(response)
		}
		setIsAsc(!isAsc);
	  };

	const handleSort = (
		e: any,
		columnname: string,
		distributorScans: any,
		isAsc: boolean,
		table : string
	  ) => {
		if(table === "overallScans"){
			setoveralltableIndex(e.currentTarget.cellIndex);
			setbrandtableIndex(1);
			setproducttableIndex(1);
			// console.log('###', overalltableIndex)
		} else if (table === "scannedBrands") {
			setbrandtableIndex(e.currentTarget.cellIndex);
			setoveralltableIndex(1);
			setproducttableIndex(1);
			// console.log('###brands', brandtableIndex)
		} else if(table === "scannedProducts") {
			setproducttableIndex(e.currentTarget.cellIndex);
			setoveralltableIndex(1);
			setbrandtableIndex(1);
		}
		  onSort(columnname, distributorScans, isAsc,table);
	};
  

	return (
        <AUX>
            <div className="consolidatedSales-container">
                <div className="row">
                    <div className="filterSection col-sm-12">
                        <label className="font-weight-bold">Consolidated Scans</label>
                        <Filter
                            handleSearch={handleSearch}
                            searchText={searchText}
                            partnerTypeList={partnerTypeList}
                            selectedPartnerType={partnerType}
							downloadPopup={true}
                            isDownload={true}
                            handlePartnerChange={handlePartnerChange}
                            toolTipText="Search applicable for User Name, Account Name and Owner Name"
							overallDownload={overallDownload}
							brandWiseDownload={brandWiseDownload}
							productWiseDownload={productWiseDownload}
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
							{/* <div className="form-group" onClick={(e) => e.stopPropagation()}>
								<NativeDropdown
									name="geolevel1"
									value={selectedFilters.geolevel1}
									label={"Region"}
									handleChange={(e: any) => handleRegionSelect(e, "geolevel1")}
									options={optionslist}
									defaultValue="ALL"
									id="region-test"
									dataTestId="region-test"
								/>
							</div> */}
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
												onClick={(e) => handleFilterChange(e, "scannedPeriod", item.label)}
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
										className="cus-btn-scanlog-filter reset"
										// onClick={(e) => this.resetFilter(e)}
										data-testid="reset-all"
									>
										Reset All
									</button>
									<button
										className="cus-btn-scanlog-filter"
										onClick={applyFilter}
										// disabled={lastUpdatedDateErr || dateErrMsg ? true : false}
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
                <div className="row" style={{    marginTop: '-5px'}}>
                        <div className = "col-sm-6">
                            <OverallScans distributorScans={distributorScans} getSelectedBrands={getSelectedBrands} selectedDistributor={selectedDistributor} handleSort={handleSort} 
							isAsc={isAsc} tableCellIndex={overalltableIndex} tableName={'overallScans'} />
                        </div>
                        <div className = "col-sm-6">
                            <div className="row">
                                <ProductBrandList selectedBrandList={selectedBrandList} getSelectedProducts ={getSelectedProducts}  distributorName={selectedDistributorName} selectedBrand={selectedBrand} handleSort={handleSort} isAsc={isAsc} tableCellIndex={brandtableIndex} tableName={'scannedBrands'} />
                            </div>
                            <div className="row">
                                <ProductList selectedProductList = {selectedProductList} brandName={selectedBrandName} handleSort={handleSort} isAsc={isAsc} tableCellIndex={producttableIndex} tableName={'scannedProducts'} />
                            </div>
                        </div>
                </div>
            </div>
        </AUX>
    )
}

export default ConsolidatedScans;

