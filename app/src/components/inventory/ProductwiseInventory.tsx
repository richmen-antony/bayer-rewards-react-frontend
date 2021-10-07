import React from "react";
import AUX from "../../hoc/Aux_";
import _ from "lodash";
import "../../assets/scss/consolidatedSales.scss";
import { FormattedMessage } from "react-intl";

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
        <label className="font-weight-bold scanlabel">
          <FormattedMessage id="inventory.productWise" /> - {_.startCase(_.toLower(brandName))}
        </label>
        <div className="consolidatedSales-table scannedProducts" style={{ height: "26vh", overflowY: "auto" }}>
          <table className="table listTable">
            <thead>
              <tr>
                <th
                  onClick={(e) => handleSort(e, "productname", selectedProductList, isAsc, "ProductwiseInventory")}
                  style={{ width: "25%", cursor: "pointer" }}
                  key="productname"
                >
                  <FormattedMessage id="consolidated.productHeader" />
                  {tableCellIndex === 0 && tableName === "ProductwiseInventory" ? (
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
                    <FormattedMessage id="noRecords" />
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
                <th style={{ width: "25%", padding: "5px" }}>
                  <FormattedMessage id="consolidated.total" />
                  &nbsp;({selectedProductList?.length})
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

export default ProductwiseInventory;
