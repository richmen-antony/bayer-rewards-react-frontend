import React, { useState } from "react";
import SimpleDialog from "../../container/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Theme, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import advisorImg from "../../assets/images/advisor.svg";
import farmerImg from "../../assets/images/farmer.svg";
import retailerImg from "../../assets/images/retailer.svg";
import moment from "moment";
import "../../assets/scss/order.scss";
import _ from "lodash";
import CornImg from "../../assets/icons/corn_products.svg";
import "../../assets/scss/configurations.scss";
import RtArrow from "../../assets/icons/right_arrow.svg";
import FarmerDenied from "../../assets/icons/farmer_denied.svg";
const popupHeader = {
  title: "Order ID",
  sub: "1538",
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    overflow: "hidden",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    justifyContent: "center",
  },
}))(MuiDialogActions);

interface Props {
  open: boolean;
  close: () => void;
  data: any;
}
/**
 *OrderTable Functional Component
 * @param props
 * @returns
 */
const OrderTable: React.FC<Props> = ({ open, close, data }) => {
  const [accordionView, handleAccordion] = React.useState(false);
  const [accordionId, setAccordionId] = React.useState("");
  const [accordion, setAccordion] = useState(false);

  const handleExpand = (value: any) => {
    handleAccordion(!accordionView);
    setAccordionId(value.order_id);
  };
  const handleButton = (id: string) => {
    setAccordion(!accordion);
  };
  return (
    <SimpleDialog
      open={open}
      onClose={close}
      maxWidth={"800px"}
      header={popupHeader}
    >
      <DialogContent>
        <div className="popup-container ordered-table">
          <div className="popup-content">
            <div className={`popup-title order`}>
              <p>
                ORDER ID <label>{data?.orderid}</label>{" "}
              </p>
            </div>
          </div>
          <div className="wrapper-progressBar">
            <ul className="progressBar">
              <li className="active">
                <div className="line-cnt">
                  <p>Ordered date</p>
                  <label>
                    {data.ordereddate &&
                      moment(data.ordereddate).format("Do MMM, YYYY")}
                  </label>
                </div>
                <div className="content">
                  <img src={advisorImg} alt="" />

                  <p>Advisor ID & Name</p>
                  <span>
                    {data.advisorid} - {data.advisorname}
                  </span>
                </div>
              </li>
              <li className={`${data.orderstatus === "FULFILLED" ?"active" :data.orderstatus === "EXPIRED"?"inactive" :""} `}>
                <div className="line-cnt-expiry-date">
                  <p>{data.orderstatus === "FULFILLED" ? "Fulfilled date" : data.orderstatus === "EXPIRED"?"Expiry date" :""}</p>
                  <label>
                    {data.orderexpirydate &&
                      moment(data.orderexpirydate).format("Do MMM, YYYY")}
                  </label>
                </div>
                <div className="content">
                  <img src={retailerImg} alt="" />
                  <p>Retailer ID & Name</p>
                  <span>
                    {data.staffname} - {data.staffid}
                  </span>
                </div>
              </li>
              <li>
                <div className="content">
                  <img src={data.orderstatus === "FULFILLED" ? farmerImg:FarmerDenied} alt="" />
                  <p>Farmer ID & Name</p>
                  <span>
                    {data.farmerid} - {data.farmername}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {data?.products_ordered?.length > 0 ? (
            <>
              <div className="sub-order">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>NAME</th>
                      <th>TYPE</th>
                      <th>INTENDED QTY</th>
                      <th>ORDERED QTY</th>
                      <th>TOTAL COST</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products_ordered.map((value: any, index: number) => {
                      return (
                        <>
                          <tr key={index} onClick={() => handleExpand(value)}>
                            <th scope="row">{<img src={CornImg} />}</th>
                            <td>{value.productname}</td>
                            <td>{value.productgroup || "Seed-corn"}</td>
                            <td>{value.intendedquantity}</td>
                            <td>{value.orderedquantity}</td>
                            <td>{"MK " + value.productprice}</td>
                            {data.orderstatus === "FULFILLED" &&
                            <td>
                              <i
                                className={`fas ${
                                  accordionView ? "fa-sort-down" : "fa-sort-up"
                                }`}
                              />
                            </td>
                           }
                          </tr>
                          {accordionView && value?.order_id === accordionId && data.orderstatus === "FULFILLED"&& (
                            <tr>
                              <td
                                colSpan={7}
                                style={{ padding: 0, borderTop: 0 }}
                              >
                                <table className="inner-table">
                                  <tbody>
                                    {value.ordered_qrcodes &&
                                    value.ordered_qrcodes.map((list:any)=>{
                                      return (
                                        <tr>
                                      <td className="title">
                                        <p>Label ID</p>
                                        <p className="sub-val">Batch #</p>
                                      </td>
                                      <td>
                                        <p className="qr-val">
                                          {list.labelid}
                                        </p>
                                        <p className="sub-val">  {list.batchno}</p>
                                      </td>
                                      
                                    </tr>
                                      )
                                    }
                                      )
                                    }
                                    
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
               {data.orderstatus === "FULFILLED" &&
                <div id="accordion">
                  <div className="card dev product-sold-popup">
                    <div
                      className="card-header"
                      id="headingOne"
                      onClick={() => handleButton("e")}
                    >
                      <span>{"Invalid Scans (0)"}</span>
                      <img src={RtArrow} />
                        <span>Expired Labels (0)</span> 
                      <div>
                        <span>Non Bayer Labels (0)</span>
                      </div>
                      <div className="expand-icon">
                        <i
                          className={`fa ${
                            accordion ? "fas fa-caret-down" : "fas fa-caret-up"
                          } `}
                        ></i>
                      </div>
                    </div>

                    {/* <div
                      id="collapseOne"
                      className={`collapse ${accordion && "show"}`}
                      aria-labelledby="headingOne"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        <table className="inner-table">
                          <tbody>
                            <tr>
                              <td className="title">
                                <p>Label ID</p>
                                <p className="sub-val">Reason</p>
                              </td>
                              <td>
                                <p className="qr-val">625823651452258</p>
                                <p className="sub-val">Non Bayer Products</p>
                              </td>
                              <td>
                                <p className="qr-val">632581548902502</p>
                                <p className="sub-val">Non Bayer Products</p>
                              </td>
                              <td>
                                <p className="qr-val">6250258403665286</p>
                                <p className="sub-val">Expired Label</p>
                              </td>
                              
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div> */}
                  </div>
               
                </div>
                 }
                
              </div>
                        

              <div className="sum-total">
                <p className="total">Total</p>

                <span className="intendedquantity">
                  {_.sumBy(data.products_ordered, "intendedquantity")}
                </span>

                <span className="orderedquantity">
                  {_.sumBy(data.products_ordered, "orderedquantity")}
                </span>
                <span className="productprice">
                  {"MK " +
                    _.sumBy(data.products_ordered, (item: any) =>
                      Number(item.productprice)
                    )}
                </span>
              </div>
            </>
          ) : (
            <div className="col-12 card mt-4">
              <div className="card-body ">
                <div className="text-red py-4 text-center">No Data Found</div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </SimpleDialog>
  );
};

export default OrderTable;
