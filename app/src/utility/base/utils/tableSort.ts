// defines the prop definitions for alphaSort util
export type tableSortProps = {
    key: Array<string | object>;
    data: any;
};

function compareByAsc(key: any) {
    return function (a:any, b:any) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  }

function compareByDesc(key: any){
    return function (a:any, b:any) {
      if (a[key] < b[key]) return 1;
      if (a[key] > b[key]) return -1;
      return 0;
    };
  }

//Function for sorting in table header in asc and desc order
// Usage Implementation

// import {sortBy} from "../../../base/utils/tableSort";
// onSort(name, data) {
//   let arrayCopy = sortBy(name, data);
//   this.setState({ allScanLogs: arrayCopy });
// }
// <th>Name<span className="fa fa-caret-down"  onClick={()=>this.onSort('name', allScanLogs)}></span></th>

 export const sortBy = (key: any, data: any) => {
    let arrayCopy = [...data];
    const arrInStr = JSON.stringify(arrayCopy);
    arrayCopy.sort(compareByAsc(key));
    const arrInStr1 = JSON.stringify(arrayCopy);
    if (arrInStr === arrInStr1) {
      arrayCopy.sort(compareByDesc(key));
    }
    return arrayCopy;
  }