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

export const ProductList = ({
  selectedProductList,
  brandName,
  handleSort,
  isAsc,
  tableCellIndex,
  tableName
}:ProductListProps) => {
  return (
    <AUX>
        <div className="" style={{ marginTop: '-20px'}}>
          <label className="font-weight-bold scanlabel">product wise scans - {_.startCase(_.toLower(brandName))}</label>
          <div className="consolidatedSales-table scannedProducts"  style={{height: '22vh', overflowY: 'auto',marginTop: '-10px'}}>
            <table className="table">
              <thead>
                <tr>
                <th 
                     onClick={(e) => handleSort(e, "productname", selectedProductList, isAsc,"scannedProducts")}
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
                    <th>RECEIVE GOODS</th>
                    <th>SEND GOODS</th>
                    <th>S2F-WALK-IN-SALES</th>
                    <th>S2F-ADVISOR SALES</th>
                </tr>
              </thead>
              <tbody>
                {selectedProductList?.length > 0 ? (
                  selectedProductList?.map((item: any, i: number) => {
                    return (
                      <tr
                        style={{ cursor: "pointer" }}
                        key={i}
                      >
                                <td>{_.startCase(_.toLower(item.productname))}
                                <br /><label style={{fontSize:'10px'}}>{item.label}-{item.packagetype}</label></td>
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
                        <p className="total">Total({selectedProductList.length})</p>
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

export default ProductList;
