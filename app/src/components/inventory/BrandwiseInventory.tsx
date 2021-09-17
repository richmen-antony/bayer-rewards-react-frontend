import React from "react";
import AUX from "../../hoc/Aux_";
import _ from "lodash";
import "../../assets/scss/consolidatedSales.scss";

export type ProductBrandProps = {
  selectedBrandList: Array<object>;
  getSelectedProducts: Function;
  distributorName: String;
  selectedBrand: Number;
  handleSort: Function;
  isAsc: Boolean;
  tableCellIndex: any;
  tableName?: string;
};

const BrandwiseInventory = ({
  selectedBrandList,
  getSelectedProducts,
  distributorName,
  selectedBrand,
  handleSort,
  isAsc,
  tableCellIndex,
  tableName,
}: ProductBrandProps) => {
  let totalOpeningInventory: number = 0;
  let totalSellIn: number = 0;
  let totalSellOut: number = 0;
  let totalReturns: number = 0;
  return (
    <AUX>
      <div className="">
        <label className="font-weight-bold scanlabel">
          product brand wise inventory - {_.startCase(_.toLower(distributorName))}
        </label>
        <div
          className="consolidatedSales-table scannedbrands"
          style={{ height: "23vh", overflowY: "auto" }}
        >
          <table className="table brandTable">
            <thead>
              <tr>
                <th
                  onClick={(e) =>
                    handleSort(
                      e,
                      "productbrand",
                      selectedBrandList,
                      isAsc,
                      "BrandwiseInventory"
                    )
                  }
                  style={{ width: "18%", padding: "5px" }}
                  key="productbrand"
                >
                  BRAND
                  {tableCellIndex === 0 && tableName === "BrandwiseInventory" ? (
                    <i
                      className={`fas ${
                        isAsc ? "fa-sort-down" : "fa-sort-up"
                      } ml-3`}
                    ></i>
                  ) : null}
                </th>
                <th
                  className="rtl"
                  style={{
                    width: "20%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  OPENING
                </th>
                <th
                  style={{
                    width: "20%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  SELL-IN
                </th>
                <th
                  style={{
                    width: "20%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  SELL-OUT
                </th>
                <th
                  style={{
                    width: "20%",
                    padding: "5px",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                 RETURNS
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedBrandList?.length > 0 ? (
                selectedBrandList?.map((item: any, idx: number) => {
                  totalOpeningInventory = totalOpeningInventory + item.openinginventory;
                  totalSellIn = totalSellIn + item.sellin;
                  totalSellOut = totalSellOut + item.sellout;
                  totalReturns = totalReturns + item.returns;
                  return (
                    <tr
                      style={{
                        cursor: "pointer",
                        backgroundColor: selectedBrand === idx ? "#F5FCFF" : "",
                      }}
                      key={idx}
                      onClick={() =>
                        getSelectedProducts(
                          item.rtmppartnerid,
                          item.productbrand,
                          idx
                        )
                      }
                    >
                      <td style={{ width: "18%", padding: "5px" }}>
                        {_.startCase(_.toLower(item.productbrand))}
                      </td>
                      <td
                        style={{ width: "20%", paddingRight: "0.5em" }}
                        className="text-right"
                      >
                        {item.openinginventory}
                      </td>
                      <td
                        style={{ width: "20%", paddingRight: "0.5em" }}
                        className="text-right"
                      >
                        {item.sellin}
                      </td>
                      <td
                        style={{ width: "20%", paddingRight: "0.5em" }}
                        className="text-right"
                      >
                        {item.sellout}
                      </td>
                      <td
                        style={{ width: "22%", paddingRight: "0.5em" }}
                        className="text-right"
                      >
                        {item.returns}
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
        {selectedBrandList?.length > 0 && (
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
                <th style={{ width: "18%", padding: "5px" }}>
                  Total&nbsp;({selectedBrandList?.length})
                </th>
                <th
                  style={{ width: "20%", padding: "5px", textAlign: "right" }}
                >
                  {totalOpeningInventory}
                </th>
                <th
                  style={{ width: "20%", padding: "5px", textAlign: "right" }}
                >
                  {totalSellIn}
                </th>
                <th
                  style={{ width: "20%", padding: "5px", textAlign: "right" }}
                >
                  {totalSellOut}
                </th>
                <th
                  style={{ width: "22%", padding: "5px", textAlign: "right" }}
                >
                  {totalReturns}
                </th>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </AUX>
  );
};
export default BrandwiseInventory;
