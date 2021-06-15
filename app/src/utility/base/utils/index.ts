
export const getErrorText = (errrorCode:any, args:any) => {
  if(errrorCode) {
    if(args) {
      try {
        args = JSON.parse(args);
      } catch (error) {
        console.warn(error);
      }
    }
    let transMessage =errrorCode || args;
    return transMessage || `Something went wrong. Please contact customer support.`;
  }
};

 //Allow only numbers
 export const isNumberKey = (e: any) => {
  var code = e.which ? e.which : e.keyCode;
  if (code > 31 && (code < 48 || code > 57)) {
    return e.preventDefault();
  }
};

//Allow only numbers and alphabets
export const allowAlphabetsNumbers = (e: any) => {
  var code = ('charCode' in e) ? e.charCode : e.keyCode;
  if (!(code === 32) && // space
    !(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)) { // lower alpha (a-z)
    return e.preventDefault();
  }
}
