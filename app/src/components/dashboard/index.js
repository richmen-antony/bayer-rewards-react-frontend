import React , {Component, Fragment } from 'react';

import AUX from "../../hoc/Aux_";
// import Settings from '../Subpages/Settings';
// import Areacharts from '../Chartstypes/Areacharts';
// import Piecharts from '../Chartstypes/Piecharts';
// import { Sparklines,SparklinesLine  } from 'react-sparklines';
// import { Scrollbars } from 'react-custom-scrollbars';

// import { Link } from 'react-router-dom';
import Chart from "react-apexcharts";
import Radial from "../../container/charts/Radial";
import Bar from "../../container/charts/Bar";
import Donut from "../../container/charts/Donut";
import Line from "../../container/charts/Line";
import "../../assets/scss/dashboard.scss";

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            productToggle: true,
            customerToggle: false,
            sellingCustomer: [
                {
                    "no": 1,
                    "name":"vidhyaaaa",
                    "salesachieved" : "25,346",
                    "targetachieved": 80
                },
                {
                    "no": 2,
                    "name":"demo2",
                    "salesachieved" : "15,567",
                    "targetachieved": 35

                },
                {
                    "no": 3,
                    "name":"demo2",
                    "salesachieved" : "34,433",
                    "targetachieved": 60
                },
                {
                    "no": 4,
                    "name":"demo2",
                    "salesachieved" : "50,000",
                    "targetachieved": 20

                },
                {
                    "no": 5,
                    "name":"demo2",
                    "salesachieved" : "20,433",
                    "targetachieved": 90

                }
            ],
            products: [
                {
                    "no": 1,
                    "name":"Agridexdemo1",
                    "customers" : "256",
                    "quantitySold": 70
                },
                {
                    "no": 2,
                    "name":"Agridexdemo2",
                    "customers" : "193",
                    "quantitySold": 80
                },
                {
                    "no": 3,
                    "name":"AM25",
                    "customers" : "200",
                    "quantitySold": 60
                },
                {
                    "no": 4,
                    "name":"demoprod",
                    "customers" : "500",
                    "quantitySold": 45
                },
                {
                    "no": 5,
                    "name":"product",
                    "customers" : "200",
                    "quantitySold": 20
                }
            ]
        }
    }
    toggleClick = () => {
        this.setState({
            productToggle: !this.state.productToggle,
            customerToggle: !this.state.customerToggle
        });
    }

