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