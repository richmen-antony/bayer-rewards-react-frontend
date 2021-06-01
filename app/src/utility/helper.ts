import { toastWarning } from "./widgets/toaster";
import _ from "lodash";

/**
 * Download excel file 
 * @param tableId 
 * @param fileName 
 */
export const downloadExcel =(tableId:any,fileName:string)=>{
        let excelFileName='excel_table_data';
        let TableDataType = 'application/vnd.ms-excel';
        let selectTable :any = document.getElementById(tableId);
        let htmlTable = selectTable.outerHTML.replace(/ /g, '%20');
        
        fileName = fileName?fileName+'.xls':excelFileName+'.xls';
        var excelFileURL = document.createElement("a");
        document.body.appendChild(excelFileURL);
        
        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['\ufeff', htmlTable], {
                type: TableDataType
            });
            navigator.msSaveOrOpenBlob( blob, fileName);
        }else{
            
            excelFileURL.href = 'data:' + TableDataType + ', ' + htmlTable;
            excelFileURL.download = fileName;
            excelFileURL.click();
        }

}

/**
 * To download the csv file format
 * @param csv 
 * @param filename 
 */
export const downloadCsvFile=(csv :any, filename:string)=>{
  if(!csv){
    toastWarning("No data available !");
  }else{
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
  }
   

}

export const isValidDate=(date:any)=>{
    if (!isNaN(Date.parse(date))) {
        return true
      } else {
        return false
      }
      
}

function objectValues<T extends {}>(obj: T) {
    return Object.keys(obj).map((objKey) => obj[objKey as keyof T]);
  }
  
  function objectKeys<T extends {}>(obj: T) {
    return Object.keys(obj).map((objKey) => objKey as keyof T);
  }


  export const DownloadCsv = (data:any,fileName:string)=>{
    if(!data || !data.length){
      toastWarning("No data available !");
    }else{
    const rows= data;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map((row:any) => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  
  }

  }

  export const hasDuplicate=(array:Array<any>,key:string)=> {
   return true;
  }

export const handledropdownoption = (array:Array<any>,key:string) => {
  const data : any = 
  array?.length > 0 &&
  array.map((val: any) => {
      return { value: val[key], text: val[key] }})
    return data;
};