render(){
    const { productToggle, customerToggle } = this.state;
    console.log('prodinitial', productToggle);
    console.log('customerinitial', customerToggle);
    var myChat = {
        width: '110%'
     };
      
      
    return(
            <AUX>
                <div className="container-fluid">
                    <div className="page-title-box mt-2">
                        <div className="row align-items-center">
                            <div className="col-sm-6">
                                <h4 className="page-title">Dashboard</h4>
                            </div>
                            <div className="col-sm-6">
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <h8 className="mt-0 header-title mb-4 headingText">Targets Progress</h8>
                                    <div id="center_chart">  
                                    <Radial />
                                    </div>
                                                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-body">
                                    <h8 className="mt-0 header-title mb-4 headingText">By Product Group</h8>
                                    <div id="center_chart">  
                                    <Bar />
                                    </div>
                                                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <h8 className="mt-0 header-title mb-4 headingText">Overall Scans</h8>
                                    <div id="center_chart">  
                                        <Donut />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-9">
                            <div className="card col-sm-12">
                                <div className="card-body">
                                    <div className="topList">
                                        <div className="topLeft headingText">
                                             <h8 className="mt-0 header-title mb-4">Top 5 Selling {productToggle ? "Products" : "Customers"}</h8>
                                        </div>
                                        <div className="topRight headingText">
                                            <button type="button" class={productToggle ? "btn toggleList" : "btn btn-light"} onClick={this.toggleClick}>Products</button>
                                            <button type="button" class={customerToggle ? "btn toggleList" : "btn btn-light"} onClick={this.toggleClick}>Customers</button>
                                        </div>
                                    </div>
                                    {productToggle ? 
                                    <div className="table-responsive">
                                        <table class="table table-borderless">
                                            <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Name</th>
                                                <th>Sales Achieved</th>
                                                <th>Targets Achieved</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.sellingCustomer ? 
                                                <>
                                                   {this.state.sellingCustomer.map((data, i) =>
                                                        <tr key={`selling-customer-${i}`}>
                                                            <td>{i+1}</td>
                                                            <td>{data.name}</td>
                                                            <td>{data.salesachieved}</td>
                                                            <td>
                                                            <div class="progress"> 
                                                                <div class="progress-bar" role="progressbar" aria-valuenow={data.targetAchieved} aria-valuemin="0" aria-valuemax="100" style={{width: "50%"}}>
                                                                </div>
                                                            </div>
                                                            </td>   
                                                        </tr>
                                                    )}
                                                </> : <div className="col-12 card mt-4">
                                                        <div className="card-body ">
                                                            <div className="text-red py-4 text-center headingText">No Data Found</div>
                                                        </div>
                                                     </div>

                                                }
                                         
                                            </tbody>
                                        </table>
                                    </div> : 
                                    <div className="table-responsive">
                                        <table class="table table-borderless">
                                            <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Name</th>
                                                <th>Customers</th>
                                                <th>Quantity Sold</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.products ? 
                                                <>
                                                   {this.state.products.map((data, i) =>
                                                        <tr key={`selling-product-${i}`}>
                                                            <td>{i+1}</td>
                                                            <td>{data.name}</td>
                                                            <td>{data.customers}</td>
                                                            <td>{data.quantitySold}</td>
                                                        </tr>
                                                    )}
                                                </> : <div className="col-12 card mt-4">
                                                        <div className="card-body ">
                                                            <div className="text-red py-4 headingText">No Data Found</div>
                                                        </div>
                                                     </div>

                                                }
                                         
                                            </tbody>
                                        </table>
                                    </div>   
                                }
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3">
                            <div className="row">
                                <div className="card col-sm-12">
                                    <div className="card-body">
                                        <h8 className="mt-0 header-title mb-4 headingText">Total Users</h8>
                                        <div className="totalUsers">
                                            <div className="distributor">
                                                <p>164</p>
                                                <p>Distributors</p>
                                            </div>
                                            <div className="retailer">
                                                <p>23</p>
                                                <p>Retailers</p>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                            <div className="card col-sm-12">
                                <div className="card-body">
                                    <h8 className="mt-0 header-title mb-4 headingText">Top 5 Sales for Geo location</h8>
                                        <div id="center_chart">  
                                            <Line />
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="row">
                    <div className="col-xl-3 col-md-6">
                        <div className="card mini-stat bg-primary text-white">
                            <div className="card-body">
                                <div className="mb-4">
                                    <div className="float-left mini-stat-img mr-4">
                                        <img src="assets/images/services-icon/01.png" alt="nice" />
                                    </div>
                                    <h5 className="font-16 text-uppercase mt-0 text-white-50">Orders</h5>
                                    <h4 className="font-500">1,685 <i className="mdi mdi-arrow-up text-success ml-2"></i></h4>
                                    <div className="mini-stat-label bg-success">
                                        <p className="mb-0">+ 12%</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div className="float-right">
                                        <Link to="#" className="text-white-50"><i className="mdi mdi-arrow-right h5"></i></Link>
                                    </div>

                                    <p className="text-white-50 mb-0">Since last month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card mini-stat bg-primary text-white">
                            <div className="card-body">
                                <div className="mb-4">
                                    <div className="float-left mini-stat-img mr-4">
                                        <img src="assets/images/services-icon/02.png" alt="" />
                                    </div>
                                    <h5 className="font-16 text-uppercase mt-0 text-white-50">Revenue</h5>
                                    <h4 className="font-500">52,368 <i className="mdi mdi-arrow-down text-danger ml-2"></i></h4>
                                    <div className="mini-stat-label bg-danger">
                                        <p className="mb-0">- 28%</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div className="float-right">
                                        <Link to="#" className="text-white-50"><i className="mdi mdi-arrow-right h5"></i></Link>
                                    </div>

                                    <p className="text-white-50 mb-0">Since last month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card mini-stat bg-primary text-white">
                            <div className="card-body">
                                <div className="mb-4">
                                    <div className="float-left mini-stat-img mr-4">
                                        <img src="assets/images/services-icon/03.png" alt="" />
                                    </div>
                                    <h5 className="font-16 text-uppercase mt-0 text-white-50">Average Price</h5>
                                    <h4 className="font-500">15.8 <i className="mdi mdi-arrow-up text-success ml-2"></i></h4>
                                    <div className="mini-stat-label bg-info">
                                        <p className="mb-0"> 00%</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div className="float-right">
                                        <Link to="#" className="text-white-50"><i className="mdi mdi-arrow-right h5"></i></Link>
                                    </div>

                                    <p className="text-white-50 mb-0">Since last month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card mini-stat bg-primary text-white">
                            <div className="card-body">
                                <div className="mb-4">
                                    <div className="float-left mini-stat-img mr-4">
                                        <img src="assets/images/services-icon/04.png" alt="" />
                                    </div>
                                    <h5 className="font-16 text-uppercase mt-0 text-white-50">Product Sold</h5>
                                    <h4 className="font-500">2436 <i className="mdi mdi-arrow-up text-success ml-2"></i></h4>
                                    <div className="mini-stat-label bg-warning">
                                        <p className="mb-0">+ 84%</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div className="float-right">
                                        <Link to="#" className="text-white-50"><i className="mdi mdi-arrow-right h5"></i></Link>
                                    </div>

                                    <p className="text-white-50 mb-0">Since last month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-9">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="mt-0 header-title mb-5">Monthly Earning</h4>
                                <div className="row">
                                    <div className="col-lg-7">
                                        <div>
                                            <Areacharts type="earnings" />
                                        </div>
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="text-center">
                                                    <p className="text-muted mb-4">This month</p>
                                                    <h4>$34,252</h4>
                                                    <p className="text-muted mb-5">It will be as simple as in fact it will be occidental.</p>       
                                                    <Piecharts rate="110" type="single" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="text-center">
                                                    <p className="text-muted mb-4">Last month</p>
                                                    <h4>$36,253</h4>
                                                    <p className="text-muted mb-5">It will be as simple as in fact it will be occidental.</p>
                                                   <Piecharts  rate="70" type="single"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3">
                        <div className="card">
                            <div className="card-body">
                                <div>
                                    <h4 className="mt-0 header-title mb-4">Sales Analytics</h4>
                                </div>
                                <div className="wid-peity mb-4">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div>
                                                <p className="text-muted">Online</p>
                                                <h5 className="mb-4">1,542</h5>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                            <Sparklines  height={85} data={[5, 10, 5, 20, 15 ,10, 18,14, 20, -18,18, 17, 29, 10, 18]}>
                                                <SparklinesLine color="blue" />
                                            </Sparklines>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="wid-peity mb-4">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div>
                                                <p className="text-muted">Offline</p>
                                                <h5 className="mb-4">6,451</h5>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                            <Sparklines height={85} data={[5, 10, -5, 14, 20, -18, 17, 29, -10, 18,14, 20, -18, 17, 29,]}>
                                                <SparklinesLine color="blue" />
                                            </Sparklines>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div>
                                                <p className="text-muted">Marketing</p>
                                                <h5>84,574</h5>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-4">
                                            <Sparklines  height={85} data={[5, 10, 5, 20, 18, 17, 29, 15, 17, 29,10,18,14,20, -18]}>
                                                <SparklinesLine color="blue" />
                                            </Sparklines>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-3">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="mt-0 header-title mb-4">Sales Report</h4>

                                <div className="cleafix">
                                    <p className="float-left"><i className="mdi mdi-calendar mr-1 text-primary"></i> Jan 01 - Jan 31</p>
                                        <h5 className="font-18 text-right">$4230</h5>
                                </div>

                                <div className="clearfix"></div>

                                <div id="center_chart">  
                                <Piecharts />
                                </div>
                               

                                <div className="mt-4">
                                    <table className="table mb-0">
                                        <tbody>
                                            <tr>
                                                <td><span className="badge badge-primary">Desk</span></td>
                                                <td>Desktop</td>
                                                <td className="text-right">54.5%</td>
                                            </tr>
                                            <tr>
                                                <td><span className="badge badge-success">Mob</span></td>
                                                <td>Mobile</td>
                                                <td className="text-right">28.0%</td>
                                            </tr>
                                            <tr>
                                                <td><span className="badge badge-warning">Tab</span></td>
                                                <td>Tablets</td>
                                                <td className="text-right">17.5%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-xl-4">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="mt-0 header-title mb-4">Activity</h4>
                                <ol className="activity-feed mb-0">
                                    <li className="feed-item">
                                        <div className="feed-item-list">
                                            <span className="date">Jan 22</span>
                                            <span className="activity-text">Responded to need “Volunteer Activities”</span>
                                        </div>
                                    </li>
                                    <li className="feed-item">
                                        <div className="feed-item-list">
                                            <span className="date">Jan 20</span>
                                            <span className="activity-text">At vero eos et accusamus et iusto odio dignissimos ducimus qui deleniti atque...<Link to="#" className="text-success">Read more</Link></span>
                                        </div>
                                    </li>
                                    <li className="feed-item">
                                        <div className="feed-item-list">
                                            <span className="date">Jan 19</span>
                                            <span className="activity-text">Joined the group “Boardsmanship Forum”</span>
                                        </div>
                                    </li>
                                    <li className="feed-item">
                                        <div className="feed-item-list">
                                            <span className="date">Jan 17</span>
                                            <span className="activity-text">Responded to need “In-Kind Opportunity”</span>
                                        </div>
                                    </li>
                                    <li className="feed-item">
                                        <div className="feed-item-list">
                                            <span className="date">Jan 16</span>
                                            <span className="activity-text">Sed ut perspiciatis unde omnis iste natus error sit rem.</span>
                                        </div>
                                    </li>
                                </ol>
                                <div className="text-center">
                                    <Link to="#" className="btn btn-primary">Load More</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-5">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card text-center">
                                    <div className="card-body">
                                        <div className="py-4">
                                            <i className="ion ion-ios-checkmark-circle-outline display-4 text-success"></i>

                                            <h5 className="text-primary mt-4">Order Successful</h5>
                                            <p className="text-muted">Thanks you so much for your order.</p>
                                            <div className="mt-4">
                                                <Link to="" className="btn btn-primary btn-sm">Chack Status</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>                    

                            </div>
                            <div className="col-md-6">
                                <div className="card bg-primary">
                                    <div className="card-body">
                                        <div className="text-center text-white py-4">
                                            <h5 className="mt-0 mb-4 text-white-50 font-16">Top Product Sale</h5>
                                            <h1>1452</h1>
                                            <p>Computer</p>
                                            <p className="text-white-50 mb-0">At solmen va esser necessi far uniform plu sommun myth... <Link to="#" className="text-white">View more</Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="mt-0 header-title mb-4">Client Reviews</h4>
                                        <p className="text-muted mb-5">" Everyone realizes why a new common language would be desirable one could refuse to pay expensive translators it would be necessary. "</p>
                                        <div className="float-right mt-2">
                                            <Link to="#" className="text-primary">
                                                <i className="mdi mdi-arrow-right h5"></i>
                                            </Link>
                                        </div>
                                        <h6 className="mb-0"><img src="assets/images/users/user-3.jpg" alt="" className="thumb-sm rounded-circle mr-2" /> James Athey</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-8">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="mt-0 header-title mb-4">Latest Trasaction</h4>
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                            <th scope="col">(#) Id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col" colSpan="2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <th scope="row">#14256</th>
                                            <td>
                                                <div>
                                                    <img src="assets/images/users/user-2.jpg" alt="" className="thumb-md rounded-circle mr-2" /> Philip Smead
                                                </div>
                                            </td>
                                            <td>15/1/2018</td>
                                            <td>$94</td>
                                            <td><span className="badge badge-success">Delivered</span></td>
                                            <td>
                                                <div>
                                                    <Link to="#" className="btn btn-primary btn-sm">Edit</Link>
                                                </div>
                                            </td>
                                            </tr>
                                            <tr>
                                            <th scope="row">#14257</th>
                                            <td>
                                                <div>
                                                    <img src="assets/images/users/user-3.jpg" alt="" className="thumb-md rounded-circle mr-2" /> Brent Shipley
                                                </div>
                                            </td>
                                            <td>16/1/2019</td>
                                            <td>$112</td>
                                            <td><span className="badge badge-warning">Pending</span></td>
                                            <td>
                                                <div>
                                                    <Link to="#" className="btn btn-primary btn-sm">Edit</Link>
                                                </div>
                                            </td>
                                            </tr>
                                            <tr>
                                            <th scope="row">#14258</th>
                                            <td>
                                                <div>
                                                    <img src="assets/images/users/user-4.jpg" alt="" className="thumb-md rounded-circle mr-2" /> Robert Sitton
                                                </div>
                                            </td>
                                            <td>17/1/2019</td>
                                            <td>$116</td>
                                            <td><span className="badge badge-success">Delivered</span></td>
                                            <td>
                                                <div>
                                                    <Link to="#" className="btn btn-primary btn-sm">Edit</Link>
                                                </div>
                                            </td>
                                            </tr>
                                            <tr>
                                            <th scope="row">#14259</th>
                                            <td>
                                                <div>
                                                    <img src="assets/images/users/user-5.jpg" alt="" className="thumb-md rounded-circle mr-2" /> Alberto Jackson
                                                </div>
                                            </td>
                                            <td>18/1/2019</td>
                                            <td>$109</td>
                                            <td><span className="badge badge-danger">Cancel</span></td>
                                            <td>
                                                <div>
                                                    <Link to="#" className="btn btn-primary btn-sm">Edit</Link>
                                                </div>
                                            </td>
                                            </tr>
                                            <tr>
                                            <th scope="row">#14260</th>
                                            <td>
                                                <div>
                                                    <img src="assets/images/users/user-6.jpg" alt="" className="thumb-md rounded-circle mr-2" /> David Sanchez
                                                </div>
                                            </td>
                                            <td>19/1/2019</td>
                                            <td>$120</td>
                                            <td><span className="badge badge-success">Delivered</span></td>
                                            <td>
                                                <div>
                                                    <Link to="#" className="btn btn-primary btn-sm">Edit</Link>
                                                </div>
                                            </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="mt-0 header-title mb-4">Chat</h4>
                                <div className="chat-conversation">
                                <Scrollbars style={{ height: "420px" }}>
                                    <ul className="conversation-list slimscroll" >
                                        <li className="clearfix">
                                            <div className="chat-avatar">
                                                <img src="assets/images/users/user-2.jpg" alt="male" />
                                                <span className="time">10:00</span>
                                            </div>
                                            <div className="conversation-text">
                                                <div className="ctext-wrap">
                                                    <span className="user-name">John Deo</span>
                                                    <p>
                                                        Hello!
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="clearfix odd">
                                            <div className="chat-avatar">
                                                <img src="assets/images/users/user-3.jpg" alt="Female" />
                                                <span className="time">10:01</span>
                                            </div>
                                            <div className="conversation-text">
                                                <div className="ctext-wrap">
                                                    <span className="user-name">Smith</span>
                                                    <p>
                                                        Hi, How are you? What about our next meeting?
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <div className="chat-avatar">
                                                <img src="assets/images/users/user-2.jpg" alt="male" />
                                                <span className="time">10:04</span>
                                            </div>
                                            <div className="conversation-text">
                                                <div className="ctext-wrap">
                                                    <span className="user-name">John Deo</span>
                                                    <p>
                                                        Yeah everything is fine
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="clearfix odd">
                                            <div className="chat-avatar">
                                                <img src="assets/images/users/user-3.jpg" alt="male" />
                                                <span className="time">10:05</span>
                                            </div>
                                            <div className="conversation-text">
                                                <div className="ctext-wrap">
                                                    <span className="user-name">Smith</span>
                                                    <p>
                                                        Wow that's great
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="clearfix odd">
                                            <div className="chat-avatar">
                                                <img src="assets/images/users/user-3.jpg" alt="male" />
                                                <span className="time">10:08</span>
                                            </div>
                                            <div className="conversation-text">
                                                <div className="ctext-wrap">
                                                    <span className="user-name mb-2">Smith</span>
                                                    
                                                    <img src="assets/images/small/img-1.jpg" alt="Smith" height="48px" className="rounded mr-2" />
                                                    <img src="assets/images/small/img-2.jpg" alt="Smith" height="48px" className="rounded" />
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    </Scrollbars>
                                    <div className="row" style={myChat}>
                                        <div className="col-sm-9 col-8 chat-inputbar">
                                            <input type="text" className="form-control chat-input" placeholder="Enter your text" />
                                        </div>
                                        <div className="col-sm-3 col-4 chat-send">
                                            <button type="submit" className="btn btn-success btn-block">Send</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
                */}
               
                </div>
           
            </AUX>
        );
    }
}

export { Dashboard };   