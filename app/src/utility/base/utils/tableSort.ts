 /**
 * Sorting an array in ascending and descending order of given column                
 *
 * @version 1.0.0
 * @Modified 
 *    on 01-10-2021 for Date sorting
 */

import moment from "moment";

// defines the prop definitions for alphaSort util
export type tableSortProps = {
    key: Array<string | object>;
    data: any;
};

// Sorting an array in ascending order of given column 
function compareByAsc(key: any) {
  return function (a:any, b:any) {
    var x = a[key]; var y = b[key];
    if (x === y) { return 0; }
    if (x === null) {
        return -1;
    } else if (y === null) {
        return 1;
    } else if (typeof x === 'string') {
      const xDate = Date.parse(x);
      const yDate = Date.parse(y);
      if (isNaN(xDate) == false && isNaN(yDate) == false){
        var xx = moment(x).format('YYYY-MM-DD');
        var yy = moment(y).format('YYYY-MM-DD');
        return xx > yy ? 1 : xx < yy ? -1 : 0;
      } else{
        return x.localeCompare(y);
      }
    } else if (typeof x === 'number' || typeof x === 'boolean') {
        if (x < y) return -1;
        if (x > y) return 1;
    }
    return 0;
  };
}

// Sorting an array in descending order of given column
function compareByDesc(key: any){
  return function (a:any, b:any) {
    var x = a[key]; var y = b[key];
    if (x === y) { return 0; }
    if (x === null) {
        return 1;
    } else if (y === null) {
        return -1;
    } else if (typeof y === 'string') {
      const xDate = Date.parse(x);  
      const yDate = Date.parse(y);
      if (isNaN(xDate) == false && isNaN(yDate) == false){
        var xx = moment(x).format('YYYY-MM-DD');
        var yy = moment(y).format('YYYY-MM-DD');
        return xx > yy ? -1 : xx < yy ? 1 : 0;
      } else{
        return y.localeCompare(x);
      }
    } else if (typeof y === 'number' || typeof y === 'boolean') {
        if (x < y) return 1;
        if (x > y) return -1;
    }
    return 0;
  };
}

// Sorting invoking method
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