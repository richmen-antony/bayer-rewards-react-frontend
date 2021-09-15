import React from "react";
import AUX from "../../hoc/Aux_";
import _ from "lodash";
import "../../assets/scss/consolidatedSales.scss";

export type ProductListProps = {
  selectedProductList: Array<object>;
  brandName : String;
  handleSort :Function;
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
  tableName
}:ProductListProps) => {
  let totalReceivedGoods:number = 0;
  let totalSendGoods:number = 0;
  let totalWalkInSales:number = 0;
  let totalAdvisorSales:number = 0;
  return (
    <AUX>
        <div className="">
          <label className="font-weight-bold scanlabel">product wise inventory - {_.startCase(_.toLower(brandName))}</label>
          <div className="consolidatedSales-table scannedProducts"  style={{height: '28vh', overflowY: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                <th 
                     onClick={(e) => handleSort(e, "productname", selectedProductList, isAsc,"scannedProducts")}
                     style={{width:'17%'}}
                      key="productname">PRODUCT
                      {
                           (tableCellIndex === 0 && tableName === 'scannedProducts') ? (
                            <i
                              className={`fas ${
                                isAsc ? "fa-sort-down" : "fa-sort-up"
                              } ml-3`}
                            ></i>
                          ) : null
                        }
                      </th>
                    <th>OPENING</th>
                    <th>SELL-IN</th>
                    <th>SELL-OUT</th>
                    <th>RETURNS</th>
                    <th>CLOSING</th>
                </tr>
              </thead>
              <tbody>
                {selectedProductList?.length > 0 ? (
                  selectedProductList?.map((item: any, i: number) => {
                    totalReceivedGoods = totalReceivedGoods + (item.RECEIVE_GOOD);
                    totalSendGoods = totalSendGoods + (item.SEND_GOOD);
                    totalWalkInSales = totalWalkInSales + (item.S2F_WALKIN);
                    totalAdvisorSales = totalAdvisorSales + (item.S2F_ADVISOR);
                    return (
                      <tr key={i}>
                        <td>{_.startCase(_.toLower(item.productname))}
                        <br /><label style={{fontSize:'10px'}}>{item.productid}-{item.pkglevel}</label></td>
                        <td className="text-right">{item.RECEIVE_GOOD}</td>
                        <td className="text-right">{item.SEND_GOOD}</td>
                        <td className="text-right">{item.S2F_WALKIN}</td>
                        <td className="text-right">{item.S2F_ADVISOR}</td>
                        <td className="text-right">fdf</td>
                      </tr>
                    );
                  })
                ) :  (
                  <tr style={{ height: "110px" }}>
                    <td colSpan={10} className="no-records">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* {selectedProductList?.length > 0 &&
          <div className="consolidated-sum-total">
                <table style={{ width: '100%', marginTop: "5px"}}>
                  <tbody>
                    <tr>
                    <td style={{ width: "22%", paddingLeft: "10px" }}> 
                        <span className="total">Total({selectedProductList?.length})</span>
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
             {selectedProductList?.length > 0 && (
          <div className="consolidated-totals">
            <div style={{ textAlign: "center" }}>
              Total({selectedProductList?.length})
            </div>
            <div style={{ marginRight: "2px" }}>{totalReceivedGoods}</div>
            <div style={{ marginRight: "37px" }}>{totalSendGoods}</div>
            <div style={{ marginRight: "33px" }}>{totalWalkInSales}</div>
            <div style={{ marginRight: "11px" }}>{totalAdvisorSales}</div>
          </div>
        )}
        </div>
    </AUX>
  );
}

export default ProductwiseInventory;
