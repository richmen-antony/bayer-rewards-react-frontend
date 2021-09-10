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
   
    var x = a[key]; var y = b[key];
    if (x === y) { return 0; }
    if (x === null) {
        return -1;
    } else if (y === null) {
        return 1;
    } else if (typeof x === 'string') {
        return x.localeCompare(y);
    } else if (typeof x === 'number' || typeof x === 'boolean') {
        if (x < y) return -1;
        if (x > y) return 1;
    }
    return 0;
  };
}
function compareByDesc(key: any){
  return function (a:any, b:any) {
    // let nameA=typeof a[key]==="string" ? a[key].toUpperCase():a[key];
    // let nameB=typeof b[key]==="string" ? b[key].toUpperCase():b[key];
    // if (nameA < nameB) return 1;
    // if (nameA > nameB) return -1;
    // return 0;

    var x = a[key]; var y = b[key];
    if (x === y) { return 0; }
    if (x === null) {
        return 1;
    } else if (y === null) {
        return -1;
    } else if (typeof y === 'string') {
        return y.localeCompare(x);
    } else if (typeof y === 'number' || typeof y === 'boolean') {
        if (x < y) return 1;
        if (x > y) return -1;
    }
    return 0;
  };
}

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