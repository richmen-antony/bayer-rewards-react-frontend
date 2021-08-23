import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import "../../assets/scss/consolidatedSales.scss";
import Loader from "../../utility/widgets/loader";
import Pagination from "../../utility/widgets/pagination";
import moment from "moment";
import SimpleDialog from "../../container/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import NoImage from "../../assets/images/Group_4736.svg";
import OrderTable from "./Order";
import ExpandWindowImg from "../../assets/images/expand-window.svg";
import CalenderIcon from "../../assets/icons/calendar.svg";
import ActiveIcon from "../../assets/images/check.svg";
import { sortBy } from "../../utility/base/utils/tableSort";
import { Button } from "reactstrap";
import NativeDropdown from "../../utility/widgets/dropdown/NativeSelect";
import _ from "lodash";
import {
  downloadCsvFile,
  ErrorMsg,
} from "../../utility/helper";
import { apiURL } from "../../utility/base/utils/config";
import {
  invokeGetAuthService,
} from "../../utility/base/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowIcon from "../../assets/icons/tick.svg";
import RtButton from "../../assets/icons/right_btn.svg";
import { getLocalStorageData } from "../../utility/base/localStore";
import { CustomButton } from "../../utility/widgets/button";
import Filter from "../../container/grid/Filter";
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

const ref = React.createRef()
const Input = React.forwardRef(({ onChange, placeholder, value, id, onClick }: IProps,ref:any) => (
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
))



type Props = {
  distributorScans: any;
  getSelectedBrands: any;
};

type States = {
//   showPopup: boolean;
//   showProductPopup: boolean;
//   [key: string]: any;
//   isAsc: Boolean;
//   partnerType: PartnerTypes;
distributorScans: Array<any>;
  loggedUserInfo : any;
};

