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
const popupHeader = {
  title: "Order ID",
  sub: "1538",
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    overflow:"hidden"
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
  const handleExpand = (value: any) => {
    handleAccordion(!accordionView);
    setAccordionId(value.order_id);
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
                {popupHeader?.title} <label>{data?.order_id}</label>{" "}
              </p>
            </div>
          </div>
          <div className="wrapper-progressBar">
            <ul className="progressBar">
              <li className="active">
                <div className="line-cnt">
                  <p>Ordered Date</p>
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
              <li className="active">
                <div className="line-cnt-expiry-date">
                  <p>Expiry Date</p>
                  <label>
                    {data.orderexpirydate &&
                      moment(data.orderexpirydate).format("Do MMM, YYYY")}
                  </label>
                </div>
                <div className="content">
                  <img src={retailerImg} alt="" />
                  <p>Retailer ID & Name</p>
                  <span>
                    {data.retailerid} - {data.sellername}
                  </span>
                </div>
              </li>
              <li>
                <div className="content">
                  <img src={farmerImg} alt="" />
                  <p>Farmer ID & Name</p>
                  <span>
                    {data.farmerid} - {data.farmername}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {data?.products_ordered?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>NAME</th>
                  <th>TYPE</th>
                  <th>INTENDED QTY</th>
                  <th>ORDERED QTY</th>
                  <th>TOTAL COST</th>
                </tr>
              </thead>
              <tbody>
                {data.products_ordered.map((value: any, index: number) => {
                  return (
                    <>
                      <tr key={index} onClick={() => handleExpand(value)}>
                        <th scope="row">{<img src={CornImg}/>}</th>
                        <td>{value.productsku}</td>
                        <td>{value.type || 0}</td>
                        <td>{value.intendedqty}</td>
                        <td>{value.orderedqty}</td>
                        <td>{value.price}</td>
                        <td>
                          <i className={`fas ${accordionView? "fa-sort-down" : "fa-sort-up"}` } />
                        </td>
                      </tr>
                      {accordionView && value?.order_id === accordionId &&
                      <tr>
                        <td colSpan={7}>
                          <table className="inner-table">
                            <tbody>
                              <tr>
                                <td className="title">
                                  <p>Label ID</p>
                                  <p className="sub-val">Batch #</p>
                                </td>
                                <td>
                                  <p>625823651452258</p>
                                  <p className="sub-val">125698</p>
                                </td>
                                <td>
                                  <p>632581548902502</p>
                                  <p className="sub-val">125698</p>
                                </td>
                                <td>
                                  <p>6250258403665286</p>
                                  <p className="sub-val">504147</p>
                                </td>
                                <td>
                                  <p>625823651452258</p>
                                  <p className="sub-val">304100</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                }
                    </>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td> Total</td>
                  <td>
                    <span>{_.sumBy(data.products_ordered,"intendedqty")}</span>
                  </td>
                  <td>{_.sumBy(data.products_ordered,"intendedqty")}</td>
                  <td>{_.sumBy(data.products_ordered,(item :any)=> Number(item.price))}</td>
                </tr>
              </tfoot>
            </table>
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
