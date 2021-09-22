import React from "react";
import AUX from "../../hoc/Aux_";
import _ from "lodash";
import "../../assets/scss/consolidatedSales.scss";

export type ProductListProps = {
  selectedProductList: Array<object>;
  brandName: String;
  handleSort: Function;
  isAsc: Boolean;
  tableCellIndex: any;
  tableName: string;
};

export const ProductList = ({
  selectedProductList,
  brandName,
  handleSort,
  isAsc,
  tableCellIndex,
  tableName,
}: ProductListProps) => {
  let totalReceivedGoods: number = 0;
  let totalSendGoods: number = 0;
  let totalWalkInSales: number = 0;
  let totalAdvisorSales: number = 0;
  return (
    <AUX>
      <div className="">
        <label className="font-weight-bold scanlabel">
          product wise scans - {_.startCase(_.toLower(brandName))}
        </label>
        <div
          className="consolidatedSales-table scannedProducts"
          style={{ height: "26vh", overflowY: "auto" }}
        >
          <table className="table listTable">
            <thead>
              <tr>
                <th
                  onClick={(e) =>
                    handleSort(
                      e,
                      "productname",
                      selectedProductList,
                      isAsc,
                      "scannedProducts"
                    )
                  }
                  style={{ width: "23%", padding: "5px" }}
                  key="productname"
                >
                  PRODUCT
                  {tableCellIndex === 0 && tableName === "scannedProducts" ? (
                    <i
                      className={`fas ${
                        isAsc ? "fa-sort-down" : "fa-sort-up"
                      } ml-3`}
                    ></i>
                  ) : null}
                </th>
                <th
                  style={{
                    width: "15%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  SEND GOODS
                </th>
                <th
                  style={{
                    width: "20%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  RECEIVE GOODS
                </th>
                <th
                  style={{
                    width: "20%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  S2F-WALK-IN-SALES
                </th>
                <th
                  style={{
                    width: "22%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  S2F-ADVISOR SALES
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProductList?.length > 0 ? (
                selectedProductList?.map((item: any, i: number) => {
                  totalReceivedGoods = totalReceivedGoods + item.RECEIVE_GOOD;
                  totalSendGoods = totalSendGoods + item.SEND_GOOD;
                  totalWalkInSales = totalWalkInSales + item.S2F_WALKIN;
                  totalAdvisorSales = totalAdvisorSales + item.S2F_ADVISOR;
                  return (
                    <tr key={i}>
                      <td style={{ width: "23%", padding: "5px" }}>
                        {_.startCase(_.toLower(item.productname))}
                        <br />
                        <label style={{ fontSize: "10px" }}>
                          {item.productid}-{item.pkglevel}
                        </label>
                      </td>
                      <td
                        className="text-right"
                        style={{ width: "15%", paddingRight: "0.5em" }}
                      >
                        {item.SEND_GOOD}
                      </td>
                      <td
                        className="text-right"
                        style={{ width: "20%", paddingRight: "0.5em" }}
                      >
                        {item.RECEIVE_GOOD}
                      </td>
                      <td
                        className="text-right"
                        style={{ width: "20%", paddingRight: "0.5em" }}
                      >
                        {item.S2F_WALKIN}
                      </td>
                      <td
                        className="text-right"
                        style={{ width: "22%", paddingRight: "0.5em" }}
                      >
                        {item.S2F_ADVISOR}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ height: "110px" }}>
                  <td colSpan={10} className="no-records">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedProductList?.length > 0 && (
          <table
            className="table listTable bottom-table"
            style={{
              border: "1px solid grey",
              borderRadius: "10px",
              borderCollapse: "separate",
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "23%", padding: "5px" }}>
                  Total&nbsp;({selectedProductList?.length})
                </th>
                <th
                  style={{ width: "20%", padding: "5px", textAlign: "right" }}
                >
                  {totalSendGoods}
                </th>
                <th
                  style={{ width: "15%", padding: "5px", textAlign: "right" }}
                >
                  {totalReceivedGoods}
                </th>
                <th
                  style={{ width: "20%", padding: "5px", textAlign: "right" }}
                >
                  {totalWalkInSales}
                </th>
                <th
                  style={{ width: "22%", padding: "5px", textAlign: "right" }}
                >
                  {totalAdvisorSales}
                </th>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </AUX>
  );
};

export default ProductList;