class OverallScans extends Component<any, any> {
  tableCellIndex: any;
  timeOut: any;
  paginationRef:any;
  constructor(props: any) {
    super(props);
    this.state = {
    //   showPopup: false,
    //   showProductPopup: false,
    //   isAsc: true,
    //   selectIndex: "",
    //   isRendered: false,
    //   allScanLogs: [],
    //   actions: ["All", "Distributor", "Retailer"],
    //   dropDownValue: "Select action",
    //   scanType: ["All", "Send Goods", "Receive Goods", "Sell to Farmers"],
    //   productCategories: [
    //     "ALL",
    //     "HYBRID",
    //     "CORN SEED",
    //     "HERBICIDES",
    //     "FUNGICIDES",
    //     "INSECTICIDES",
    //   ],
    //   status: ["ALL", "FULFILLED"],
    //   // status: ["ALL", "FULFILLED", "EXPIRED", "DUPLICATE"],
    //   list: ["ALL", "Distributor", "Retailer"],
      selectedFilters: {
        productgroup: "ALL",
        status: "ALL",
        ordereddatefrom: new Date().setMonth(new Date().getMonth() - 3),
        ordereddateto: new Date(),
        lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 3),
        lastmodifiedto: new Date(),
        farmer: "ALL",
        retailer: "ALL",
        partnerType:"Retailers"
      },
    //   dateErrMsg: "",
    //   searchText: "",
    //   totalData: 0,
    //   isFiltered: false,
    //   userRole: "",
    //   tooltipOpen: false,
    //   isLoader: false,
    //   dropdownOpenFilter: false,
    //   accordionView: false,
    //   accordionId: "",
    //   // value: 0,
    //   value: moment(),
    //   lastUpdatedDateErr: "",
    //   farmerOptions: [],
    //   retailerOptions: [],
      loggedUserInfo: {},
    //   inActiveFilter:false,
    //   partnerTypeList:["Retailers","Distributors"],
    //   partnerType: {
	// 			type: "Retailers",
	// 		  },
    };
    this.timeOut = 0;
  }
  componentDidMount() {
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
    this.setState(
      {
        loggedUserInfo: userData,
      },
      () => {
        // this.getScanLogs();
        // this.getRetailerList();
        // this.getLocationHierachyOrder();

      }
    );

  }
  getSelectedBrands = (distributorId : number) =>{
    let allBrands = this.state.scannedBrands?.filter((brands:any) => brands.distributorId === distributorId);
    let allProducts = this.state.scannedProducts?.filter((product:any) => (product.distributorId === distributorId && allBrands[0].brandId === product.brandId));
    this.setState({selectedBrandList : allBrands, selectedProductList :  allProducts});
    console.log('allbrands', allBrands);
    console.log('allProducts', allProducts);
  }
  /**
   * Retailer and Farmer dropdown list value
   * @param condIf 
   */
  getRetailerList = (condIf?: any) => {
    const { rsmRetailerList } = apiURL;
    const { selectedFilters } = this.state;
    let queryParams = {
      region: this.state.loggedUserInfo?.geolevel1,
      countrycode: this.state.loggedUserInfo?.countrycode,
      retailerid:
        selectedFilters.retailer === "ALL" ? null : selectedFilters.retailer,
    };
    let oneTimeUpdate =
      selectedFilters.retailer !== "ALL" && condIf ? true : false;
    invokeGetAuthService(rsmRetailerList, queryParams)
      .then((response) => {
        if (response.data) {
          const { farmers, retailers } = response.data;
          const farmerOptions =
            farmers?.length > 0
              ? farmers.map((val: any) => {
                  return { value: val.farmerid, text: val.farmername };
                })
              : [];

          const retailerOptions =
            retailers?.length > 0
              ? retailers.map((val: any) => {
                  return { value: val.userid, text: val.username };
                })
              : [];
          const retailerList =
            oneTimeUpdate && this.state.retailerOptions.length
              ? this.state.retailerOptions
              : retailerOptions;
          this.setState({
            isLoader: false,
            farmerOptions,
            retailerOptions: retailerList,
          });
        }
      })
      .catch((error) => {
        this.setState({ isLoader: false });
        ErrorMsg(error);
        console.log("error", error);
      });
  };
  getScanLogs = (defaultPageNo?: any) => {
    const { scanLogs } = apiURL;
    const {state,setDefaultPage}= this.paginationRef;
		const pageNo=  !defaultPageNo ? 1 : state.pageNo;

		// set default pagination number 1 and  call the method
		if(!defaultPageNo){
			setDefaultPage();
		}
		this.setState({ isLoader: true });
    const { selectedFilters, isFiltered } = this.state;
    let data = {
      page: pageNo,
      searchtext: this.state.searchText,
      rowsperpage: state.rowsPerPage,
      isfiltered: this.state.isFiltered,
      region: this.state.loggedUserInfo?.geolevel1,
      countrycode: this.state.loggedUserInfo?.countrycode,
    };
    if (isFiltered) {
      let filter = { ...selectedFilters };
      filter.ordereddatefrom = moment(filter.ordereddatefrom).format(
        "YYYY-MM-DD"
      );
      filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
      filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format(
        "YYYY-MM-DD"
      );
      filter.lastmodifiedto = moment(filter.lastmodifiedto).format(
        "YYYY-MM-DD"
      );
      filter.productgroup =
        filter.productgroup === "ALL" ? null : filter.productgroup;
      filter.farmer = filter.farmer === "ALL" ? null : filter.farmer;
      filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
      filter.partnerType = null
      data = { ...data, ...filter };
    }

    invokeGetAuthService(scanLogs, data)
      .then((response) => {
        this.setState({
          isLoader: false,
          allScanLogs:
            Object.keys(response.body).length !== 0 ? response.body.rows : [],
        });
        const total = response.body?.totalrows;
        this.setState({ totalData: Number(total) });
      })
      .catch((error) => {
        this.setState({ isLoader: false, allScanLogs: [] }, () => {
        });
        ErrorMsg(error);
        console.log("error", error);
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
				locationData.forEach((item: any,index:number) => {
					if(index>0){
						let locationhierlevel = item.locationhierlevel;
						let geolevels = "geolevel" + locationhierlevel;
						let obj = { name: item.locationhiername, geolevels };
						levels.push(obj);
					}
					
				});
			this.setState({
				locationData: levels,
			});
		});
	};
  handleClosePopup = () => {
    this.setState({ showPopup: false });
  };

  showPopup = (e: any, key: keyof States) => {
    e.stopPropagation();
    this.setState<never>({
      [key]: true,
    });
  };
  handleCloseProductPopup = () => {
    this.setState({ showProductPopup: false });
  };
  updateOrderData = (value: any) => {
    this.setState({
      orderData: value,
    });
  };
  handleUpdateRetailer(value: any) {
    this.setState({
      retailerPopupData: value,
    });
  }
  handleSearch = (e: any) => {
    let searchText = e.target.value;
    this.setState({ searchText: searchText,isFiltered:true,inActiveFilter:false });
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    if (searchText.length >= 3 || searchText.length === 0) {
      this.timeOut = setTimeout(() => {
        this.getScanLogs();
      }, 1000);
    }
  };
  onSort = (name: string, datas: any, isAsc: Boolean) => {
    let response = sortBy(name, datas);
    this.setState({ allScanLogs: response, isAsc: !isAsc });
  };

  handleSort(e: any, columnname: string, data: any, isAsc: Boolean) {
    this.tableCellIndex = e.currentTarget.cellIndex;
    this.onSort(columnname, data, isAsc);
  }

  toggleFilter = () => {
    this.setState((prevState: any) => ({
      dropdownOpenFilter: !prevState.dropdownOpenFilter,
    }));
  };

  handleFilterChange = (e: any, name: string, item: any) => {
    e.stopPropagation();
    let val = this.state.selectedFilters;
    let flag = false;
    // this.state.dateErrMsg = '';
    if (name === "type") {
      val[name] = e.target.value;
      flag = true;
    } else if (name === "startDate") {
      if (e.target.value <= val.endDate) {
        val[name] = e.target.value;
        flag = true;
      } else {
        this.setState({
          dateErrMsg: "Start date should be lesser than End Date",
        });
      }
    } else if (name === "endDate") {
      if (e.target.value >= new Date().toISOString().substr(0, 10)) {
        this.setState({
          dateErrMsg: "End Date should not be greater than todays date",
        });
      } else if (e.target.value <= val.startDate) {
        this.setState({
          dateErrMsg: "End Date should be greater than Start Date",
        });
      } else {
        val[name] = e.target.value;
        flag = true;
      }
    } else {
      val[name] = item;
      flag = true;
    }
    if (flag) {
      this.setState({ selectedFilters: val });
    }
  };

  resetFilter = (e?: any) => {
    let today = new Date();
    let conditionIsFilter = this.state.searchText ? true : false
    this.setState(
      {
        selectedFilters: {
          productgroup: "ALL",
          status: "ALL",
          ordereddatefrom: today.setMonth(today.getMonth() - 3),
          ordereddateto: new Date(),
          lastmodifiedfrom: today.setMonth(today.getMonth() - 3),
          lastmodifiedto: new Date(),
          farmer: "ALL",
          retailer: "ALL",
          partnerType:"Retailers"
        },
        isFiltered: conditionIsFilter,
        dateErrMsg:"",
        lastUpdatedDateErr:""

      },
      () => {
        this.getScanLogs();
        this.toggleFilter();
        this.getRetailerList();
      }
    );
  };

  applyFilter = () => {
    this.setState({ isFiltered: true,inActiveFilter:false }, () => {
      this.getScanLogs();
      this.toggleFilter();
      
      // this.resetFilter();
    });
  };
  toggle = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };
  
  download = () => {
    const { downloadScanlogs } = apiURL;

    let data = {
      region: this.state.loggedUserInfo?.geolevel1,
      countrycode: this.state.loggedUserInfo?.countrycode,
      isfiltered: this.state.isFiltered,
      searchtext: this.state.searchText,
    };
    if (this.state.isFiltered) {
      let filter = { ...this.state.selectedFilters };
      filter.ordereddatefrom = moment(filter.ordereddatefrom).format(
        "YYYY-MM-DD"
      );
      filter.ordereddateto = moment(filter.ordereddateto).format("YYYY-MM-DD");
      filter.lastmodifiedfrom = moment(filter.lastmodifiedfrom).format(
        "YYYY-MM-DD"
      );
      filter.lastmodifiedto = moment(filter.lastmodifiedto).format(
        "YYYY-MM-DD"
      );
      filter.productgroup =
        filter.productgroup === "ALL" ? null : filter.productgroup;
      filter.farmer = filter.farmer === "ALL" ? null : filter.farmer;
      filter.retailer = filter.retailer === "ALL" ? null : filter.retailer;
      filter.status = filter.status === "ALL" ? null : filter.status;

      data = { ...data, ...filter };
    }
    invokeGetAuthService(downloadScanlogs, data)
      .then((response) => {
        const data = response;
        downloadCsvFile(data, "scanlogs.csv");
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  handleDateChange = (date: any, name: string) => {
    let val = this.state.selectedFilters;

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
          lastUpdatedDateErr:
            "Last Updated End Date should be greater than  Last Updated Start Date",
        });
      } else {
        this.setState({
          lastUpdatedDateErr:
            "Last Updated Start Date should be lesser than  Last Updated End Date",
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
          lastUpdatedDateErr:
            "Last Updated Start Date should be lesser than Last Updated End Date",
        });
      } else {
        this.setState({
          lastUpdatedDateErr:
            "Last Updated Start Date should be greater than Last Updated End Date",
        });
      }
    }

    this.setState({
      selectedFilters: { ...this.state.selectedFilters, [name]: date },
    });
  };

  handlePartnerChange = (name: string) => {
		this.setState(
		  {
			partnerType: {
			  type: name,
			},
		  },
		  () => {
			this.getScanLogs();
		  }
		);
	  };
  render() {
    const {
      retailerPopupData,
      showProductPopup,
      isAsc,
      allScanLogs,
      dropdownOpenFilter,
      selectedFilters,
      isLoader,
      dateErrMsg,
      searchText,
      totalData,
      lastUpdatedDateErr,
      farmerOptions,
      retailerOptions,
    } = this.state;

    const { distributorScans, getSelectedBrands,selectedDistributor } = this.props;
    console.log('selectedDistributor', selectedDistributor)

    const pageNumbers = [];
    const pageData = Math.ceil(this.state.totalData / this.state.rowsPerPage);
    for (let i = 1; i <= pageData; i++) {
      pageNumbers.push(i);
    }
    return (
      <AUX>
        {isLoader && <Loader />}
            <div className="">
              <label className="font-weight-bold">Overall Consolidated Scans</label>
              <div className="consolidatedSales-table"  style={{height: '54vh', overflowY: 'auto' }}>
                <table className="table retailerTable">
                  <thead>
                    <tr>
                    <th>CUSTOMER NAME/ID</th>
                        <th>RECEIVE GOODS</th>
                        <th>SEND GOODS</th>
                        <th>S2F-WALK-IN-SALES</th>
                        <th>S2F-ADVISOR SALES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributorScans.length > 0 ? (
                      distributorScans.map((item: any, idx: number) => {
                        return (
                          <tr
                            style={{ cursor: "pointer", backgroundColor : selectedDistributor === idx ? '#F5FCFF' : ''}}
                            key={idx}
                            onClick = {()=>getSelectedBrands(item.distributorId, idx, 'selected')}
                            // className = { selectedDistributor === idx ? "isfirstRowActive" : 'isSelectedRowActive'} 
                          >
                            <td>{_.startCase(_.toLower(item.name))}</td>
                            <td>{item.sendgoods}</td>
                            <td>{item.receivegoods}</td>
                            <td>{item.walkinsales}</td>
                            <td>{item.advisorsales}</td>
                    
                          </tr>
                        );
                      })
                    ) :  (
                      <tr style={{ height: "250px" }}>
                        <td colSpan={10} className="no-records">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="">
                    <tr>
                      {/* <td colSpan={2}></td> */}
                      <td>
                        <p className="total">Total(2)</p>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {2122}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {4324}
                        </span>
                      </td>
                      <td>
                        <span className="">
                          {423432}
                        </span>
                      </td>
                      <td>
                      <span className="productprice">
                          {767}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

          <div>
            <Pagination
              totalData={totalData}
              data={allScanLogs}
              totalLabel={"Sales"}
              onRef={(node:any)=>{
								this.paginationRef= node;
							}}
              getRecords={this.getScanLogs}
            />
          </div>
        </div>
      </AUX>
    );
  }
}

export default OverallScans;
