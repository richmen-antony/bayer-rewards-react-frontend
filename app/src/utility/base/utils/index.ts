
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
