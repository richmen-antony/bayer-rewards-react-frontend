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

export const ProductwiseInventory = ({
  selectedProductList,
  brandName,
  handleSort,
  isAsc,
  tableCellIndex,
  tableName,
}: ProductListProps) => {
  let totalOpeningInventory: number = 0;
  let totalSellIn: number = 0;
  let totalSellOut: number = 0;
  let totalReturns: number = 0;
  let totalClosingInventory: number = 0;
  return (
    <AUX>
      <div className="">
        <label className="font-weight-bold scanlabel">product wise inventory - {_.startCase(_.toLower(brandName))}</label>
        <div className="consolidatedSales-table scannedProducts" style={{ height: "26vh", overflowY: "auto" }}>
          <table className="table listTable">
            <thead>
              <tr>
                <th
                  onClick={(e) => handleSort(e, "productname", selectedProductList, isAsc, "ProductwiseInventory")}
                  style={{ width: "25%" }}
                  key="productname"
                >
                  PRODUCT
                  {tableCellIndex === 0 && tableName === "ProductwiseInventory" ? (
                    <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i>
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
                  OPENING
                </th>
                <th
                  style={{
                    width: "15%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  SELL-IN
                </th>
                <th
                  style={{
                    width: "15%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  SELL-OUT
                </th>
                <th
                  style={{
                    width: "15%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  RETURNS
                </th>
                <th
                  style={{
                    width: "15%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  CLOSING
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProductList?.length > 0 ? (
                selectedProductList?.map((item: any, i: number) => {
                  totalOpeningInventory = totalOpeningInventory + Number(item.openinginventory);
                  totalSellIn = totalSellIn + Number(item.sellin);
                  totalSellOut = totalSellOut + Number(item.sellout);
                  totalReturns = totalReturns + Number(item.returns);
                  totalClosingInventory = totalClosingInventory + Number(item.closinginventory);
                  return (
                    <tr key={i}>
                      <td style={{ width: "25%", padding: "5px" }}>
                        {_.startCase(_.toLower(item.productname))}
                        <br />
                        <label style={{ fontSize: "11px !important" }}>{item.materialid}</label>
                      </td>
                      <td className="text-right" style={{ width: "15%", paddingRight: "0.5em" }}>
                        {item.openinginventory}
                      </td>
                      <td className="text-right" style={{ width: "15%", paddingRight: "0.5em" }}>
                        {item.sellin}
                      </td>
                      <td className="text-right" style={{ width: "15%", paddingRight: "0.5em" }}>
                        {item.sellout}
                      </td>
                      <td className="text-right" style={{ width: "15%", paddingRight: "0.5em" }}>
                        {item.returns}
                      </td>
                      <td style={{ width: "15%", padding: "5px" }} className="text-right">
                        {item.closinginventory}
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
                <th style={{ width: "25%", padding: "5px" }}>Total&nbsp;({selectedProductList?.length})</th>
                <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalOpeningInventory}</th>
                <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalSellIn}</th>
                <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalSellOut}</th>
                <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalReturns}</th>
                <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalClosingInventory}</th>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </AUX>
  );
};

export default ProductwiseInventory;
