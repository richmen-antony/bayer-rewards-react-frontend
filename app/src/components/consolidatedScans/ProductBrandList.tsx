import React from "react";
import AUX from "../../hoc/Aux_";
import _ from "lodash";
import "../../assets/scss/consolidatedSales.scss";

export type ProductBrandProps = {
  selectedBrandList : Array<object>;
  getSelectedProducts : Function;
  distributorName : String;
  selectedBrand : Number;
  handleSort :Function;
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
  tableName
}:ProductBrandProps) => {
  let totalReceivedGoods:number = 0;
  let totalSendGoods:number = 0;
  let totalWalkInSales:number = 0;
  let totalAdvisorSales:number = 0;
  return (
    <AUX>
          <div className="">
            <label className="font-weight-bold scanlabel">product brand wise scans - {_.startCase(_.toLower(distributorName))}</label>
            <div className="consolidatedSales-table scannedbrands"  style={{height: '24vh', overflowY: 'auto' }}>
              <table className="table brandTable">
                <thead>
                  <tr>
                  <th 
                     onClick={(e) => handleSort(e, "brandname", selectedBrandList, isAsc,"scannedBrands")}
                      key="brandname">BRAND
                      {
                         (tableCellIndex === 0 && tableName === 'scannedBrands') ? (
                            <i
                              className={`fas ${
                                isAsc ? "fa-sort-down" : "fa-sort-up"
                              } ml-3`}
                            ></i>
                          ) : null
                       }
                      </th>
                      <th>RECEIVE GOODS</th>
                      <th>SEND GOODS</th>
                      <th>S2F-WALK-IN-SALES</th>
                      <th>S2F-ADVISOR SALES</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBrandList.length > 0 ? (
                    selectedBrandList.map((item: any, idx: number) => {
                      totalReceivedGoods = totalReceivedGoods + (item.sendgoods);
                      totalSendGoods = totalSendGoods + (item.receivegoods);
                      totalWalkInSales = totalWalkInSales + (item.walkinsales);
                      totalAdvisorSales = totalAdvisorSales + (item.advisorsales);
                      return (
                        <tr
                        style={{ cursor: "pointer", backgroundColor : selectedBrand === idx ? '#F5FCFF' : ''}}
                          key={idx}
                          onClick ={()=>getSelectedProducts(item.distributorId,item.brandId,idx,'selected')}
                        >
                            <td>{_.startCase(_.toLower(item.brandname))}</td>
                            <td>{item.sendgoods}</td>
                            <td>{item.receivegoods}</td>
                            <td>{item.walkinsales}</td>
                            <td>{item.advisorsales}</td>
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
            {selectedBrandList.length > 0 &&
            <div>
                <table  className="table sum-total">
                  <tbody>
                    <tr>
                    <td>
                        <p className="total">Total({selectedBrandList.length})</p>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {totalReceivedGoods}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {totalSendGoods}
                        </span>
                      </td>
                      <td>
                        <span className="">
                          {totalWalkInSales}
                        </span>
                      </td>
                      <td>
                      <span className="productprice">
                          {totalAdvisorSales}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
         </div>
    </AUX>
  );

}
export default ProductBrandList;
