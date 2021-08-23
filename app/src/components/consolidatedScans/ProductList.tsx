import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import _ from "lodash";
import "../../assets/scss/consolidatedSales.scss";

type Props = {
  selectedProductList: Array<object>;
  brandName : String;
};

type States = {
};
class ProductList extends Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { selectedProductList,brandName } = this.props;

    return (
      <AUX>
          <div className="">
            <label className="font-weight-bold">Product Wise Scans - {_.startCase(_.toLower(brandName))}</label>
            <div className="consolidatedSales-table"  style={{height: '25vh', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                      <th>PRODUCT</th>
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
                                  <td>{_.startCase(_.toLower(item.productname))}</td>
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
          </div>
      </AUX>
    );
  }
}

export default ProductList;
