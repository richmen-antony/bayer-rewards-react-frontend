import React, { useState } from "react";
import SimpleDialog from "../../../containers/components/dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { Theme, withStyles } from "@material-ui/core/styles";
import advisorImg from "../../../assets/images/advisor.svg";
import farmerImg from "../../../assets/images/farmer.svg";
import retailerImg from "../../../assets/images/retailer.svg";
import moment from "moment";
import "../../../assets/scss/order.scss";
import _ from "lodash";
import CornImg from "../../../assets/icons/corn_products.svg";
import "../../../assets/scss/configurations.scss";
import RtArrow from "../../../assets/icons/right_arrow.svg";
import FarmerDenied from "../../../assets/icons/farmer_denied.svg";
import CpproductImg from "../../../assets/icons/cp_products.svg";
import NoImg from "../../../assets/images/no-image-circle.jpg";
import * as myConstClass from "../../../utility/constant";
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
 *WarehouseOrderTable Functional Component
 * @param props
 * @returns
 */
const WarehouseOrderTable: React.FC<Props> = ({ open, close, data }) => {
	const [accordionView, handleAccordion] = React.useState(false);
	const [accordionId, setAccordionId] = React.useState("");
	const [accordion, setAccordion] = useState(false);

	const handleExpand = (value: any) => {
		handleAccordion(!accordionView);
		setAccordionId(value.orderlineitemid);
	};
	const handleButton = (id: string) => {
		setAccordion(!accordion);
	};
	return (
		<SimpleDialog open={open} onClose={close} maxWidth={"800px"} header={popupHeader}>
			<DialogContent>
				<div className="popup-container ordered-table">
					<div className="popup-content">
						<div className={`popup-title order`}>
							<p>
								<label>
									#{data?.touserid} - {_.startCase(_.toLower(data?.tousername))}
								</label>
							</p>
						</div>
					</div>
					<div className="wrapper-progressBar">
						<ul className="progressBar">
							<li className="active">
								<div className="line-cnt">
									<p>Dispatched date</p>
									<label>{data.dispatcheddate && moment(data.dispatcheddate).format("Do MMM, YYYY")}</label>
								</div>
								<div className="content">
									<img src={advisorImg} alt="" />

									<p>Warehouse ID & Name</p>
									<span>
										{data.warehouseid} - {data.warehousename}
									</span>
								</div>
							</li>
							<li
								className={`${
									data.deliverystatus === "GOODS_DISPATCHED" ? "active" : data.deliverystatus === "EXPIRED" ? "inactive" : ""
								} `}
							>
								<div className="line-cnt-expiry-date">
									<p>
										{"Received date"}
									</p>
									<label>{data.receiveddate && moment(data.receiveddate).format("Do MMM, YYYY")}</label>
								</div>
								<div className="content">
									<img src={retailerImg} alt="" />
									<p>Scanned by ID & Name</p>
									<span>
										{data.scannedbyid} - {data.scannedbyname}
									</span>
								</div>
							</li>
							<li>
								<div className="content">
									<img src={data.deliverystatus === "GOODS_DISPATCHED" ? farmerImg : FarmerDenied} alt="" />
									<p>Retailer ID & Name</p>
									<span>
										{data.touserid} - {data.tousername}
									</span>
								</div>
							</li>
						</ul>
					</div>

					{data?.productsOrdered?.length > 0 ? (
						<>
							<div className="sub-order">
								<table className="table">
									<thead>
										<tr>
											<th></th>
											<th>NAME</th>
											<th>TYPE</th>
											<th>DISPATCHED QTY</th>
											<th>TOTAL COST</th>
											<th></th>
                      <th></th>
										</tr>
									</thead>
									<tbody>
										{data.productsOrdered.map((value: any, index: number) => {
											return (
												<React.Fragment key={index}>
													{value.intendedquantity || value.orderedquantity ? (
														<tr
															key={index}
															onClick={() => value?.qrCodes?.length > 0 && handleExpand(value)}
															style={{
																cursor: `${value?.qrCodes?.length > 0 && "pointer"}`,
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
																{value.productname} <p>{value.materialid}</p>
															</td>
															<td>
																{value.productgroup === "CORN SEED" || value.productgroup === "HYBRID"
																	? `Seed - ${_.startCase(_.toLower(value.productgroup))}`
																	: `CP - ${_.startCase(_.toLower(value.productgroup))} `}
															</td>
															<td className="text-center">{value.orderedquantity}</td>
															<td>{"MK " + value.materialprice}</td>
															{data.deliverystatus === "GOODS_DISPATCHED" && value?.qrCodes?.length > 0 && (
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
													{accordionView && value?.orderlineitemid === accordionId && data.deliverystatus === "GOODS_DISPATCHED" && (
														<tr>
															<td colSpan={7} style={{ padding: 0, borderTop: 0 }}>
																<div>
																	<div className="inner-expand">
																		<div className="title inner-row">
																			<p>Label ID</p>
																			<p className="sub-val">Batch #</p>
																		</div>
																		{value?.qrCodes?.length > 0 &&
																			value.qrCodes.map((list: any, qrIndex: number) => {
																				return (
																					<div className="inner-row" key={qrIndex}>
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
												{data.deliverystatus === "GOODS_DISPATCHED" && (
													<div id="accordion">
														<div className="card order-accordion product-sold-popup">
															<div
																className="card-header"
																id="headingOne"
																onClick={() => data?.invalidQrCodes?.length > 0 && handleButton("e")}
																style={{
																	cursor: `${data?.invalidQrCodes?.length > 0 && "pointer"}`,
																}}
															>
																<span>
																	{`${myConstClass.INVALID_SCANS} (${
																		data?.invalidQrCodes?.length > 0 ? data?.invalidQrCodes?.length : 0
																	})`}
																</span>
																<img src={RtArrow} alt="" />
																<span>
																	{`${myConstClass.EXPIRED_LABEL} (${
																		data?.invalidQrCodes?.filter(
																			(i: any) => i.reason.toLowerCase() === myConstClass.EXPIRED_LABEL_DESC.toLowerCase()
																		).length > 0
																			? data?.invalidQrCodes?.filter(
																					(i: any) =>
																						i.reason.toLowerCase() === myConstClass.EXPIRED_LABEL_DESC.toLowerCase()
																			  ).length
																			: 0
																	})`}
																</span>
																<div>
																	<span>
																		{`${myConstClass.NON_ADVISOR_LABEL} (${
																			data?.invalidQrCodes?.filter(
																				(i: any) =>
																					i.reason.toLowerCase() === myConstClass.NON_ADVISOR_LABEL_DESC.toLowerCase()
																			).length > 0
																				? data?.invalidQrCodes?.filter(
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
																			data?.invalidQrCodes?.filter(
																				(i: any) =>
																					i.reason.toLowerCase() === myConstClass.NON_BAYER_LABEL_DESC.toLowerCase()
																			).length > 0
																				? data?.invalidQrCodes?.filter(
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
																			data?.invalidQrCodes?.filter(
																				(i: any) =>
																					i.reason.toLowerCase() === myConstClass.DUPLICATE_LABEL_DESC.toLowerCase()
																			).length > 0
																				? data?.invalidQrCodes?.filter(
																						(i: any) =>
																							i.reason.toLowerCase() === myConstClass.DUPLICATE_LABEL_DESC.toLowerCase()
																				  ).length
																				: 0
																		})`}
																	</span>
																</div>
																<div className="expand-icon">
																	{data?.invalidQrCodes?.length > 0 && (
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
																		<p>Label ID</p>
																		<p className="sub-val">Reason</p>
																	</div>
																	<div className="invalid-list">
																		{data?.invalidQrCodes?.length > 0 &&
																			data?.invalidQrCodes.map((scan: any, scanIndex: number) => {
																				return (
																					<div className="inner-row" key={scanIndex}>
																						<p className="qr-val">{scan.scannedlabel || "-"}</p>
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
												<p className="total">Total</p>
											</td>
											<td className="text-center">
												<span className="orderedquantity">{data.totalqty}</span>
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
								<div className="text-red py-4 text-center">No Data Found</div>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</SimpleDialog>
	);
};

export default WarehouseOrderTable;
