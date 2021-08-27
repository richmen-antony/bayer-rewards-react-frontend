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
  tableCellIndex: string;
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
                         (tableCellIndex === 'brand0') ? (
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
            <div>
                <table  className="table sum-total">
                  <tbody>
                    <tr>
                    <td>
                        <p className="total">Total({selectedBrandList.length})</p>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {2122}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="">
                          {4324}
                        </span>
                      </td>
                      <td>
                        <span className="">
                          {423432}
                        </span>
                      </td>
                      <td>
                      <span className="productprice">
                          {767}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
         </div>
    </AUX>
  );

}
export default ProductBrandList;
