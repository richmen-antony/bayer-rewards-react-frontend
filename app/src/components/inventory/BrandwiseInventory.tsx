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
  let totalClosingInventory: number = 0;
  return (
    <AUX>
      <div className="">
        <label className="font-weight-bold scanlabel">
          <FormattedMessage id="inventory.productInventory" /> - {_.startCase(_.toLower(distributorName))}
        </label>
        <div className="consolidatedSales-table scannedbrands" style={{ height: "23vh", overflowY: "auto" }}>
          <table className="table brandTable">
            <thead>
              <tr>
                <th
                  onClick={(e) => handleSort(e, "productbrand", selectedBrandList, isAsc, "BrandwiseInventory")}
                  style={{ width: "25%", cursor: "pointer" }}
                  key="productbrand"
                >
                  <FormattedMessage id="consolidated.brand" />
                  {tableCellIndex === 0 && tableName === "BrandwiseInventory" ? (
                    <i className={`fas ${isAsc ? "fa-sort-down" : "fa-sort-up"} ml-3`}></i>
                  ) : null}
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="inventory.opening" />
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="inventory.sellIn" />
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="inventory.sellOut" />
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="inventory.returns" />
                </th>
                <th className="invtHeader">
                  <FormattedMessage id="inventory.closing" />
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedBrandList?.length > 0 ? (
                selectedBrandList?.map((item: any, idx: number) => {
                  totalOpeningInventory = totalOpeningInventory + Number(item.openinginventory);
                  totalSellIn = totalSellIn + Number(item.sellin);
                  totalSellOut = totalSellOut + Number(item.sellout);
                  totalReturns = totalReturns + Number(item.returns);
                  totalClosingInventory = totalClosingInventory + Number(item.closinginventory);
                  return (
                    <tr
                      style={{
                        cursor: "pointer",
                        backgroundColor: selectedBrand === idx ? "#F5FCFF" : "",
                      }}
                      key={idx}
                      onClick={() => getSelectedProducts(item.rtmppartnerid, item.productbrand, idx)}
                    >
                      <td style={{ width: "25%", padding: "5px" }}>{_.startCase(_.toLower(item.productbrand))}</td>
                      <td style={{ width: "15%", paddingRight: "0.5em" }} className="text-right">
                        {item.openinginventory}
                      </td>
                      <td style={{ width: "15%", paddingRight: "0.5em" }} className="text-right">
                        {item.sellin}
                      </td>
                      <td style={{ width: "15%", paddingRight: "0.5em" }} className="text-right">
                        {item.sellout}
                      </td>
                      <td style={{ width: "15%", paddingRight: "0.5em" }} className="text-right">
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
                <th style={{ width: "25%", padding: "5px" }}>
                  <FormattedMessage id="consolidated.total" />
                  &nbsp;({selectedBrandList?.length})
                </th>
                <th className="invtFooter">{totalOpeningInventory}</th>
                <th className="invtFooter">{totalSellIn}</th>
                <th className="invtFooter">{totalSellOut}</th>
                <th className="invtFooter">{totalReturns}</th>
                <th className="invtFooter">{totalClosingInventory}</th>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </AUX>
  );
};
export default BrandwiseInventory;
