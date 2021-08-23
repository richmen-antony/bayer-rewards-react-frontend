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
			selectedBrandList : [],
			selectedProductList : [],
			selectedDistributorName : '',
			selectedDistributor : 0,
			selectedBrand : 0,
			idBrandSelected : false,
			selectedBrandName : '',
			  distributorScans : [
				  {
					  "distributorId" : 1,
					  "name" : "vidhya",
					  "sendgoods" : 3131,
					  "receivegoods" : 3243,
					  "walkinsales" : 432,
					  "advisorsales" :434 
				  },
				  {
					"distributorId" : 2,
					  "name" : "demo",
					  "sendgoods" : 343,
					  "receivegoods" : 89,
					  "walkinsales" : 978,
					  "advisorsales" :65 
				  },
				  {
					"distributorId" : 3,
					"name" : "demo1",
					"sendgoods" : 343,
					"receivegoods" : 89,
					"walkinsales" : 978,
					"advisorsales" :65 
				},
				{
					"distributorId" : 4,
					"name" : "demo2",
					"sendgoods" : 343,
					"receivegoods" : 89,
					"walkinsales" : 978,
					"advisorsales" :65 
				},
				{
				  "distributorId" : 5,
				  "name" : "demo2",
				  "sendgoods" : 343,
				  "receivegoods" : 89,
				  "walkinsales" : 978,
				  "advisorsales" :65 
			  },
			  {
				"distributorId" : 6,
				"name" : "demo2",
				"sendgoods" : 343,
				"receivegoods" : 89,
				"walkinsales" : 978,
				"advisorsales" :65 
			},
			{
			  "distributorId" : 7,
			  "name" : "demo2",
			  "sendgoods" : 343,
			  "receivegoods" : 89,
			  "walkinsales" : 978,
			  "advisorsales" :65 
			},
			{
			  "distributorId" : 8,
			  "name" : "demo2",
			  "sendgoods" : 343,
			  "receivegoods" : 89,
			  "walkinsales" : 978,
			  "advisorsales" :65 
			},
			  {
				"distributorId" : 9,
				"name" : "demo2",
				"sendgoods" : 343,
				"receivegoods" : 89,
				"walkinsales" : 978,
				"advisorsales" :65 
			  },
			  {
				"distributorId" : 10,
				"name" : "demo2",
				"sendgoods" : 343,
				"receivegoods" : 89,
				"walkinsales" : 978,
				"advisorsales" :65 
			  },
			  {
				"distributorId" :11,
				"name" : "demo2",
				"sendgoods" : 343,
				"receivegoods" : 89,
				"walkinsales" : 978,
				"advisorsales" :65 
			  }
			  ],
			  scannedBrands : [
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
					"brandname" : "brand2",
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
			  ],
			  scannedProducts : [
				  {
					"distributorId" :1,
					"brandId" : 1,
					"productId" : 1,
					"productname" : "product1",
					"sendgoods" : 343,
					"receivegoods" : 89,
					"walkinsales" : 978,
					"advisorsales" :65 
				  },
				  {
					"distributorId" :1,
					"brandId" : 1,
					"productId" : 2,
					"productname" : "product2",
					"sendgoods" : 343,
					"receivegoods" : 89,
					"walkinsales" : 978,
					"advisorsales" :65 
				  },
				  {
					"distributorId" : 1,
					"brandId" : 1,
					"productId" : 3,
					"productname" : "product3",
					"sendgoods" : 343,
					"receivegoods" : 89,
					"walkinsales" : 978,
					"advisorsales" :65 
				  },
				  {
					"distributorId" :1,
					"brandId" : 2,
					"productId" : 4,
					"productname" : "product4",
					"sendgoods" : 343,
					"receivegoods" : 89,
					"walkinsales" : 978,
					"advisorsales" :65 
				  },
				  {
					"distributorId" :2,
					"brandId" : 1,
					"productId" : 5,
					"productname" : "product5",
					"sendgoods" : 343,
					"receivegoods" : 89,
					"walkinsales" : 978,
					"advisorsales" :65 
				  },
				  {
					"distributorId" :2,
					"brandId" : 3,
					"productId" : 6,
					"productname" : "product6",
					"sendgoods" : 343,
					"receivegoods" : 89,
					"walkinsales" : 978,
					"advisorsales" :65 
				  },
				  
			  ],
        };
        this.timeOut = 0;
    }

	componentDidMount() {
		let distributorId = this.state.distributorScans[0].distributorId;
		let distributorName = this.state.distributorScans[0].name;
		this.getSelectedBrands(distributorId);
		this.setState({selectedDistributorName : distributorName });

	}

	getSelectedBrands = (distributorId : number, index?:string, type?:String) => {
		let allBrands = this.state.scannedBrands?.filter((brands:any) => brands.distributorId === distributorId);
		let allProducts = this.state.scannedProducts?.filter((product:any) => (product.distributorId === distributorId && allBrands[0]?.brandId === product.brandId));
		this.setState({selectedBrandList : allBrands, selectedProductList :  allProducts, selectedBrandName : allBrands[0]?.brandname });
		if ( type === 'selected' ) {
			this.setState({selectedDistributor : index })
		}
		this.state.distributorScans?.forEach((item:any,index:number)=>{
			if( item.distributorId === distributorId) {
				this.setState ({selectedDistributorName : item.name })
			}
		})
	}

	getSelectedProducts = (distributorId: number, brandId:number, idx:number, type?:String) => {
		let allProducts = this.state.scannedProducts?.filter((product:any) => (product.distributorId === distributorId && brandId === product.brandId));
		if ( type === 'selected' ) {
			this.setState({ selectedBrand : idx })
		}
		this.state.scannedBrands?.forEach((item:any,index:number)=>{
			if( item.brandId === brandId && item.distributorId === distributorId) {
				this.setState ({selectedBrandName : item.brandname })
			}
		})
		this.setState({ selectedProductList :  allProducts});
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
                            <OverallScans distributorScans={this.state.distributorScans} getSelectedBrands={this.getSelectedBrands} selectedDistributor={this.state.selectedDistributor}/>
                        </div>
                        <div className = "col-sm-6">
                            <div className="row">
                                <ProductBrandList selectedBrandList={this.state.selectedBrandList} getSelectedProducts ={this.getSelectedProducts}  distributorName={this.state.selectedDistributorName} selectedBrand={this.state.selectedBrand} />
                            </div>
                            <div className="row">
                                <ProductList selectedProductList = {this.state.selectedProductList} brandName={this.state.selectedBrandName} />
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