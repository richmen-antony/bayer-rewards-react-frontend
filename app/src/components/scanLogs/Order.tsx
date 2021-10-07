import React, { useState, useEffect } from "react";
import SimpleDialog from "../../containers/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { Theme, withStyles } from "@material-ui/core/styles";
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
import CpproductImg from "../../assets/icons/cp_products.svg";
import NoImg from "../../assets/images/no-image-circle.jpg";
import * as myConstClass from "../../utility/constant";
import { FormattedMessage } from "react-intl";
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
  const [invalidScanLabel, setInvalidScanLabel] = useState({});

  const handleExpand = (value: any) => {
    handleAccordion(!accordionView);
    setAccordionId(value.orderlineitemid);
  };
  const handleButton = (id: string) => {
    setAccordion(!accordion);
  };
  const getInvalidScanLabel = () => {
    const array = data?.invalidscans;
    const result = array?.reduce((acc: any, o: any) => ((acc[o.reason] = (acc[o.reason] || 0) + 1), acc), {});
    setInvalidScanLabel(result);
  };
  useEffect(() => {
    getInvalidScanLabel();
  }, []);
  return (
    <SimpleDialog open={open} onClose={close} maxWidth={"800px"} header={popupHeader}>
      <DialogContent>
        <div className="popup-container ordered-table">
          <div className="popup-content">
            <div className={`popup-title order`}>
              <p>
                <label>
                  #{data?.advisororderid} - {_.startCase(_.toLower(data?.accountname))}
                </label>
              </p>
            </div>
          </div>
          <div className="wrapper-progressBar">
            <ul className="progressBar">
              <li className="active">
                <div className="line-cnt">
                  <p>
                    {" "}
                    <FormattedMessage id="scanLog.productPopup.orderDate" />
                  </p>
                  <label>{data.ordereddate && moment(data.ordereddate).format("Do MMM, YYYY")}</label>
                </div>
                <div className="content">
                  <img src={advisorImg} alt="" />

                  <p>
                    {" "}
                    <FormattedMessage id="scanLog.productPopup.advisorIdName" />
                  </p>
                  <span>
                    {data.advisorid} - {data.advisorname}
                  </span>
                </div>
              </li>
              <li
                className={`${
                  data.orderstatus === "FULFILLED" ? "active" : data.orderstatus === "EXPIRED" ? "inactive" : ""
                } `}
              >
                <div className="line-cnt-expiry-date">
                  <p>
                    {data.orderstatus === "FULFILLED" ? (
                      <FormattedMessage id="scanLog.productPopup.fullfilledDate" />
                    ) : data.orderstatus === "EXPIRED" ? (
                      <FormattedMessage id="scanLog.productPopup.expiredDate" />
                    ) : (
                      ""
                    )}
                  </p>
                  <label>{data.lastupdateddate && moment(data.lastupdateddate).format("Do MMM, YYYY")}</label>
                </div>
                <div className="content">
                  <img src={retailerImg} alt="" />
                  <p>
                    <FormattedMessage id="scanLog.productPopup.fullfilledIdName" />
                  </p>
                  <span>
                    {data.staffid} - {data.staffname}
                  </span>
                </div>
              </li>
              <li>
                <div className="content">
                  <img src={data.orderstatus === "FULFILLED" ? farmerImg : FarmerDenied} alt="" />
                  <p>
                    {" "}
                    <FormattedMessage id="scanLog.productPopup.farmerIdName" />
                  </p>
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
                      <th>
                        <FormattedMessage id="scanLog.productPopup.name" />
                      </th>
                      <th>
                        <FormattedMessage id="scanLog.productPopup.type" />
                      </th>
                      <th>
                        <FormattedMessage id="scanLog.productPopup.intendedQty" />
                      </th>
                      <th>
                        <FormattedMessage id="scanLog.productPopup.orderQty" />
                      </th>
                      <th>
                        <FormattedMessage id="scanLog.productPopup.totalCost" />
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products_ordered.map((value: any, index: number) => {
                      return (
                        <React.Fragment key={index}>
                          {value.intendedquantity || value.orderedquantity ? (
                            <tr
                              key={index}
                              onClick={() => value?.ordered_qrcodes?.length > 0 && handleExpand(value)}
                              style={{
                                cursor: `${value?.ordered_qrcodes?.length > 0 && "pointer"}`,
                              }}
                            >
                              <th scope="row">
                                {
                                  <img
                                    src={
                                      value.productgroup === "CORN SEED" || value.productgroup === "HYBRID"
                                        ? CornImg
                                        : value.productgroup === "FUNGICIDES" ||
                                          value.productgroup === "HERBICIDES" ||
                                          value.productgroup === "INSECTICIDES"
                                        ? CpproductImg
                                        : NoImg
                                    }
                                    width={40}
                                    alt=""
                                  />
                                }
                              </th>
                              <td>
                                {value.productname} <p className="font-13px">{value.materialid}</p>
                              </td>
                              <td>
                                {value.productgroup === "CORN SEED" || value.productgroup === "HYBRID"
                                  ? `Seed - ${_.startCase(_.toLower(value.productgroup))}`
                                  : `CP - ${_.startCase(_.toLower(value.productgroup))} `}
                              </td>
                              <td className="text-center font-13px">{value.intendedquantity}</td>
                              <td className="text-center font-13px">{value.orderedquantity}</td>
                              <td className="font-13px">{"MK " + value.productprice}</td>
                              {data.orderstatus === "FULFILLED" && value?.ordered_qrcodes?.length > 0 && (
                                <td style={{ cursor: "pointer" }}>
                                  <i
                                    className={`fas ${
                                      value?.orderlineitemid === accordionId && accordionView ? "fa-sort-down" : "fa-sort-up"
                                    }`}
                                  />
                                </td>
                              )}
                            </tr>
                          ) : null}
                          {accordionView && value?.orderlineitemid === accordionId && data.orderstatus === "FULFILLED" && (
                            <tr>
                              <td colSpan={7} style={{ padding: 0, borderTop: 0 }}>
                                <div>
                                  <div className="inner-expand">
                                    <div className="title inner-row">
                                      <p>
                                        <FormattedMessage id="scanLog.productPopup.labelId" />
                                      </p>
                                      <p className="sub-val">
                                        <FormattedMessage id="scanLog.productPopup.batch" /> #
                                      </p>
                                    </div>
                                    {value?.ordered_qrcodes?.length > 0 &&
                                      value.ordered_qrcodes.map((list: any, qrIndex: number) => {
                                        return (
                                          <div className="inner-row font-13px" key={qrIndex}>
                                            <p className="qr-val">{list.labelid}</p>
                                            <p className="sub-val"> {list.batchno}</p>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                    <tr>
                      <td colSpan={8}>
                        {data.orderstatus === "FULFILLED" && (
                          <div id="accordion">
                            <div className="card order-accordion product-sold-popup">
                              <div
                                className="card-header"
                                id="headingOne"
                                onClick={() => data?.invalidscans?.length > 0 && handleButton("e")}
                                style={{
                                  cursor: `${data?.invalidscans?.length > 0 && "pointer"}`,
                                }}
                              >
                                <span>
                                  {`${myConstClass.INVALID_SCANS} (${
                                    data?.invalidscans?.length > 0 ? data?.invalidscans?.length : 0
                                  })`}
                                </span>
                                {/* {data?.invalidscans?.length > 0 &&<img src={RtArrow} alt="" />}
																{ invalidScanLabel&&Object.entries(invalidScanLabel).map(([key,label]) => {
																		return(
																			<div>
																			<span>{key}({label})</span>
																		  </div>
																		)		
																})} */}
                                {/* <span>
																	{`${myConstClass.EXPIRED_LABEL} (${
																		data?.invalidscans?.filter(
																			(i: any) => i.reason.toLowerCase() === myConstClass.EXPIRED_LABEL_DESC.toLowerCase()
																		).length > 0
																			? data?.invalidscans?.filter(
																					(i: any) =>
																						i.reason.toLowerCase() === myConstClass.EXPIRED_LABEL_DESC.toLowerCase()
																			  ).length
																			: 0
																	})`}
																</span>
																<div>
																	<span>
																		{`${myConstClass.NON_ADVISOR_LABEL} (${
																			data?.invalidscans?.filter(
																				(i: any) =>
																					i.reason.toLowerCase() === myConstClass.NON_ADVISOR_LABEL_DESC.toLowerCase()
																			).length > 0
																				? data?.invalidscans?.filter(
																						(i: any) =>
																							i.reason.toLowerCase() === myConstClass.NON_ADVISOR_LABEL_DESC.toLowerCase()
																				  ).length
																				: 0
																		})`}
																	</span>
																</div>
																<div>
																	<span>
																		{`${myConstClass.NON_BAYER_LABEL} (${
																			data?.invalidscans?.filter(
																				(i: any) =>
																					i.reason.toLowerCase() === myConstClass.NON_BAYER_LABEL_DESC.toLowerCase()
																			).length > 0
																				? data?.invalidscans?.filter(
																						(i: any) =>
																							i.reason.toLowerCase() === myConstClass.NON_BAYER_LABEL_DESC.toLowerCase()
																				  ).length
																				: 0
																		})`}
																	</span>
																</div>
																<div>
																	<span>
																		{`${myConstClass.DUPLICATE_LABEL} (${
																			data?.invalidscans?.filter(
																				(i: any) =>
																					i.reason.toLowerCase() === myConstClass.DUPLICATE_LABEL_DESC.toLowerCase()
																			).length > 0
																				? data?.invalidscans?.filter(
																						(i: any) =>
																							i.reason.toLowerCase() === myConstClass.DUPLICATE_LABEL_DESC.toLowerCase()
																				  ).length
																				: 0
																		})`}
																	</span>
																</div> */}
                                <div className="expand-icon">
                                  {data?.invalidscans?.length > 0 && (
                                    <i className={`fa ${accordion ? "fas fa-caret-down" : "fas fa-caret-up"} `}></i>
                                  )}
                                </div>
                              </div>

                              <div
                                id="collapseOne"
                                className={`collapse ${accordion && "show"}`}
                                aria-labelledby="headingOne"
                                data-parent="#accordion"
                              >
                                <div className="inner-expand">
                                  <div className="title inner-row">
                                    <p>
                                      <FormattedMessage id="scanLog.productPopup.labelId" />
                                    </p>
                                    <p className="sub-val">
                                      <FormattedMessage id="scanLog.productPopup.reason" />
                                    </p>
                                  </div>
                                  <div className="invalid-list">
                                    {data?.invalidscans?.length > 0 &&
                                      data?.invalidscans.map((scan: any, scanIndex: number) => {
                                        return (
                                          <div className="inner-row" key={scanIndex}>
                                            <p className="qr-val font-13px">{scan.scannedlabel || "-"}</p>
                                            <p className="sub-val">{scan.reason}</p>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="sum-total">
                    <tr>
                      <td colSpan={2}></td>
                      <td>
                        <p className="total">
                          {" "}
                          <FormattedMessage id="scanLog.productPopup.total" />
                        </p>
                      </td>
                      <td className="text-center">
                        <span className="intendedquantity">{data.totalintendedquantity}</span>
                      </td>
                      <td className="text-center">
                        <span className="orderedquantity">{data.totalorderedquantity}</span>
                      </td>
                      <td>
                        <span className="productprice">{"MK " + data.totalcost}</span>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <div className="col-12 card mt-4">
              <div className="card-body ">
                <div className="text-red py-4 text-center">
                  <FormattedMessage id="noRecords" />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </SimpleDialog>
  );
};

export default OrderTable;
