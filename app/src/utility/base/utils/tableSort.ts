// defines the prop definitions for alphaSort util
export type tableSortProps = {
    key: Array<string | object>;
    data: any;
};

function compareByAsc(key: any) {
  return function (a:any, b:any) {
    // let nameA=typeof a[key]==="string" ? a[key].toUpperCase():a[key];
    // let nameB=typeof b[key]==="string" ? b[key].toUpperCase():b[key];
    // if (nameA <nameB) return -1;
    // if (nameA >nameB) return 1;
    // return 0;
    let nameA=typeof a[key]==="string" ? a[key].toUpperCase():a[key];
    let va = (a[key] === null) ? "" : "" + a[key],
        vb = (b[key] === null) ? "" : "" + b[key];

    return va > vb ? 1 : ( va === vb ? 0 : -1 );
  };
}
function compareByDesc(key: any){
  return function (a:any, b:any) {
    // let nameA=typeof a[key]==="string" ? a[key].toUpperCase():a[key];
    // let nameB=typeof b[key]==="string" ? b[key].toUpperCase():b[key];
    // if (nameA < nameB) return 1;
    // if (nameA > nameB) return -1;
    // return 0;
    let va = (a[key] === null) ? "" : "" + a[key],
    vb = (b[key] === null) ? "" : "" + b[key];

    return va > vb ? -1 : ( va === vb ? 0 : -1 );
  };
}

// function compareByAsc(key: any) {
//     return function (a:any, b:any) {
//       if (a[key] < b[key]) return -1;
//       if (a[key] > b[key]) return 1;
//       return 0;
//     };
//   }

// function compareByDesc(key: any){
//     return function (a:any, b:any) {
//       if (a[key] < b[key]) return 1;
//       if (a[key] > b[key]) return -1;
//       return 0;
//     };
//   }

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