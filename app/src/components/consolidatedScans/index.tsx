import React, { Component } from 'react';
import AUX from "../../hoc/Aux_";
import Filter from "../../container/grid/Filter";
import OverallScans  from './OverallScans';
import ProductBrandList from './ProductBrandList';
import ProductList from './ProductList';
import { Button} from "reactstrap";

class ConsolidatedScans extends Component<any, any> {
    timeOut: any;
    constructor(props:any) {
        super(props);
        this.state = {
            dropdownOpenFilter: false,
			partnerTypeList: ["Retailer", "Distributor"],
			partnerType: {
				type: "Retailers",
			},
            selectedFilters: {
				productgroup: "ALL",
				status: "ALL",
				ordereddatefrom: new Date().setMonth(new Date().getMonth() - 3),
				ordereddateto: new Date(),
				lastmodifiedfrom: new Date().setMonth(new Date().getMonth() - 3),
				lastmodifiedto: new Date(),
				farmer: "ALL",
				retailer: "ALL",
				salesType: "WALKIN_SALES",
				partnerType:"Retailers"
			},
        };
        this.timeOut = 0;
    }

	handleSearch = (e: any) => {
		let searchText = e.target.value;
		this.setState({ searchText: searchText});
		if (this.timeOut) {
		  clearTimeout(this.timeOut);
		}
		if (searchText.length >= 3 || searchText.length === 0) {
		  this.setState({ isFiltered: true,inActiveFilter:false  });
		  this.timeOut = setTimeout(() => {
		    // this.getChannelPartnersList();
		  }, 1000);
		}
	};

    toggleFilter = (e: any) => {
		this.setState((prevState:any) => ({
			dropdownOpenFilter: !prevState.dropdownOpenFilter,
		}));
	};
    handleFilterChange = (e: any, name: string, item: any) => {
		e.stopPropagation();
	};
	download = () => {

	};
    handlePartnerChange = (name: string) => {
		this.setState(
		  {
			partnerType: {
			  type: name,
			},
		  },
		  () => {
			// this.getScanLogs();
		  }
		);
	  };

  render() {
    const {totalData, isAsc,isLoader, dropdownOpenFilter, selectedFilters, userList, userData, isStaff, dateErrMsg,allChannelPartners } = this.state;
    return (
        <AUX>
            <div className="consolidatedSales-container">
                <div className="row">
                    <div className="filterSection col-sm-12">
                        <label className="font-weight-bold">Consolidated Scans</label>
                        <Filter
                            handleSearch={this.handleSearch}
                            searchText={this.state.searchText}
                            partnerTypeList={this.state.partnerTypeList}
                            selectedPartnerType={this.state.partnerType}
                            download={this.download}
                            isDownload={true}
                            handlePartnerChange={this.handlePartnerChange}
                            toolTipText="Search applicable for User Name, Account Name and Owner Name"
					    >
						    <div>Hello</div>
					    </Filter>
                    </div>
                </div>
                <div className="row">
                        <div className = "col-sm-6">
                                <OverallScans />
                        </div>
                        <div className = "col-sm-6">
                            <div className="row">
                                <ProductBrandList />
                            </div>
                            <div className="row">
                                <ProductList />
                            </div>
                        </div>
                </div>
                
            </div>
            {/* <div className="consolidatedSales-container">
                <div className="col-sm-6 filterSection">
				<label className="font-weight-bold">Consolidated Scans</label>
					<Filter
						handleSearch={this.handleSearch}
						searchText={this.state.searchText}
						dropdownOpenFilter={dropdownOpenFilter}
						toggleFilter={this.toggleFilter}
						selectedFilters={selectedFilters}
						handleFilterChange={this.handleFilterChange}
						partnerTypeList={this.state.partnerTypeList}
						selectedPartnerType={this.state.partnerType}
						download={this.download}
						isDownload={true}
						handlePartnerChange={this.handlePartnerChange}
						toolTipText="Search applicable for User Name, Account Name and Owner Name"
					>
						<div>Hello</div>
					</Filter>
                </div>
				<div className="">
					<div className = "row">
						<div className = "col-sm-6">
							<OverallScans />
						</div>
						<div className = "col-sm-6">
							<div className="row">
								<ProductBrandList />
							</div>
							<div className="row">
								<ProductList />
							</div>
						</div>
					</div>
				</div>
            </div> */}
        </AUX>
    )
  }
}

export default ConsolidatedScans;