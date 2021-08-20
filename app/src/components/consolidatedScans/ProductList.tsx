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

type Props = {};

type States = {
  sales: Array<any>;
  loggedUserInfo : any;
};

class ProductList extends Component<any, any> {
  tableCellIndex: any;
  timeOut: any;
  paginationRef:any;
  constructor(props: any) {
    super(props);
    this.state = {
        sales : [
            {
                "name" : "vidhya",
                "sendgoods" : 3131,
                "receivegoods" : 3243,
                "walkinsales" : 432,
                "advisorsales" :434 
            },
            {
                "name" : "demo",
                "sendgoods" : 343,
                "receivegoods" : 89,
                "walkinsales" : 978,
                "advisorsales" :65 
            },
            {
              "name" : "demo1",
              "sendgoods" : 343,
              "receivegoods" : 89,
              "walkinsales" : 978,
              "advisorsales" :65 
          },
  {
              "name" : "demo2",
              "sendgoods" : 343,
              "receivegoods" : 89,
              "walkinsales" : 978,
              "advisorsales" :65 
          }
        ],
    };
    this.timeOut = 0;
  }
  componentDidMount() {
    let data: any = getLocalStorageData("userData");
    let userData = JSON.parse(data);
  }

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

    const pageNumbers = [];
    const pageData = Math.ceil(this.state.totalData / this.state.rowsPerPage);
    for (let i = 1; i <= pageData; i++) {
      pageNumbers.push(i);
    }
    return (
      <AUX>
        {isLoader && <Loader />}
            <div className="">
              <label className="font-weight-bold">Product Wise Scans -</label>
              <div className="consolidatedSales-table"  style={{height: '25vh', overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                        <th>PRODUCT</th>
                        <th>RECEIVE GOODS</th>
                        <th>SEND GOODS</th>
                        <th>S2F-WALK-IN-SALES</th>
                        <th>S2F-ADVISOR SALES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.sales.length > 0 ? (
                      this.state.sales.map((item: any, i: number) => {
                        return (
                          <tr
                            style={{ cursor: "pointer" }}
                            key={i}
                          >
                                    <td>{item.name}</td>
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
                </table>
              </div>

           </div>
      </AUX>
    );
  }
}

export default ProductList;
