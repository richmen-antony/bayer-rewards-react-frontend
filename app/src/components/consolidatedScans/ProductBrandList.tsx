import React, { Component } from "react";
import AUX from "../../hoc/Aux_";
import _ from "lodash";
import "../../assets/scss/consolidatedSales.scss";

type Props = {
  selectedBrandList : Array<object>;
  getSelectedProducts : Function;
  distributorName : String;
  selectedBrand : Number;
};

type States = {
};
class ProductBrandList extends Component<Props, States> {
  tableCellIndex: any;
  timeOut: any;
  paginationRef:any;
  constructor(props: any) {
    super(props);
    this.timeOut = 0;
  }

  render() {
    const {selectedBrandList,getSelectedProducts,distributorName,selectedBrand} = this.props;
    return (
      <AUX>
            <div className="">
              <label className="font-weight-bold">Product Brand Wise Scans - {_.startCase(_.toLower(distributorName))}</label>
              <div className="consolidatedSales-table"  style={{height: '25vh', overflowY: 'auto' }}>
                <table className="table brandTable">
                  <thead>
                    <tr>
                        <th>BRAND</th>
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
           </div>
      </AUX>
    );
  }
}

export default ProductBrandList;
