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

const ProductBrandList = ({
  selectedBrandList,
  getSelectedProducts,
  distributorName,
  selectedBrand,
  handleSort,
  isAsc,
  tableCellIndex,
  tableName,
}: ProductBrandProps) => {
  let totalReceivedGoods: number = 0;
  let totalSendGoods: number = 0;
  let totalWalkInSales: number = 0;
  let totalAdvisorSales: number = 0;
  return (
    <AUX>
      <div className="">
        <label className="font-weight-bold scanlabel">
          product brand wise scans - {_.startCase(_.toLower(distributorName))}
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
                      "scannedBrands"
                    )
                  }
                  style={{ width: "18%", padding: "5px" }}
                  key="productbrand"
                >
                  BRAND
                  {tableCellIndex === 0 && tableName === "scannedBrands" ? (
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
                  S2F-WALK-IN-SALES
                </th>
                <th
                  style={{
                    width: "20%",
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
              {selectedBrandList?.length > 0 ? (
                selectedBrandList?.map((item: any, idx: number) => {
                  totalReceivedGoods = totalReceivedGoods + item.RECEIVE_GOOD;
                  totalSendGoods = totalSendGoods + item.SEND_GOOD;
                  totalWalkInSales = totalWalkInSales + item.S2F_WALKIN;
                  totalAdvisorSales = totalAdvisorSales + item.S2F_ADVISOR;
                  return (
                    <tr
                      style={{
                        cursor: "pointer",
                        backgroundColor: selectedBrand === idx ? "#F5FCFF" : "",
                      }}
                      key={idx}
                      onClick={() =>
                        getSelectedProducts(
                          item.soldbyid,
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
                        {item.RECEIVE_GOOD}
                      </td>
                      <td
                        style={{ width: "20%", paddingRight: "0.5em" }}
                        className="text-right"
                      >
                        {item.SEND_GOOD}
                      </td>
                      <td
                        style={{ width: "20%", paddingRight: "0.5em" }}
                        className="text-right"
                      >
                        {item.S2F_WALKIN}
                      </td>
                      <td
                        style={{ width: "22%", paddingRight: "0.5em" }}
                        className="text-right"
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
        {/* {selectedBrandList?.length > 0 &&
            <div className="consolidated-sum-total">
                <table style={{ width: '100%', marginTop: "5px"}}>
                  <tbody>
                    <tr>
                    <td style={{ width: "18%", paddingLeft: "10px" }}> 
                        <span className="total">Total({selectedBrandList?.length})</span>
                      </td>
                      <td className="text-center" style={{ width: "15%" }}>
                      <span>
                        {totalReceivedGoods}
                      </span>
                    </td>
                    <td className="text-center" style={{ width: "23%" }}>
                      <span>
                        {totalSendGoods}
                      </span>
                    </td>
                    <td className="text-center" style={{ width: "21%" }}>
                      <span className="">
                        {totalWalkInSales}
                      </span>
                    </td>
                    <td className="text-center" style={{ width: "23%" }}>
                    <span className="productprice">
                        {totalAdvisorSales}
                      </span>
                    </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            } */}

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
                  {totalReceivedGoods}
                </th>
                <th
                  style={{ width: "20%", padding: "5px", textAlign: "right" }}
                >
                  {totalSendGoods}
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
export default ProductBrandList;
