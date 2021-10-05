var validator = {
    validateAlpha: function(element:any) {
        return /^[A-Za-z ]+$/.test(element);
      },
      validateEmail: function(element:any) {
        return element && element.trim()
          ? /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(element)
          : true;
      },
      validatePassword: function(element:any) {
        return element && element.trim()
          ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
              element
            )
          : true;
      },
      validateNumeric: function(element:any) {
        return element && element.trim()
          ? /^-?\d*(\.\d+)?$/.test(element)
          : true;
      },
 }


 export default validator;