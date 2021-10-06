import React from "react";
import AUX from "../../hoc/Aux_";
import _ from "lodash";
import "../../assets/scss/consolidatedSales.scss";
import { FormattedMessage } from "react-intl";

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
          <FormattedMessage id="consolidated.productBrand" /> - {_.startCase(_.toLower(distributorName))}
        </label>
        <div className="consolidatedSales-table scannedbrands" style={{ height: "23vh", overflowY: "auto" }}>
          <table className="table brandTable">
            <thead>
              <tr>
                <th
                  onClick={(e) => handleSort(e, "productbrand", selectedBrandList, isAsc, "scannedBrands")}
                  style={{ width: "23%", cursor: "pointer" }}
                  key="productbrand"
                >
                  <FormattedMessage id="consolidated.brand" />
                  {tableCellIndex === 0 && tableName === "scannedBrands" ? (
                    <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i>
                  ) : null}
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="consolidated.sendGoods" />
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="consolidated.receiveGoods" />
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="consolidated.walkIn" />
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="consolidated.advisor" />
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
                      onClick={() => getSelectedProducts(item.soldbyid, item.productbrand, idx)}
                    >
                      <td style={{ width: "23%", padding: "5px" }}>{_.startCase(_.toLower(item.productbrand))}</td>
                      <td style={{ width: "15%", paddingRight: "0.5em" }} className="text-right">
                        {item.SEND_GOOD}
                      </td>
                      <td style={{ width: "20%", paddingRight: "0.5em" }} className="text-right">
                        {item.RECEIVE_GOOD}
                      </td>
                      <td style={{ width: "20%", paddingRight: "0.5em" }} className="text-right">
                        {item.S2F_WALKIN}
                      </td>
                      <td style={{ width: "22%", paddingRight: "0.5em" }} className="text-right">
                        {item.S2F_ADVISOR}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ height: "110px" }}>
                  <td colSpan={10} className="no-records">
                    <FormattedMessage id="noRecords" />
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
                <th style={{ width: "23%", padding: "5px" }}>
                  <FormattedMessage id="consolidated.total" />
                  &nbsp;({selectedBrandList?.length})
                </th>
                <th style={{ width: "15%", padding: "5px", textAlign: "right" }}>{totalSendGoods}</th>
                <th style={{ width: "20%", padding: "5px", textAlign: "right" }}>{totalReceivedGoods}</th>
                <th style={{ width: "20%", padding: "5px", textAlign: "right" }}>{totalWalkInSales}</th>
                <th style={{ width: "22%", padding: "5px", textAlign: "right" }}>{totalAdvisorSales}</th>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </AUX>
  );
};
export default ProductBrandList;
