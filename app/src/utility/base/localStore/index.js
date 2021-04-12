
//Local storage
export const setLocalStorageData = (key,value) => localStorage.setItem(key, value);
export const getLocalStorageData = (key) => localStorage.getItem(key);
export const clearLocalStorageData = (key) => localStorage.removeItem(key);

// Session storage
export const setSessionData = (key,value) => sessionStorage.setItem(key, value);
export const getSessionData = (key) => sessionStorage.getItem(key);
export const clearSessionData = (key) => sessionStorage.removeItem(key);
